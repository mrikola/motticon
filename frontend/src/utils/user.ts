import { Enrollment } from "../types/User";

export const getPlayerName = (enrollment: Enrollment): string => {
  const fullname: string =
    enrollment.player.firstName + " " + enrollment.player.lastName;
  return enrollment.dropped ? fullname + " DROPPED" : fullname;
};

export const isPlayerDropped = (
  enrollments: Enrollment[],
  userId: number
): boolean => {
  if (
    enrollments.filter(
      (enrollment) => enrollment.player.id === userId && enrollment.dropped
    ).length > 0
  ) {
    return true;
  } else {
    return false;
  }
};
