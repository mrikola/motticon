import { Container } from 'typedi';
import { IocContainer } from '@tsoa/runtime';
import { AppDataSource } from './data-source';
import { CardService } from './service/card.service';
import { CubeService } from './service/cube.service';
import { EnrollmentService } from './service/enrollment.service';
import { TournamentService } from './service/tournament.service';
import { UserService } from './service/user.service';
import { PreferenceService } from './service/preference.service';
import { DraftService } from './service/draft.service';
import { MatchService } from './service/match.service';
import { RatingService } from './service/rating.service';
import { ScoreService } from './service/score.service';
import { ComputerVisionService } from './service/computerVision.service';
import { FileService } from './service/file.service';
import { UserController } from './controller/user.controller';

// Register services
Container.set('DataSource', AppDataSource);
Container.set('CardService', new CardService(AppDataSource));
Container.set('PreferenceService', new PreferenceService(AppDataSource));
Container.set('MatchService', new MatchService(AppDataSource));
Container.set('ComputerVisionService', new ComputerVisionService(
    AppDataSource,
    Container.get('CardService')
));
Container.set('UserService', new UserService(
    AppDataSource,
    Container.get('PreferenceService')
));
Container.set('RatingService', new RatingService(
    AppDataSource,
    Container.get('UserService')
));
Container.set('ScoreService', new ScoreService(
    AppDataSource,
    Container.get('UserService')
));
Container.set('CubeService', new CubeService(
    AppDataSource,
    Container.get('CardService')
));
Container.set('FileService', new FileService());

// Register TournamentService after its dependencies
Container.set('TournamentService', new TournamentService(
    AppDataSource,
    Container.get('PreferenceService'),
    Container.get('MatchService'),
    Container.get('CubeService'),
    Container.get('RatingService'),
    Container.get('ScoreService'),
    Container.get('UserService')
));

// Register services that depend on TournamentService last
Container.set('EnrollmentService', new EnrollmentService(
    AppDataSource,
    Container.get('TournamentService')
));
Container.set('DraftService', new DraftService(
    AppDataSource,
    Container.get('TournamentService'),
    Container.get('CardService')
));

// Register controllers in TypeDI container
Container.set(UserController, new UserController(
    Container.get('UserService'),
    Container.get('EnrollmentService'),
    Container.get('MatchService')
));

// Create tsoa-compatible container
export const iocContainer: IocContainer = {
    get: <T>(controllerClass: { prototype: T }): Promise<T> => {
        const instance = Container.get<T>(controllerClass as any);
        return Promise.resolve(instance);
    }
};

export { Container }; 