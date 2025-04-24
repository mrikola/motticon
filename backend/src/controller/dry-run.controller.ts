import { Container } from "../container";
import { CubeService } from "../service/cube.service";
import { EnrollmentService } from "../service/enrollment.service";
import { PreferenceService } from "../service/preference.service";
import { TournamentService } from "../service/tournament.service";
import { UserService } from "../service/user.service";
import { sumArray } from "../util/array";
import { LIVE_DATA } from "../util/live-data";
import { LIVE_DATA_2025 } from "../util/live-data-2025";
import { randomize } from "../util/random";

const userService: UserService = Container.get("UserService");
const tournamentService: TournamentService = Container.get("TournamentService");
const cubeService: CubeService = Container.get("CubeService");
const enrollmentService: EnrollmentService = Container.get("EnrollmentService");
const preferenceService: PreferenceService = Container.get("PreferenceService");

const DRAFTS = 3;
const PREFERENCES_REQUIRED = 6;
const MINIMUM_WILDCARDS = 4;
const MAXIMUM_WILDCARDS = 4;
const DUMMY_PLAYERS = 6;

// how many players will pick cube with id 1 as their first pick instead of RNG
const OVERWHELMING_FAVORITE_PICKS = 24;

const PLAYER_COUNT = 96;
const CUBE_COUNT = 25; // number of distinct cubes
const CUBE_MULTIPLIERS = {
  // object full of id-count pairs
  // default is count = 1, this is just the deviations
  1: 2,
};

const FIRST_NAMES = [
  "Lars",
  "Mikael",
  "Anders",
  "Johan",
  "Erik",
  "Per",
  "Peter",
  "Thomas",
  "Sven",
  "Göran",
  "Oliver",
  "Emil",
];

const LAST_NAMES = [
  "Andersson",
  "Johansson",
  "Karlsson",
  "Nilsson",
  "Eriksson",
  "Larsson",
  "Olsson",
  "Persson",
];

const getEmail = (firstName: string, lastName: string) =>
  `${firstName}@${lastName}.se`;

const generatePriorityArray = (size: number): number[] => {
  if (size < 1) return [];
  const result = [1];
  [...Array(size - 1)].reduce((acc, _curVal, curIdx) => {
    const value = acc + Math.ceil((curIdx + 1) / 2);
    if (result.length < size) result.push(value);
    return value;
  }, 1);
  return result.reverse();
};

export const generateDryRunUsers = async () => {
  console.info("Generating test users");
  let playersCreated = 0;
  for (const firstName of FIRST_NAMES) {
    for (const lastName of LAST_NAMES) {
      const isDummy =
        FIRST_NAMES.length * LAST_NAMES.length - playersCreated - 1 <
        DUMMY_PLAYERS;
      await userService.createUser(
        !isDummy ? firstName : "DUMMY",
        lastName,
        getEmail(firstName, lastName),
        "asdf",
        isDummy
      );
      ++playersCreated;
    }
  }
  console.info("Done generating test users");
};

export const generateDryRunPods = async (live?: boolean) => {
  // 0. setup
  const cubes = (await cubeService.getAllCubes()).slice(0, CUBE_COUNT);

  if (PLAYER_COUNT > FIRST_NAMES.length * LAST_NAMES.length) {
    console.log(
      FIRST_NAMES.length * LAST_NAMES.length,
      "is not enough players to fulfill player count",
      PLAYER_COUNT
    );
  }

  const users = (
    await Promise.all(
      FIRST_NAMES.map(
        async (firstName) =>
          await Promise.all(
            LAST_NAMES.map(
              async (lastName) =>
                await userService.getUserByEmail(getEmail(firstName, lastName))
            )
          )
      )
    )
  )
    .flat()
    .slice(0, PLAYER_COUNT);

  const priorityScores = generatePriorityArray(PREFERENCES_REQUIRED);

  const wildCards = Math.floor(
    MINIMUM_WILDCARDS + Math.random() * (MAXIMUM_WILDCARDS - MINIMUM_WILDCARDS)
  );

  if (!users.length) {
    console.log("generate test users first");
    return;
  }

  const cubeMultipliers = {
    ...Object.fromEntries(cubes.map((cube) => [cube.id, 1])),
    ...CUBE_MULTIPLIERS,
  };

  const totalCubes = sumArray(Object.values(cubeMultipliers));

  if (totalCubes * 8 < PLAYER_COUNT) {
    console.log(
      `${totalCubes} is not enough cubes, must have at least ${Math.ceil(
        PLAYER_COUNT / 8
      )} cubes for ${PLAYER_COUNT} player dry run`
    );
    return;
  }

  // 1. generate dry run tournament
  const tournament = await tournamentService.createTournament(
    "Motticon sim",
    "dry run of pod algorithm",
    0, // price
    PLAYER_COUNT, // players
    DRAFTS,
    PREFERENCES_REQUIRED,
    new Date(),
    new Date(),
    cubeMultipliers,
    true
  );

  // 2. enroll test users into the tournament
  await Promise.all(
    users.map(
      async (user) =>
        await enrollmentService.enrollIntoTournament(tournament.id, user.id)
    )
  );

  // 3. generate preferences
  const realUsers = users.filter((user) => !user.isDummy).slice(wildCards);

  if (live) {
    console.log("LIVE DATA BAYBAY");
    users.forEach((user, index) => {
      if (index < LIVE_DATA_2025.length) {
        Object.entries(LIVE_DATA_2025[index]).forEach(([key, value]) => {
          preferenceService.setPreference(
            tournament.id,
            user.id,
            Number(key),
            value
          );
        });
      }
    });
  } else {
    realUsers.forEach((user, index) => {
      const shuffledCubes = cubes
        .filter((sc) => sc.id !== cubes[0].id)
        .sort(randomize);

      if (index < OVERWHELMING_FAVORITE_PICKS) {
        // make one cube the overwhelming favorite
        preferenceService.setPreference(
          tournament.id,
          user.id,
          cubes[0].id,
          priorityScores[0]
        );

        for (let i = 1; i < PREFERENCES_REQUIRED; ++i) {
          preferenceService.setPreference(
            tournament.id,
            user.id,
            shuffledCubes[i].id,
            priorityScores[i]
          );
        }
      } else {
        for (let i = 0; i < PREFERENCES_REQUIRED; ++i) {
          preferenceService.setPreference(
            tournament.id,
            user.id,
            shuffledCubes[i].id,
            priorityScores[i]
          );
        }
      }
    });
  }
  // 4. construct pods
  await tournamentService.generateDrafts(tournament.id);

  const theoreticalMaximumPerPlayer = sumArray(priorityScores.slice(0, DRAFTS));

  console.log(
    "Theoretical maximum score: ",
    theoreticalMaximumPerPlayer *
      (live ? LIVE_DATA_2025.length : realUsers.length)
  );
};
