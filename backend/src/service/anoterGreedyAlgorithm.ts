import {
  DraftPodGenerationStrategy,
  PreferencesByPlayer,
} from "../dto/tournaments.dto";
import { Cube } from "../entity/Cube";
import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";
import { randomize } from "../util/random";

export const WILD_CARD_IDENTIFIER = 999999;
export const DUMMY_IDENTIFIER = 999998;

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
  return playerId !== WILD_CARD_IDENTIFIER && pod.players.includes(playerId);
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

const isCubeAvailableInCubeCon = (
  cubeId: number,
  playerId: number,
  cubeCon: CubeCon
) => {
  return cubeCon.rounds.some(
    (round) =>
      isCubeInRound(cubeId, round) &&
      isCubeAvailableInRound(cubeId, round) &&
      !isPlayerInRound(playerId, round)
  );
};

const placeCubeIntoCubeCon = (
  cubeId: number,
  playerId: number,
  cubeCon: CubeCon
) => {
  // Cube is already in and you can fit players
  if (isCubeAvailableInCubeCon(cubeId, playerId, cubeCon)) {
    return true;
  }
  for (let i = 0; i < cubeCon.rounds.length; ++i) {
    const round = cubeCon.rounds[i];

    if (!isCubeInRound(cubeId, round) && !isPlayerInRound(playerId, round)) {
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

  return preferencesByPlayer;
};

const hasPlayerUsedAllPreferences = (
  playerId: number,
  preferences: PreferencesByPlayer
) => {
  return (
    preferences[playerId].filter((pref) => pref.used).length >= 3 ||
    preferences[playerId].every((pref) => pref.used)
  );
};

const findHighestPlayersForCube = (
  prefernces: PreferencesByPlayer,
  cubeId: number
) => {
  const allPReferences = Object.values(prefernces).flatMap((x) => x);
  const preferencesForCube = allPReferences.filter(
    (pref) => pref.cube === cubeId && !pref.used
  );
  const highestPlayers = preferencesForCube
    .sort(randomize)
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

const isCubeFullInCubecon = (cubeId: number, cubeCon: CubeCon): boolean => {
  let isFull = true;
  cubeCon.rounds.forEach((round) => {
    if (
      round.pods.every((pod) => pod.cubeId === -1) ||
      (round.pods.some((pod) => pod.cubeId === -1) &&
        !round.pods.some((pod) => pod.cubeId === cubeId))
    ) {
      isFull = false;
    } else if (
      round.pods.some(
        (pod) => pod.cubeId === cubeId && pod.players.includes(-1)
      )
    ) {
      isFull = false;
    }
  });
  return isFull;
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

const getAvailableCubes = (cubes: Cube[], cubeCon: CubeCon) => {
  return cubes.filter((cube) => {
    return !isCubeFullInCubecon(cube.id, cubeCon);
  });
};

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
  // const [draftNumber, podNumber, playerNumber] = findEmptiestDraft(cubeCon);
  // cubeCon.rounds[draftNumber].pods[podNumber].players[playerNumber] =
  //   WILD_CARD_IDENTIFIER;
  let placed = false;
  cubeCon.rounds.forEach((round) => {
    round.pods.forEach((pod) => {
      if (pod.cubeId === cubeId && pod.players.includes(-1) && !placed) {
        pod.players[pod.players.indexOf(-1)] = WILD_CARD_IDENTIFIER;
        placed = true;
      }
    });
  });
};

const cubeConIntoPreferentialPodAssignments = (
  cubeCon: CubeCon,
  preferencePoints: number
): PreferentialPodAssignments[] => {
  return [
    {
      strategy: ["greedy", "greedy", "greedy"],
      penaltyPoints: 0,
      penaltyReasons: [],
      preferencePoints: preferencePoints,
      assignments: cubeCon.rounds.map((round, index) => ({
        draftNumber: index + 1,
        pods: round.pods.map((pod) => ({
          cube: {
            id: pod.cubeId,
            title: "foo",
            description: "bar",
            owner: "baz",
            url: "boz",
            imageUrl: "fuu",
            tournaments: [],
          },
          players: pod.players.map((player) => ({
            id: player,
            firstName: `F${player}`,
            lastName: `L${player}`,
            email: "email",
            password: "asd",
            isAdmin: false,
            isDummy: false,
            rating: 123,
            enrollments: [],
            tournamentsStaffed: [],
          })),
        })),
      })),
    },
  ];
};

const handleCubeConWildCards = (
  cubeCon: CubeCon,
  enrollments: Enrollment[],
  preferncesByPlayer: PreferencesByPlayer
): CubeCon => {
  const users = enrollments.map((enrollment) => enrollment.player);
  const usersWithoutAllPreferencesMet = users.filter(
    (user) =>
      !preferncesByPlayer[user.id] ||
      !hasPlayerUsedAllPreferences(user.id, preferncesByPlayer)
  );
  const cubeConWithRealUsers = initializeCubeCon();
  cubeCon.rounds.forEach((round, roundIndex) => {
    round.pods.forEach((pod, podIndex) => {
      cubeConWithRealUsers.rounds[roundIndex].pods[podIndex].cubeId =
        cubeCon.rounds[roundIndex].pods[podIndex].cubeId;
      pod.players.forEach((player, playerIndex) => {
        if (player !== WILD_CARD_IDENTIFIER) {
          cubeConWithRealUsers.rounds[roundIndex].pods[podIndex].players[
            playerIndex
          ] = cubeCon.rounds[roundIndex].pods[podIndex].players[playerIndex];
        } else {
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
          wildCardUsers.sort(randomize);
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

const generateCubeCon = (
  preferences: Preference[],
  tournament: Tournament,
  podsPerDraft: number,
  enrollments: Enrollment[],
  cubes: Cube[]
) => {
  const cubeCon = initializeCubeCon();
  let targetCube: number = -1;
  let targetPlayer: number = -1;
  let cubePlacedInCubecon = false;
  let playerPlacedInCubecon = false;
  const preferencesByPlayer = getPreferencesByPlayer(preferences);
  do {
    if (targetPlayer !== -1 && targetCube !== -1) {
      markCubeAsUsed(targetPlayer, targetCube, preferencesByPlayer);
    }
    const availableCubes = getAvailableCubes(cubes, cubeCon);

    const cubesByPreference = getCubesByPreference(
      availableCubes,
      preferences,
      preferencesByPlayer
    );
    let targetCubeIndex = 0;
    let targetCubeFound = false;
    do {
      targetCube = cubesByPreference[targetCubeIndex].id;
      const targetPlayers = findHighestPlayersForCube(
        preferencesByPlayer,
        targetCube
      );
      targetPlayer = targetPlayers.find(
        (player) =>
          player === WILD_CARD_IDENTIFIER ||
          placeCubeIntoCubeCon(targetCube, player, cubeCon)
      );
      if (!targetPlayer) {
        targetPlayer = WILD_CARD_IDENTIFIER;
      }

      targetCubeFound = !!targetPlayer;
      targetCubeIndex++;
    } while (!targetCubeFound && targetCubeIndex < cubesByPreference.length);
    playerPlacedInCubecon =
      targetPlayer === WILD_CARD_IDENTIFIER ||
      placePlayerIntoCube(targetPlayer, targetCube, cubeCon);
    if (targetPlayer === WILD_CARD_IDENTIFIER) {
      placeWildCardIntoCubeCon(cubeCon, targetCube);
      cubePlacedInCubecon = true;
      playerPlacedInCubecon = true;
    }
  } while (getAvailableCubes(cubes, cubeCon).length > 0);
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

  const wildCardsHandled = handleCubeConWildCards(
    cubeCon,
    enrollments,
    preferencesByPlayer
  );
  return { cubeCon: wildCardsHandled, preferencePoints: spentPreferencePoints };
};

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
  return noInvalidPlayers && everyoneAssignedThreeTimes;
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

const iterationAmount = 1000;

export const alternateGeneratePodAssignments = async (
  preferences: Preference[],
  tournament: Tournament,
  podsPerDraft: number,
  enrollments: Enrollment[],
  cubes: Cube[]
): Promise<PreferentialPodAssignments[]> => {
  const potentialCubeCons = Array.from({ length: iterationAmount }).map(() =>
    generateCubeCon(preferences, tournament, podsPerDraft, enrollments, cubes)
  );
  const validationResult = validateCubeCons(potentialCubeCons, enrollments);
  validationResult.validCubeCons.sort(
    (a, b) => b.preferencePoints - a.preferencePoints
  );
  console.info(
    `After ${iterationAmount} iterations, ${validationResult.validCubeCons.length} valid cube cons were found and ${validationResult.invalidCubeConAmount} were discarded.`
  );
  return Promise.resolve(
    cubeConIntoPreferentialPodAssignments(
      validationResult.validCubeCons[0].cubeCon,
      validationResult.validCubeCons[0].preferencePoints
    )
  );
};
