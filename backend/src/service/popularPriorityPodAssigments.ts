import { getHeapCodeStatistics, getHeapStatistics } from "v8";
import {
  PreferencesByPlayer,
  PreferentialPodAssignments,
} from "../dto/tournaments.dto";
import { Cube } from "../entity/Cube";
import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";
import { Tournament } from "../entity/Tournament";
import { randomize } from "../util/random";
import { sumArray } from "../util/array";

export const WILD_CARD_IDENTIFIER = 999999;
export const DUMMY_IDENTIFIER = 999998;

type DraftPod = {
  players: [number, number, number, number, number, number, number, number];
  cubeId: number;
};

type Round = {
  pods: DraftPod[];
};

const isPlayerInPod = (playerId: number, pod: DraftPod) => {
  return playerId !== WILD_CARD_IDENTIFIER && pod.players.includes(playerId);
};

const isCubeInRound = (cubeId: number, round: Round) => {
  return round.pods.some((pod) => pod.cubeId === cubeId);
};

const isCubeAvailableInRound = (cube: Cube, round: Round) => {
  const copies = getCubeAllocations(cube);
  return round.pods.filter((pod) => pod.cubeId === cube.id).length < copies;
};

const isPlayerInRound = (playerId: number, round: Round) => {
  return round.pods.some((pod) => isPlayerInPod(playerId, pod));
};

type CubeCon = {
  rounds: [Round, Round, Round];
};

const isSeatsAvailableForCubeInRound = (cubeId: number, round: Round) => {
  return round.pods.some(
    (pod) => pod.cubeId === cubeId && pod.players.includes(-1)
  );
};

const isCubeAvailableInCubeCon = (
  cubeId: number,
  playerId: number,
  cubeCon: CubeCon
) => {
  return cubeCon.rounds.some(
    (round) =>
      isCubeInRound(cubeId, round) &&
      isSeatsAvailableForCubeInRound(cubeId, round) &&
      !isPlayerInRound(playerId, round)
  );
};

const placeCubeIntoCubeCon = (
  cube: Cube,
  playerId: number,
  cubeCon: CubeCon
) => {
  // Cube is already in and you can fit players
  if (isCubeAvailableInCubeCon(cube.id, playerId, cubeCon)) {
    return true;
  }

  for (let i = 0; i < cubeCon.rounds.length; ++i) {
    const round = cubeCon.rounds[i];

    const isCubeAvailable = isCubeAvailableInRound(cube, round);
    const isPlayerAvailable = !isPlayerInRound(playerId, round);

    if (isCubeAvailable && isPlayerAvailable) {
      for (let j = 0; j < round.pods.length; ++j) {
        const pod = round.pods[j];

        if (pod.cubeId === -1) {
          pod.cubeId = cube.id;
          return true;
        }
      }
    }
  }
  return false;
};

const placePlayerIntoCube = (
  playerId: number,
  cubeId: number,
  cubeCon: CubeCon
) => {
  if (playerId === WILD_CARD_IDENTIFIER) {
    placeWildCardIntoCubeCon(cubeCon, cubeId);
    return true;
  }
  for (let i = 0; i < cubeCon.rounds.length; ++i) {
    const round = cubeCon.rounds[i];

    // console.log("pods", JSON.stringify(round.pods));

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

const hasPlayerPlayedTheCube = (
  playerId: number,
  cubeId: number,
  cubeCon: CubeCon
) => {
  return cubeCon.rounds.some((round) =>
    round.pods.some(
      (pod) => pod.cubeId === cubeId && pod.players.includes(playerId)
    )
  );
};

const isPlayerInThreeRounds = (playerId: number, cubeCon: CubeCon) => {
  return (
    cubeCon.rounds
      .flatMap((round) =>
        round.pods.flatMap((pod) => pod.players.includes(playerId))
      )
      .filter((x) => x).length === 3
  );
};

const initializeCubeCon = (podsPerDraft: number): CubeCon => {
  return {
    rounds: [
      {
        pods: Array.from({ length: podsPerDraft }, () => ({
          players: [-1, -1, -1, -1, -1, -1, -1, -1],
          cubeId: -1,
        })),
      },
      {
        pods: Array.from({ length: podsPerDraft }, () => ({
          players: [-1, -1, -1, -1, -1, -1, -1, -1],
          cubeId: -1,
        })),
      },
      {
        pods: Array.from({ length: podsPerDraft }, () => ({
          players: [-1, -1, -1, -1, -1, -1, -1, -1],
          cubeId: -1,
        })),
      },
    ],
  };
};

/**
 * Get preferences for players. This monkypatches dummy preferences
 * to the place of missing ones.
 *
 * @param preferences Original preferences
 * @returns Prefences by player
 */
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

  // Monkepatching begins
  const dummyPreference = (playerId: number) => ({
    player: playerId,
    cube: -1,
    points: 0,
    used: false,
  });

  Object.values(preferencesByPlayer).forEach((prefs) => {
    if (prefs.length < 3) {
      for (let i = prefs.length; i < 3; i++) {
        prefs.push(dummyPreference(prefs[0].player));
      }
    }
  });
  // Monkeypatching ends

  return preferencesByPlayer;
};

/**
 * This function kinda assumes that every preference is validly
 * generated (has at least 3 preferences). Recommend monkeypatching
 * data if this is not the case for algorithmic simplicity.
 *
 * @param playerId Target player
 * @param preferences Players' preferences
 * @returns Whether player has preferences fulfilled
 */
const hasPlayerUsedAllPreferences = (
  playerId: number,
  preferences: PreferencesByPlayer
) => {
  return (
    preferences[playerId].filter((pref) => pref.used).length >= 3 ||
    preferences[playerId].every((pref) => pref.used)
  );
};

/**
 * Find the players who want to play the cube most.
 *
 * @param preferences Preferences for players
 * @param cubeId Target cube
 * @returns List of players sorted from highest preference to lowest
 */
const findHighestPlayersForCube = (
  preferences: PreferencesByPlayer,
  cubeId: number
) => {
  const allPreferences = Object.values(preferences).flatMap((x) => x);
  const preferencesForCube = allPreferences.filter(
    (pref) => pref.cube === cubeId && !pref.used
  );
  const highestPlayers = preferencesForCube
    .sort(randomize) // Used for different iterations, since the pick order matters
    .sort((a, b) => b.points - a.points)
    .map((pref) => pref.player);

  return highestPlayers.length > 0 ? highestPlayers : [WILD_CARD_IDENTIFIER];
};

const markCubeAsUsed = (
  playerId: number,
  cubeId: number,
  preferences: PreferencesByPlayer
) => {
  if (playerId !== WILD_CARD_IDENTIFIER)
    preferences[playerId].find((x) => x.cube === cubeId).used = true;
};

export const getCubeAllocations = (cube: Cube) =>
  sumArray(cube.tournamentAllocations.map((cube) => cube.count));

const getCubesByPreference = (
  cubes: Cube[],
  preferences: Preference[],
  preferencesByPlayer: PreferencesByPlayer
) => {
  const sorted = cubes
    .map((cube) => ({
      id: cube.id,
      points: sumArray(
        preferences
          .filter(
            (pref) =>
              pref.cube.id === cube.id &&
              preferencesByPlayer[pref.player.id].find(
                (x) => x.cube === cube.id && !x.used
              )
          )
          .map((pref) => pref.points)
      ),
      copies: getCubeAllocations(cube),
    }))
    .sort((a, b) => b.points - a.points);

  return sorted.flatMap((cube) =>
    Array.from({ length: cube.copies }, () => cube)
  );
};

/**
 * Helper to figure out if a cube usable still
 *
 * @param cubeId Cube to check
 * @param cubeCon Tournament to check
 * @returns Whether you can put in players into this cube in this tournament
 */
const isCubeFullInCubecon = (cube: Cube, cubeCon: CubeCon): boolean => {
  let isFull = true;
  for (const round of cubeCon.rounds) {
    // First, check if we can insert this cube into the tournament
    if (
      round.pods.find((pod) => pod.cubeId === -1) &&
      round.pods.filter((pod) => pod.cubeId == cube.id).length <
        getCubeAllocations(cube)
    ) {
      isFull = false;
      break;
    } else if (
      // Else check if this round has this cube, whether players can be inserted
      round.pods.some(
        (pod) => pod.cubeId === cube.id && pod.players.includes(-1)
      )
    ) {
      isFull = false;
      break;
    }
  }
  return isFull;
};

const getAvailableCubes = (cubes: Cube[], cubeCon: CubeCon) => {
  return cubes.filter((cube) => {
    return !isCubeFullInCubecon(cube, cubeCon);
  });
};

// Could be useful, but not needed in the current implementation
const findEmptiestDraft = (cubeCon: CubeCon): [number, number, number] => {
  let draftNumber = -1;
  let podNumber = -1;
  let playerNumber = -1;
  cubeCon.rounds.forEach((round, draftIndex) => {
    round.pods.forEach((pod, podIndex) => {
      pod.players.forEach((player, playerIndex) => {
        if (player === -1 && playerNumber < playerIndex) {
          draftNumber = draftIndex;
          podNumber = podIndex;
          playerNumber = playerIndex;
        }
      });
    });
  });
  return [draftNumber, podNumber, playerNumber];
};

const placeWildCardIntoCubeCon = (cubeCon: CubeCon, cubeId: number) => {
  let placed = false;

  for (const round of cubeCon.rounds) {
    for (const pod of round.pods) {
      if (pod.cubeId === cubeId) {
        if (pod.players.includes(-1) && !placed) {
          pod.players[pod.players.indexOf(-1)] = WILD_CARD_IDENTIFIER;
          placed = true;
          break;
        }
      }
    }
  }
  return placed;
};

const cubeConsIntoPreferentialPodAssignments = (
  cubeCons: ReturnType<typeof generateCubeCon>[],
  enrollments: Enrollment[]
): PreferentialPodAssignments[] => {
  return cubeCons.map((cubeCon) => ({
    strategy: ["greedy", "greedy", "greedy"],
    penaltyPoints: 0,
    penaltyReasons: [],
    preferencePoints: cubeCon.preferencePoints,
    algorithmType: "popular-cube-priority",
    assignments: cubeCon.cubeCon.rounds.map((round, index) => ({
      draftNumber: index + 1,
      pods: round.pods.map((pod) => ({
        cube: {
          id: pod.cubeId,
          title: "foo",
          description: "bar",
          owner: "baz",
          url: "boz",
          imageUrl: "fuu",
          tournamentAllocations: [],
          cardlist: null,
        },
        players: pod.players.map(
          (player) => enrollments.find((x) => x.player.id === player).player
        ),
      })),
    })),
  }));
};

/**
 * The main placement function only fills in wildcards where it can't
 * assign players. This function resolves those by using the enrolled
 * players with missing preferences and the players whose preferences
 * could not be met.
 *
 * This doesn't necessarily make valid assignments.
 *
 * @param cubeCon With the players placed whose preferences could be met
 * @param enrollments Enrolled players
 * @param preferncesByPlayer Player preferences
 * @returns A cubecon (valid or not) with wild cards resolved
 */
const handleCubeConWildCards = (
  cubeCon: CubeCon,
  podsPerDraft: number,
  enrollments: Enrollment[],
  preferncesByPlayer: PreferencesByPlayer
): CubeCon => {
  const users = enrollments.map((enrollment) => enrollment.player);
  const usersWithoutAllPreferencesMet = users.filter(
    (user) =>
      !preferncesByPlayer[user.id] ||
      !hasPlayerUsedAllPreferences(user.id, preferncesByPlayer)
  );
  // Initialize a new tournament that we'll fill with the placed players
  // and resolved wildcards
  const cubeConWithRealUsers = initializeCubeCon(podsPerDraft);
  cubeCon.rounds.forEach((round, roundIndex) => {
    round.pods.forEach((pod, podIndex) => {
      // Copy the cube id from the original tournament
      cubeConWithRealUsers.rounds[roundIndex].pods[podIndex].cubeId =
        cubeCon.rounds[roundIndex].pods[podIndex].cubeId;
      pod.players.forEach((player, playerIndex) => {
        // If the player was placed correctly, copy it over
        if (player !== WILD_CARD_IDENTIFIER) {
          cubeConWithRealUsers.rounds[roundIndex].pods[podIndex].players[
            playerIndex
          ] = cubeCon.rounds[roundIndex].pods[podIndex].players[playerIndex];
        } else {
          // If not, place a wildcard here (valid if you can).
          // Note the comparision with the original and new tournament -
          // we fill the new one from start and there might be things to check
          // later, so compare both old and new
          const wildCardUsers = usersWithoutAllPreferencesMet.filter(
            (user) =>
              !isPlayerInRound(
                user.id,
                cubeConWithRealUsers.rounds[roundIndex]
              ) &&
              !isPlayerInRound(user.id, cubeCon.rounds[roundIndex]) &&
              !hasPlayerPlayedTheCube(
                user.id,
                cubeConWithRealUsers.rounds[roundIndex].pods[podIndex].cubeId,
                cubeConWithRealUsers
              ) &&
              !hasPlayerPlayedTheCube(
                user.id,
                cubeCon.rounds[roundIndex].pods[podIndex].cubeId,
                cubeCon
              ) &&
              !isPlayerInThreeRounds(user.id, cubeConWithRealUsers) &&
              !isPlayerInThreeRounds(user.id, cubeCon)
          );
          // Used for the iteration purposes, some of these are valid and some not
          wildCardUsers.sort(randomize);
          // If we couldn't fit a wildcard user, mark the tournament as invalid with
          // the dummy user
          const wildCardUser = wildCardUsers[0] || {
            id: DUMMY_IDENTIFIER,
            firstName: "Dummy",
            lastName: "Dummy",
            email: "dummy",
            password: "dummy",
            isAdmin: false,
            isDummy: true,
            rating: 0,
            enrollments: [],
            tournamentsStaffed: [],
          };
          cubeConWithRealUsers.rounds[roundIndex].pods[podIndex].players[
            playerIndex
          ] = wildCardUser.id;
          // Update the player preferences (assumed to contain at least 3 preferences per player)
          // TODO: hanling of missing prferences. Recommendation is to monkypatch the data
          if (preferncesByPlayer[wildCardUser.id]) {
            const unusedPreference = preferncesByPlayer[wildCardUser.id].find(
              (pref) => !pref.used
            );
            if (unusedPreference) {
              markCubeAsUsed(
                wildCardUser.id,
                unusedPreference.cube,
                preferncesByPlayer
              );
            }
          }
        }
      });
    });
  });
  return cubeConWithRealUsers;
};

/**
 * The actual generation function. Initializes an empty tournament
 * and starts filling it.
 *
 * @param preferences Player submitted preferences
 * @param tournament Not used, but maintains parameter compatibility
 * @param podsPerDraft How many pods per draft (usually players / 8)
 * @param enrollments Enrolled players
 * @param cubes Available cubes
 * @returns The preferential pod assignments
 */
const generateCubeCon = (
  preferences: Preference[],
  tournament: Tournament,
  podsPerDraft: number,
  enrollments: Enrollment[],
  cubes: Cube[]
) => {
  const cubeCon = initializeCubeCon(podsPerDraft);
  // Initialize our variables used in the iteration below

  let targetCubeId: number = -1;
  let targetPlayer: number = -1;
  let cubePlacedInCubecon = false;
  let playerPlacedInCubecon = false;

  const preferencesByPlayer = getPreferencesByPlayer(preferences);
  for (
    let player = 0;
    player < tournament.drafts.length * tournament.totalSeats;
    player++
  ) {
    // Update the player preference status so that they don't get
    // assigned again
    if (targetPlayer !== -1 && targetCubeId !== -1) {
      markCubeAsUsed(targetPlayer, targetCubeId, preferencesByPlayer);
    }

    // Get the available cubes
    const availableCubes = getAvailableCubes(cubes, cubeCon);

    // Sort the available cubes for the popularity priority order
    const cubesByPreference = getCubesByPreference(
      availableCubes,
      preferences,
      preferencesByPlayer
    );

    let targetCubeIndex = 0;
    let targetCubeFound = false;
    // Find a cube we can put players in - usually it's the most popular one,
    // but if it is not, let's put players into the next popular one and fill
    // the rest with wildcards
    do {
      targetCubeId = cubesByPreference[targetCubeIndex].id;
      const targetCube = availableCubes.find(
        (cube) => cube.id === targetCubeId
      );
      // Get the list of available players sorted by their preferences.
      // Need the list here, since the one who has this most prioirtized
      // might already be assigned to another cube in this round.
      const targetPlayers = findHighestPlayersForCube(
        preferencesByPlayer,
        targetCubeId
      );

      targetPlayer = targetPlayers.find(
        (player) =>
          player === WILD_CARD_IDENTIFIER ||
          placeCubeIntoCubeCon(targetCube, player, cubeCon) // With the cube (and place the cube, if it's a new one)
      );
      // No available players found, fill in a wild card for alter processing
      if (!targetPlayer) {
        targetPlayer = WILD_CARD_IDENTIFIER;
      }

      targetCubeFound = !!targetPlayer;
      targetCubeIndex++;
    } while (!targetCubeFound && targetCubeIndex < cubesByPreference.length);
    // Now place the player into the cube
    playerPlacedInCubecon =
      targetPlayer === WILD_CARD_IDENTIFIER ||
      placePlayerIntoCube(targetPlayer, targetCubeId, cubeCon);
    // If that failed, place a wild card into the cube instead
    if (targetPlayer === WILD_CARD_IDENTIFIER) {
      placeWildCardIntoCubeCon(cubeCon, targetCubeId);
      cubePlacedInCubecon = true;
      playerPlacedInCubecon = true;
    }
  }
  // while (getAvailableCubes(cubes, cubeCon).length > 0);
  // Check how many preference points were used to sort later
  const spentPreferencePoints = Object.values(preferencesByPlayer).reduce(
    (acc, cur) => {
      return (
        acc +
        cur.reduce(
          (innerAcc, innerCur) =>
            innerAcc + (innerCur.used ? innerCur.points : 0),
          0
        )
      );
    },
    0
  );

  // Fill in the wild cards where we could not place players
  const wildCardsHandled = handleCubeConWildCards(
    cubeCon,
    podsPerDraft,
    enrollments,
    preferencesByPlayer
  );
  return { cubeCon: wildCardsHandled, preferencePoints: spentPreferencePoints };
};

/**
 * Check that the assignment is valid, since the aggressive
 * prioritization of populad cubes makes it so that wildcard
 * players and those whose wishes can't be met can't be properly
 * placed.
 *
 * @param cubeCon Assigmnent to validate
 * @param enrollments Enrolled players
 * @returns Whether the assignment is valid
 */
const isCubeConValid = (
  cubeCon: CubeCon,
  enrollments: Enrollment[]
): boolean => {
  const noInvalidPlayers = cubeCon.rounds.every((round) =>
    round.pods.every((pod) =>
      pod.players.every(
        (player) =>
          player !== WILD_CARD_IDENTIFIER &&
          player !== DUMMY_IDENTIFIER &&
          player !== -1
      )
    )
  );
  const everyoneAssignedThreeTimes = enrollments.every((enrollment) => {
    const user = enrollment.player;
    return isPlayerInThreeRounds(user.id, cubeCon);
  });

  const noTwoDummiesInAnyPod = cubeCon.rounds.every((round) => {
    return round.pods.every((pod) => {
      const dummies = pod.players.filter((player) => {
        return (
          player !== DUMMY_IDENTIFIER &&
          player !== -1 &&
          enrollments.find((x) => x.player.id === player).player.isDummy
        );
      });
      return dummies.length <= 1;
    });
  });

  /*
  if (!noInvalidPlayers) {
    console.log("Invalid players found");
  }
  if (!everyoneAssignedThreeTimes) {
    console.log("Not all players were assigned into three draft pods");
  }
  if (!noTwoDummiesInAnyPod) {
    console.log("More than two dummies were placed into the same pod");
  }
  */

  return noInvalidPlayers && everyoneAssignedThreeTimes && noTwoDummiesInAnyPod;
};

const validateCubeCons = (
  potentialCubeCons: ReturnType<typeof generateCubeCon>[],
  enrollments: Enrollment[]
) => {
  const validCubeCons = potentialCubeCons.filter((cubeCon) =>
    isCubeConValid(cubeCon.cubeCon, enrollments)
  );
  return {
    validCubeCons,
    invalidCubeConAmount: potentialCubeCons.length - validCubeCons.length,
  };
};

const iterationAmount = 2000;

/**
 * Generate preferential pod assignments based on popular cube priority.
 * Popular cube priority algorithm is roughly:
 *
 * 1. Sort cubes by popularity
 * 2. Assign player to the most popoular cube based on available preferences
 * 3. Update cubes list and player preferences
 * 4. Repeat until all cubes are full
 *
 * Players with no preferneces are added in the end as wildcards.
 *
 * Due to above, the algorithm will generate invalid assignments, since
 * the it might be that wild cards cannot be assigned and the assignment
 * still be valid. Roughly 40% of generated assigmnets are valid.
 *
 * @param preferences Player submitted preferences
 * @param tournament Not used, but maintains parameter compatibility
 * @param podsPerDraft How many pods per draft (usually players / 8)
 * @param enrollments Enrolled players
 * @param cubes Available cubes
 * @returns The preferential pod assignments
 */
export const popularPriorityPodAssignments = async (
  preferences: Preference[],
  tournament: Tournament,
  podsPerDraft: number,
  enrollments: Enrollment[],
  cubes: Cube[]
): Promise<PreferentialPodAssignments[]> => {
  console.info("Start run of the popular cube priority algorithm.");
  console.info(`Generating ${iterationAmount} cube cons.`);

  const potentialCubeCons: { cubeCon: CubeCon; preferencePoints: number }[] =
    Array.from({ length: iterationAmount });

  for (let index = 0; index < potentialCubeCons.length; ++index) {
    if (index % 100 === 0) {
      console.info(`Generating cube con ${index + 1} of ${iterationAmount}.`);
    }
    potentialCubeCons[index] = generateCubeCon(
      preferences,
      tournament,
      podsPerDraft,
      enrollments,
      cubes
    );
  }

  const validationResult = validateCubeCons(potentialCubeCons, enrollments);
  validationResult.validCubeCons.sort(
    (a, b) => b.preferencePoints - a.preferencePoints
  );
  console.info(
    `After ${iterationAmount} iterations, ${validationResult.validCubeCons.length} valid cube cons were found and ${validationResult.invalidCubeConAmount} were discarded.`
  );
  console.info("End run of the popular cube priority algorithm.");
  return Promise.resolve(
    cubeConsIntoPreferentialPodAssignments(
      validationResult.validCubeCons,
      enrollments
    )
  );
};
