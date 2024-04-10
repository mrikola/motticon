import { DataSource } from "typeorm";
import {
  DraftPodGenerationStrategy,
  PreferencesByPlayer,
} from "../dto/tournaments.dto";
import { Cube } from "../entity/Cube";
import { DraftPod } from "../entity/DraftPod";
import { User } from "../entity/User";
import { makeArray } from "../util/array";
import { randomize } from "../util/random";
import { CubeService } from "./cube.service";
import { PreferenceService } from "./preference.service";
import { TournamentService } from "./tournament.service";
import { AppDataSource } from "../data-source";

type derp = {
  preferencePoints: number;
  assignments: {
    draftNumber: number;
    pods: {
      cube: Cube;
      players: User[];
    }[];
  }[];
};

export class PodGenerationService {
  private appDataSource: DataSource;
  private tournamentService: TournamentService;
  private cubeService: CubeService;
  private preferenceService: PreferenceService;

  constructor() {
    this.appDataSource = AppDataSource;
    this.tournamentService = new TournamentService();
    this.cubeService = new CubeService();
    this.preferenceService = new PreferenceService();
  }

  async getPreferentialPodAssignments(tournamentId: number) {
    const tournament = await this.tournamentService.getTournamentAndDrafts(
      tournamentId
    );
    const enrollments = (
      await this.tournamentService.getTournamentEnrollments(tournamentId)
    ).enrollments;
    const cubes = await this.cubeService.getCubesForTournament(tournamentId);
    const podsPerDraft = tournament.totalSeats / 8;

    const foo: derp[] = [];

    const preferences =
      await this.preferenceService.getPreferencesForTournament(tournamentId);

    const iterationsPerStrategy = 10;

    const podGenerationStrategies: DraftPodGenerationStrategy[][] = [
      ["greedy", "sparing", "sparing"],
      ["greedy", "greedy", "sparing"],
      ["greedy", "greedy", "greedy"],
    ];

    for (const strategy of podGenerationStrategies) {
      for (let iteration = 0; iteration < iterationsPerStrategy; ++iteration) {
        // SET UP FOR A PARTICULAR ITERATION
        const wildCardAssignments: {
          [key: number]: number[];
        } = {};

        const preferencesByPlayer: PreferencesByPlayer = {};
        preferences.forEach((preference) => {
          let currentPlayerPreference =
            preferencesByPlayer[preference.player.id];
          const pref = {
            player: preference.playerId,
            cube: preference.cube.id,
            points: preference.points,
            used: false,
          };

          if (!currentPlayerPreference) {
            preferencesByPlayer[preference.player.id] = [pref];
          } else {
            currentPlayerPreference.push(pref);
          }
        });

        let totalPreferencePointsUsed = 0;

        const assignments: User[][][] = makeArray(
          tournament.drafts.length,
          podsPerDraft,
          8
        );

        let herp: derp = {
          preferencePoints: 0,
          assignments: [],
        };

        let draftIndex = 0;
        for (let draft of tournament.drafts.sort(
          (a, b) => a.draftNumber - b.draftNumber
        )) {
          let preferencePointsUsed = 0;
          let unassignedPlayers = enrollments.map((enroll) => enroll.player);
          const draftPods: DraftPod[] = [];

          const wildCards = unassignedPlayers
            .filter(
              (player) =>
                !preferencesByPlayer[player.id] ||
                preferencesByPlayer[player.id].filter((pref) => !pref.used)
                  .length === 0
            )
            .sort(randomize);

          for (let podNumber = 1; podNumber <= podsPerDraft; ++podNumber) {
            const cubeIndex =
              strategy[draftIndex] === "greedy"
                ? 0 // for greedy strategy, take the most popular cube available
                : podsPerDraft - podNumber; // for sparing strategy, take the Nth most popular where N is pods to be generated

            const cubesByPreference = cubes
              // filter out cubes already used in this draft
              .filter(
                (cube) => !draftPods.find((pod) => pod.cube.id === cube.id)
              )
              .map((cube) => ({
                id: cube.id,
                points: preferences
                  .filter(
                    (pref) =>
                      pref.cube.id === cube.id &&
                      !preferencesByPlayer[pref.player.id].find(
                        (x) => x.cube === cube.id
                      )?.used
                  )
                  .reduce((acc, cur) => acc + cur.points, 0),
              }))
              .sort((a, b) => b.points - a.points);

            const currentCubeId = cubesByPreference[cubeIndex].id;
            const preferredPlayers = preferences // find players who..
              .filter((pref) => pref.cube.id === currentCubeId) // want to play this cube
              .sort(randomize)
              .sort((a, b) => b.points - a.points) // have rated it highly
              .filter(
                // have not already been assigned to play it in an earlier draft
                (pref) =>
                  !preferencesByPlayer[pref.player.id].find(
                    (x) => x.cube === currentCubeId
                  )?.used
              )
              .filter(
                (
                  pref // and have not been assigned to a different cube in this draft
                ) =>
                  unassignedPlayers.find(
                    (player) => player.id === pref.player.id
                  )
              )
              .slice(0, 8)
              .map((pref) => {
                preferencePointsUsed += pref.points;
                return pref;
              })
              .map((pref) => pref.player);

            // if pod is not full, fill it with wildcards
            while (preferredPlayers.length < 8 && wildCards.length > 0) {
              // check that the wildcard hasn't played this cube earlier
              const assigned = wildCards
                .filter(
                  (wc) =>
                    !(wildCardAssignments[wc.id] ?? []).includes(currentCubeId)
                )
                .pop();

              if (!assigned && wildCards.length > 0) {
                // console.log("can't assign wildcard");
                break;
              }

              if (assigned) {
                wildCardAssignments[assigned.id] = wildCardAssignments[
                  assigned.id
                ]
                  ? wildCardAssignments[assigned.id].concat(currentCubeId)
                  : [currentCubeId];
              }
            }

            // if pod is STILL not full, fill it with randoms
            while (preferredPlayers.length < 8) {
              preferredPlayers.push(
                ...unassignedPlayers
                  .filter(
                    (player) =>
                      !preferredPlayers.find((pp) => pp.id === player.id)
                  )
                  .slice(0, 8 - preferredPlayers.length)
              );
            }

            assignments[draftIndex][podNumber - 1] = preferredPlayers;

            /* 
            console.log(
              `Draft ${
                draftIndex + 1
              }, pod ${podNumber} (cube ${currentCubeId})`,
              JSON.stringify(
                preferredPlayers.map(
                  (pp) =>
                    `${pp.firstName} ${pp.lastName} (${
                      preferencesByPlayer[pp.id]?.find(
                        (p) => p.cube === currentCubeId
                      )?.points ?? "W"
                    })`
                )
              )
            );
            */

            // clear assigned players from the unassigned list for this draft
            unassignedPlayers = unassignedPlayers.filter(
              (player) => !preferredPlayers.find((pp) => pp.id === player.id)
            );

            // and take this cube away from their preferences
            preferredPlayers.forEach((pp) => {
              if (preferencesByPlayer[pp.id]) {
                const pref = preferencesByPlayer[pp.id].find(
                  (pref) => pref.cube === currentCubeId
                );
                if (pref) pref.used = true;
              } else {
                wildCardAssignments[pp.id] = wildCardAssignments[pp.id]
                  ? wildCardAssignments[pp.id].concat(currentCubeId)
                  : [currentCubeId];
              }
            });

            const draftPod = await this.appDataSource
              .getRepository(DraftPod)
              .create({
                podNumber,
                draft,
                cube: cubesByPreference[cubeIndex],
              });

            draftPods.push(draftPod);
          }

          /* add nothing to db in this method
          await this.tournamentService.generateDraftSeatings(
            draftPods,
            assignments[draftIndex].flat()
          );
          */

          console.log("Preference points used", preferencePointsUsed);

          herp.preferencePoints += preferencePointsUsed;
          herp.assignments.push({
            draftNumber: draft.draftNumber,
            pods: draftPods.map((pod) => ({
              cube: pod.cube,
              players: assignments[draftIndex][pod.podNumber - 1],
            })),
          });

          totalPreferencePointsUsed += preferencePointsUsed;
          draftIndex++;
        }
        foo.push(herp);
        console.log("Total preference points used", totalPreferencePointsUsed);
      }
    }

    console.log(
      "points used in each iteration",
      foo
        // .sort((a, b) => b.preferencePoints - a.preferencePoints)
        .map((foo) => foo.preferencePoints)
    );
  }
}
