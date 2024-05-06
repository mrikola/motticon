import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";
import { Tournament } from "../entity/Tournament";
import { PlayerTournamentInfo, tournamentToDto } from "../dto/tournaments.dto";
import { TournamentService } from "./tournament.service";
import { enrollmentToDto, preferenceToDto } from "../dto/user.dto";

export class EnrollmentService {
  private appDataSource: DataSource;
  private repository: Repository<Enrollment>;
  private tournamentService: TournamentService;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Enrollment);
    this.tournamentService = new TournamentService();
  }

  async enrollIntoTournament(
    tournamentId: number,
    userId: number
  ): Promise<Tournament> {
    try {
      await this.appDataSource
        .createQueryBuilder()
        .insert()
        .into(Enrollment)
        .values({
          player: { id: userId },
          tournament: { id: tournamentId },
          paid: false,
          dropped: false,
        })
        .execute();
      const tournamentWithEnrollments =
        await this.tournamentService.getTournamentEnrollments(tournamentId);
      return tournamentWithEnrollments;
    } catch (err: unknown) {
      return null;
    }
  }

  async cancelEnrollment(
    tournamentId: number,
    userId: number
  ): Promise<boolean> {
    // placeholder returning just boolean instead of object from getUserTournamentInfo()
    try {
      // todo: make sure this actually works and doesn't break stuff horribly
      this.appDataSource
        .createQueryBuilder()
        .delete()
        .from(Enrollment)
        .where("tournamentId = :tournamentId", { tournamentId })
        .andWhere("playerId = :userId", { userId })
        .execute();
      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async staffCancelEnrollment(
    tournamentId: number,
    userId: number
  ): Promise<Tournament> {
    try {
      await this.appDataSource
        .createQueryBuilder()
        .delete()
        .from(Enrollment)
        .where("tournamentId = :tournamentId", { tournamentId })
        .andWhere("playerId = :userId", { userId })
        .execute();
    } catch (err: unknown) {
      return null;
    }
    const tournament = await this.tournamentService.getTournamentEnrollments(
      tournamentId
    );
    return tournament;
  }

  async dropFromTournament(
    tournamentId: number,
    userId: number
  ): Promise<Tournament> {
    // placeholder returning just boolean
    try {
      await this.appDataSource
        .createQueryBuilder()
        .update(Enrollment)
        .set({
          dropped: true,
        })
        .where("tournamentId = :tournamentId", { tournamentId })
        .andWhere("playerId = :userId", { userId })
        .execute();
    } catch (err: unknown) {
      return null;
    }
    const tournament = await this.tournamentService.getTournamentEnrollments(
      tournamentId
    );
    return tournament;
  }

  async getUserTournamentInfo(
    userId: number,
    tournamentId: number
  ): Promise<PlayerTournamentInfo> {
    // get tournament basics
    const tournament = await this.appDataSource
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.enrollments", "enrollment")
      .where("tournament.id = :tournamentId", { tournamentId })
      .getOne();

    // get enrollment
    const enrollment = await this.repository
      .createQueryBuilder("enrollment")
      .leftJoinAndSelect("enrollment.player", "user")
      .where("user.id = :userId and enrollment.tournamentId = :tournamentId", {
        userId,
        tournamentId,
      })
      .getOne();

    // get preferences
    const preferences = await this.appDataSource
      .getRepository(Preference)
      .createQueryBuilder("preference")
      .where(
        'preference."playerId" = :userId and preference."tournamentId" = :tournamentId',
        { userId, tournamentId }
      )
      .getMany();
    return {
      tournament: tournamentToDto(tournament),
      enrollment: enrollmentToDto(enrollment),
      preferences: preferences.map(preferenceToDto),
    };
  }

  async getEnrollment(userId: number, tournamentId: number) {
    return await this.repository
      .createQueryBuilder("enrollment")
      .where(
        "enrollment.userId = :userId and enrollment.tournamentId = :tournamentId",
        {
          userId,
          tournamentId,
        }
      )
      .getOne();
  }
}
