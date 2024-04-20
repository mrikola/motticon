import {
  DraftPodGenerationStrategy,
  PreferencesByPlayer,
} from "../dto/tournaments.dto";
import { Cube } from "../entity/Cube";
import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";

export const WILD_CARD_IDENTIFIER = 999999;

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
    placeWildCardIntoCubeCon(cubeCon);
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

const hasPlayerUsedAllPreferences = (
  playerId: number,
  preferences: PreferencesByPlayer
) => {
  return preferences[playerId].every((pref) => pref.used);
};

const findHighestPlayerForCube = (
  prefernces: PreferencesByPlayer,
  cubeId: number
) => {
  let highestPlayer = -1;
  let highestPoints = -1;

  Object.values(prefernces).forEach((prefs) => {
    const pref = prefs.find((x) => x.cube === cubeId && !x.used);

    if (
      pref &&
      pref.points > highestPoints &&
      !hasPlayerUsedAllPreferences(pref.player, prefernces)
    ) {
      highestPlayer = pref.player;
      highestPoints = pref.points;
    }
  });

  return highestPlayer !== -1 ? highestPlayer : WILD_CARD_IDENTIFIER;
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

const placeWildCardIntoCubeCon = (cubeCon: CubeCon) => {
  const [draftNumber, podNumber, playerNumber] = findEmptiestDraft(cubeCon);
  cubeCon.rounds[draftNumber].pods[podNumber].players[playerNumber] =
    WILD_CARD_IDENTIFIER;
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
      targetPlayer = findHighestPlayerForCube(preferencesByPlayer, targetCube);
      cubePlacedInCubecon =
        targetPlayer === WILD_CARD_IDENTIFIER ||
        placeCubeIntoCubeCon(targetCube, targetPlayer, cubeCon);
      targetCubeFound = cubePlacedInCubecon;
      targetCubeIndex++;
    } while (!targetCubeFound && targetCubeIndex < cubesByPreference.length);
    console.info("Target Cube: ", targetCube);
    console.info("Target Player: ", targetPlayer);
    playerPlacedInCubecon =
      targetPlayer === WILD_CARD_IDENTIFIER ||
      placePlayerIntoCube(targetPlayer, targetCube, cubeCon);
    console.info("Cube Placed in Cubecon: ", cubePlacedInCubecon);
    console.info("Player Placed in Cubecon: ", playerPlacedInCubecon);
    if (targetPlayer === WILD_CARD_IDENTIFIER) {
      placeWildCardIntoCubeCon(cubeCon);
      cubePlacedInCubecon = true;
      playerPlacedInCubecon = true;
    }
  } while (getAvailableCubes(cubes, cubeCon).length > 0);
  console.info(JSON.stringify(cubeCon, null, 2));
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
  console.info("Spent Preference Points: ", spentPreferencePoints);
  return Promise.resolve(
    cubeConIntoPreferentialPodAssignments(cubeCon, spentPreferencePoints)
  );
};
