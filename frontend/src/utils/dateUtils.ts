import dayjs from "dayjs";

export const formatTournamentDate = (
  startDate: Date,
  endDate: Date,
): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  return start.isSame(end, "day")
    ? start.format("DD/MM/YYYY")
    : `${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`;
};
