import { DraftDto, draftToDto } from "../dto/draft.dto";
import { MatchDto, RoundDto, matchToDto, roundToDto } from "../dto/round.dto";
import { TournamentDto, tournamentToDto } from "../dto/tournaments.dto";
import { Preference } from "../entity/Preference";
import { EnrollmentService } from "../service/enrollment.service";
import { TournamentService } from "../service/tournament.service";

const tournamentService = new TournamentService();
const enrollmentService = new EnrollmentService();

export const createTournament = async (req): Promise<TournamentDto> => {
  const {
    name,
    description,
    price,
    players,
    drafts,
    preferencesRequired,
    startDate,
    endDate,
    cubeIds,
    userEnrollmentEnabled,
  } = req.body;
  return tournamentToDto(
    await tournamentService.createTournament(
      name,
      description,
      price,
      players,
      drafts,
      preferencesRequired,
      startDate,
      endDate,
      cubeIds,
      userEnrollmentEnabled
    )
  );
};

export const getAllTournaments = async (): Promise<TournamentDto[]> => {
  return (await tournamentService.getAllTournaments()).map(tournamentToDto);
};

export const getOngoingTournaments = async (): Promise<TournamentDto[]> => {
  return (await tournamentService.getOngoingTournaments()).map(tournamentToDto);
};

export const getFutureTournaments = async (): Promise<TournamentDto[]> => {
  return (await tournamentService.getFutureTournaments()).map(tournamentToDto);
};

export const getPastTournaments = async (): Promise<TournamentDto[]> => {
  return (await tournamentService.getPastTournaments()).map(tournamentToDto);
};

export const getTournament = async (req): Promise<TournamentDto> => {
  const { tournamentId } = req.params;
  return tournamentToDto(
    await tournamentService.getTournament(tournamentId as number)
  );
};

export const getTournamentEnrollments = async (req): Promise<TournamentDto> => {
  const { tournamentId } = req.params;
  return tournamentToDto(
    await tournamentService.getTournamentEnrollments(tournamentId as number)
  );
};

export const getTournamentAndDrafts = async (req): Promise<TournamentDto> => {
  const { tournamentId } = req.params;
  return tournamentToDto(
    await tournamentService.getTournamentAndDrafts(tournamentId as number)
  );
};

export const getCurrentDraft = async (req): Promise<DraftDto> => {
  const { tournamentId } = req.params;
  return draftToDto(
    await tournamentService.getCurrentDraft(tournamentId as number)
  );
};

export const getCurrentRound = async (req): Promise<RoundDto> => {
  const { tournamentId } = req.params;
  return roundToDto(
    await tournamentService.getCurrentRound(tournamentId as number)
  );
};

export const getCurrentMatch = async (req): Promise<MatchDto> => {
  const { roundId, userId } = req.params;
  return matchToDto(
    await tournamentService.getCurrentMatch(userId as number, roundId as number)
  );
};

export const getMostRecentRound = async (req): Promise<RoundDto> => {
  const { tournamentId } = req.params;
  return roundToDto(
    await tournamentService.getMostRecentRound(tournamentId as number)
  );
};

export const startTournament = async (req): Promise<TournamentDto> => {
  const { tournamentId } = req.params;
  return tournamentToDto(
    await tournamentService.startTournament(tournamentId as number)
  );
};

export const endTournament = async (req): Promise<TournamentDto> => {
  const { tournamentId } = req.params;
  return tournamentToDto(
    await tournamentService.endTournament(tournamentId as number)
  );
};

export const generateDrafts = async (req): Promise<TournamentDto> => {
  const { tournamentId } = req.params;
  return tournamentToDto(
    await tournamentService.generateDrafts(tournamentId as number)
  );
};

export const initiateDraft = async (req): Promise<DraftDto> => {
  const { tournamentId, draftId } = req.params;
  return draftToDto(
    await tournamentService.initiateDraft(
      tournamentId as number,
      draftId as number
    )
  );
};

export const startDraft = async (req): Promise<DraftDto> => {
  const { tournamentId, draftId } = req.params;
  return draftToDto(
    await tournamentService.startDraft(
      tournamentId as number,
      draftId as number
    )
  );
};

export const endDraft = async (req): Promise<TournamentDto> => {
  const { tournamentId, draftId } = req.params;
  return tournamentToDto(
    await tournamentService.endDraft(tournamentId as number, draftId as number)
  );
};

export const initiateRound = async (req): Promise<RoundDto> => {
  const { tournamentId, roundId } = req.params;
  return roundToDto(
    await tournamentService.initiateRound(
      tournamentId as number,
      roundId as number
    )
  );
};

export const startRound = async (req): Promise<RoundDto> => {
  const { tournamentId, roundId } = req.params;
  return roundToDto(
    await tournamentService.startRound(
      tournamentId as number,
      roundId as number
    )
  );
};

export const endRound = async (req): Promise<RoundDto> => {
  const { tournamentId, roundId } = req.params;
  return roundToDto(
    await tournamentService.endRound(tournamentId as number, roundId as number)
  );
};

export const enrollIntoTournament = async (req): Promise<TournamentDto> => {
  const { tournamentId, userId } = req.params;
  return tournamentToDto(
    await enrollmentService.enrollIntoTournament(
      tournamentId as number,
      userId as number
    )
  );
};

export const cancelEnrollment = async (req): Promise<boolean> => {
  const { tournamentId, userId } = req.params;
  return await enrollmentService.cancelEnrollment(
    tournamentId as number,
    userId as number
  );
};

export const staffCancelEnrollment = async (req): Promise<TournamentDto> => {
  const { tournamentId, userId } = req.params;
  return tournamentToDto(
    await enrollmentService.staffCancelEnrollment(
      tournamentId as number,
      userId as number
    )
  );
};

export const dropFromTournament = async (req): Promise<boolean> => {
  const { tournamentId, userId } = req.params;
  return await enrollmentService.dropFromTournament(
    tournamentId as number,
    userId as number
  );
};

// todo: for testing use only
export const getPreferences = async (req): Promise<Preference[]> => {
  const { tournamentId } = req.params;
  return;
  await tournamentService.getPreferences(tournamentId as number);
};
