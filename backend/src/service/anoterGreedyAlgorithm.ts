import {
  DraftPodGenerationStrategy,
  PreferencesByPlayer,
} from "../dto/tournaments.dto";
import { Cube } from "../entity/Cube";
import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";

type DraftPod = {
  players: [number, number, number, number, number, number, number, number];
  cubeId: number;
};

type Round = {
  pods: [
    DraftPod,
    DraftPod,
    DraftPod,
    DraftPod,
    DraftPod,
    DraftPod,
    DraftPod,
    DraftPod
  ];
};

const isPlayerInPod = (playerId: number, pod: DraftPod) => {
  return pod.players.includes(playerId);
};

const isCubeInRound = (cubeId: number, round: Round) => {
  return round.pods.some((pod) => pod.cubeId === cubeId);
};

const isPlayerInRound = (playerId: number, round: Round) => {
  return round.pods.some((pod) => isPlayerInPod(playerId, pod));
};

type CubeCon = {
  rounds: [Round, Round, Round];
};

const isCubeAvailableInRound = (cubeId: number, round: Round) => {
  return round.pods.some(
    (pod) => pod.cubeId === cubeId && pod.players.includes(-1)
  );
};

const isCubeAvailableInCubeCon = (cubeId: number, cubeCon: CubeCon) => {
  return cubeCon.rounds.some(
    (round) =>
      isCubeInRound(cubeId, round) && isCubeAvailableInRound(cubeId, round)
  );
};

const placeCubeIntoCubeCon = (cubeId: number, cubeCon: CubeCon) => {
  // Cube is already in and you can fit players
  if (isCubeAvailableInCubeCon(cubeId, cubeCon)) {
    return true;
  }
  for (let i = 0; i < cubeCon.rounds.length; ++i) {
    const round = cubeCon.rounds[i];

    if (!isCubeInRound(cubeId, round)) {
      for (let j = 0; j < round.pods.length; ++j) {
        const pod = round.pods[j];

        if (pod.cubeId === -1) {
          pod.cubeId = cubeId;
          return true;
        }
      }
    }
  }
  return false;
};

const placePLayerIntoCube = (
  playerId: number,
  cubeId: number,
  cubeCon: CubeCon
) => {
  for (let i = 0; i < cubeCon.rounds.length; ++i) {
    const round = cubeCon.rounds[i];

    if (isCubeInRound(cubeId, round) && !isPlayerInRound(playerId, round)) {
      for (let j = 0; j < round.pods.length; ++j) {
        const pod = round.pods[j];

        if (
          !isPlayerInPod(playerId, pod) &&
          pod.cubeId === cubeId &&
          pod.players.includes(-1)
        ) {
          for (let k = 0; k < pod.players.length; ++k) {
            if (pod.players[k] === -1) {
              pod.players[k] = playerId;
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

const initializeCubeCon = (): CubeCon => {
  return {
    rounds: [
      {
        pods: [
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
        ],
      },
      {
        pods: [
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
        ],
      },
      {
        pods: [
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
          { players: [-1, -1, -1, -1, -1, -1, -1, -1], cubeId: -1 },
        ],
      },
    ],
  };
};

const getPreferencesByPlayer = (preferences: Preference[]) => {
  const preferencesByPlayer: PreferencesByPlayer = {};

  preferences.forEach((pref) => {
    if (!preferencesByPlayer[pref.player.id]) {
      preferencesByPlayer[pref.player.id] = [];
    }

    preferencesByPlayer[pref.player.id].push({
      player: pref.player.id,
      cube: pref.cube.id,
      points: pref.points,
      used: false,
    });
  });

  return preferencesByPlayer;
};

const findHighestPlayerForCube = (
  prefernces: PreferencesByPlayer,
  cubeId: number
) => {
  let highestPlayer = -1;
  let highestPoints = -1;

  Object.values(prefernces).forEach((prefs) => {
    const pref = prefs.find((x) => x.cube === cubeId && !x.used);

    if (pref && pref.points > highestPoints) {
      highestPlayer = pref.player;
      highestPoints = pref.points;
    }
  });

  return highestPlayer;
};

const markCubeAsUsed = (
  playerId: number,
  cubeId: number,
  preferences: PreferencesByPlayer
) => {
  preferences[playerId].find((x) => x.cube === cubeId).used = true;
};

const getCubesByPreference = (
  cubes: Cube[],
  preferences: Preference[],
  preferencesByPlayer: PreferencesByPlayer
) => {
  return cubes
    .map((cube) => ({
      id: cube.id,
      points: preferences
        .filter(
          (pref) =>
            pref.cube.id === cube.id &&
            !preferencesByPlayer[pref.player.id].find((x) => x.cube === cube.id)
              ?.used
        )
        .reduce((acc, cur) => acc + cur.points, 0),
    }))
    .sort((a, b) => b.points - a.points);
};

type PreferentialPodAssignments = {
  preferencePoints: number;
  penaltyPoints: number;
  penaltyReasons: string[];
  strategy: DraftPodGenerationStrategy[];
  assignments: {
    draftNumber: number;
    pods: {
      cube: Cube;
      players: User[];
    }[];
  }[];
};

export const alternateGeneratePodAssignments = async (
  preferences: Preference[],
  tournament: Tournament,
  podsPerDraft: number,
  enrollments: Enrollment[],
  cubes: Cube[]
): Promise<PreferentialPodAssignments[]> => {
  const cubeCon = initializeCubeCon();
  let targetCube: number = -1;
  let targetPlayer: number = -1;
  const preferencesByPlayer = getPreferencesByPlayer(preferences);
  do {
    if (targetPlayer !== -1 && targetCube !== -1) {
      markCubeAsUsed(targetPlayer, targetCube, preferencesByPlayer);
    }
    const cubesByPreference = getCubesByPreference(
      cubes,
      preferences,
      preferencesByPlayer
    );
    targetCube = cubesByPreference[0].id;
    targetPlayer = findHighestPlayerForCube(preferencesByPlayer, targetCube);
    console.info("Target Cube: ", targetCube);
    console.info("Target Player: ", targetPlayer);
  } while (
    placeCubeIntoCubeCon(targetCube, cubeCon) &&
    placePLayerIntoCube(targetPlayer, targetCube, cubeCon)
  );
  console.info(JSON.stringify(cubeCon, null, 2));
  return Promise.resolve([]);
};
