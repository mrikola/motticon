import { z } from "zod";
import { Draft, DraftPod, Match, PlayerTournamentScore, Round, Tournament } from "../types/Tournament";
import { Cube } from "../types/Cube";
import { LoginRequest, LoginResponse, LoginResponseSchema } from "../schemas/auth";
import { TournamentInfoResponseSchema, RoundSchema, TournamentSchema, DraftSchema, MatchSchema, DraftPodSchema, PlayerTournamentScoreSchema } from "../schemas/tournament";
import { CubeSchema } from "../schemas/cube";

// Error handling
export type ApiErrorType = 
  | 'validation'
  | 'auth'
  | 'network'
  | 'server'
  | 'notFound'
  | 'conflict'
  | 'unknown';

export class ApiException extends Error {
  constructor(
    public status: number, 
    message: string,
    public type: ApiErrorType
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Helper to categorize HTTP status codes
const categorizeError = (status: number, message: string): ApiException => {
  switch (true) {
    case status === 400:
      return new ApiException(status, message, 'validation');
    case status === 401 || status === 403:
      return new ApiException(status, message, 'auth');
    case status === 404:
      return new ApiException(status, message, 'notFound');
    case status === 409:
      return new ApiException(status, message, 'conflict');
    case status >= 500:
      return new ApiException(status, message, 'server');
    default:
      return new ApiException(status, message, 'unknown');
  }
};

// Legacy methods
const getHeaders = () => ({
  "Content-type": "application/json",
  Authorization: localStorage.getItem("user") || "",
  Origin: import.meta.env.VITE_FRONTEND_URL,
});

const getFileFormHeaders = () => ({
  Authorization: localStorage.getItem("user") || "",
  Origin: import.meta.env.VITE_FRONTEND_URL,
});

export const getURL = (path: string) =>
  new URL(`${import.meta.env.VITE_API_URL}${path}`);

const doFetch = (url: URL, method: string, body?: any) =>
  fetch(url, {
    method,
    mode: "cors",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

// Legacy exports
export const get = (path: string) => doFetch(getURL(path), "GET");
export const post = (path: string, body: any) =>
  doFetch(getURL(path), "POST", body);
export const put = (path: string, body?: any) =>
  doFetch(getURL(path), "PUT", body);
export const postFormData = (path: string, formData: FormData) => {
  return fetch(getURL(path), {
    method: "POST",
    mode: "cors",
    headers: getFileFormHeaders(),
    body: formData,
  });
};

interface SubmitResultRequest {
  matchId: number;
  roundId: number;
  resultSubmittedBy: number;
  player1GamesWon: string;
  player2GamesWon: string;
}

export class ApiClient {
  private static baseUrl = import.meta.env.VITE_API_URL;

  private static async request<T>(
    endpoint: string,
    options: RequestInit,
    schema: z.ZodType<T>
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('user') || '',
          Origin: import.meta.env.VITE_FRONTEND_URL,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw categorizeError(response.status, await response.text());
      }

      const rawData = await response.json();
      const result = schema.safeParse(rawData);
      
      if (!result.success) {
        console.error('Response validation failed:', result.error);
        throw new ApiException(500, 'Invalid response format from server', 'validation');
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiException(0, 'Network connection failed', 'network');
      }
      throw new ApiException(500, 'Unknown error occurred', 'unknown');
    }
  }

  // Auth endpoints
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request(
      '/user/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials)
      },
      LoginResponseSchema
    );
  }

  // Tournament endpoints
  static async getTournamentInfo(userId: number, tournamentId: number) {
    return this.request(
      `/user/${userId}/tournament/${tournamentId}`,
      { method: 'GET' },
      TournamentInfoResponseSchema
    );
  }

  static async getCubes(tournamentId: number) {
    return this.request<Cube[]>(
      `/tournament/${tournamentId}/cubes`,
      { method: 'GET' },
      z.array(CubeSchema)
    );
  }

  static async getPods(tournamentId: number) {
    return this.request(
      `/tournament/${tournamentId}/drafts`,
      { method: 'GET' },
      TournamentSchema
    );
  }

  static async getTournament(tournamentId: number): Promise<Tournament> {
    return this.request(
      `/tournament/${tournamentId}`,
      { method: 'GET' },
      TournamentSchema
    );
  }

  static async getCurrentRound(tournamentId: number): Promise<Round | undefined> {
    return this.request(
      `/tournament/${tournamentId}/round`,
      { method: 'GET' },
      RoundSchema
    ).catch(() => undefined);  // Return undefined if no current round
  }

  static async getCurrentDraft(tournamentId: number): Promise<Draft | undefined> {
    return this.request(
      `/tournament/${tournamentId}/draft`,
      { method: 'GET' },
      DraftSchema
    ).catch(() => undefined);  // Return undefined if no current draft
  }

  static async getPlayerMatch(tournamentId: number, roundId: number, playerId: number): Promise<Match | undefined> {
    return this.request(
      `/tournament/${tournamentId}/round/${roundId}/match/${playerId}`,
      { method: 'GET' },
      MatchSchema
    ).catch(() => undefined); 
  }

  static async getTournamentEnrollments(tournamentId: number): Promise<Tournament> {
    return this.request(
      `/tournament/${tournamentId}/enrollment`,
      { method: 'GET' },
      TournamentSchema
    );
  }

  static async getRecentRound(tournamentId: number): Promise<Round | undefined> {
    return this.request(
      `/tournament/${tournamentId}/round/recent`,
      { method: 'GET' },
      RoundSchema
    ).catch(() => undefined);
  }

  static async getDraftPodForUser(draftId: number, userId: number): Promise<DraftPod> {
    return this.request(
      `/draft/${draftId}/user/${userId}`,
      { method: 'GET' },
      DraftPodSchema
    );
  }

  static async getCubeById(cubeId: number): Promise<Cube> {
    return this.request(
      `/cube/${cubeId}`,
      { method: 'GET' },
      CubeSchema
    );
  }

  static async getMatchesByRound(roundId: number): Promise<Match[]> {
    return this.request(
      `/match/round/${roundId}`,
      { method: 'GET' },
      z.array(MatchSchema)
    );
  }

  static async getPlayerTournamentScore(tournamentId: number, playerId: number): Promise<PlayerTournamentScore> {
    return this.request(
      `/tournament/${tournamentId}/score/${playerId}`,
      { method: 'GET' },
      PlayerTournamentScoreSchema
    );
  }

  static async submitMatchResult(data: SubmitResultRequest): Promise<Match> {
    return this.request(
      '/match/submitResult',
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      MatchSchema
    );
  }
}
