import { CubeService } from "../service/cube.service";
import { EnrollmentService } from "../service/enrollment.service";
import { PreferenceService } from "../service/preference.service";
import { TournamentService } from "../service/tournament.service";
import { UserService } from "../service/user.service";
import { LIVE_DATA } from "../util/live-data";
import { randomize } from "../util/random";

const userService = new UserService();
const tournamentService = new TournamentService();
const cubeService = new CubeService();
const enrollmentService = new EnrollmentService();
const preferenceService = new PreferenceService();

const DRAFTS = 3;
const PREFERENCES_REQUIRED = 5;
const MINIMUM_WILDCARDS = 5;
const MAXIMUM_WILDCARDS = 12;
const DUMMY_PLAYERS = 3;

const FIRST_NAMES = [
  "Lars",
  "Mikael",
  "Anders",
  "Johan",
  "Erik",
  "Per",
  "Peter",
  "Thomas",
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
      const isDummy = playersCreated < DUMMY_PLAYERS;
      await userService.createUser(
        isDummy ? firstName : "DUMMY",
        lastName,
        getEmail(firstName, lastName),
        "asdf",
        isDummy
      );
      ++playersCreated;
    }
  }
};

export const generateDryRunPods = async (live?: boolean) => {
  // 0. setup
  const cubes = await cubeService.getAllCubes();

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
  ).flat();

  const priorityScores = generatePriorityArray(PREFERENCES_REQUIRED);

  const wildCards = Math.floor(
    MINIMUM_WILDCARDS + Math.random() * (MAXIMUM_WILDCARDS - MINIMUM_WILDCARDS)
  );

  if (!users.length) {
    console.log("generate test users first");
    return;
  }

  if (cubes.length < 8) {
    console.log("must have at least 8 cubes for 64 player dry run");
    return;
  }

  // 1. generate dry run tournament
  const tournament = await tournamentService.createTournament(
    "Motticon sim",
    "dry run of pod algorithm",
    0, // price
    64, // players
    DRAFTS,
    PREFERENCES_REQUIRED,
    new Date(),
    new Date(),
    cubes.map((cube) => cube.id),
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
      if (index < LIVE_DATA.length) {
        Object.entries(LIVE_DATA[index]).forEach(([key, value]) => {
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

      if (index < 24) {
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

  console.log(
    "Theoretical maximum score: ",
    15 * (live ? LIVE_DATA.length : realUsers.length)
  );
};
