import { Container } from 'typedi';
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
import { PairingsService } from './service/pairings.service';
import { IocContainer } from '@tsoa/runtime';
import { CardController } from './controller/card.controller';
import { CubeController } from './controller/cube.controller';
import { ComputerVisionController } from './controller/computerVision.controller';
import { MatchController } from './controller/match.controller';
import { RatingController } from './controller/rating.controller';
import { UserController } from './controller/user.controller';
import { TournamentController } from './controller/tournament.controller';
import { PhotosController } from './controller/photos.controller';

// Register core dependencies
Container.set('DataSource', AppDataSource);

// Register base services first (no dependencies)
Container.set('CardService', new CardService(AppDataSource));
Container.set('PreferenceService', new PreferenceService(AppDataSource));
Container.set('MatchService', new MatchService(AppDataSource));
Container.set('FileService', new FileService());

// Register UserService before services that depend on it
Container.set('UserService', new UserService(
    AppDataSource,
    Container.get('PreferenceService')
));

// Register services that depend on UserService
Container.set('RatingService', new RatingService(
    AppDataSource,
    Container.get('UserService')
));
Container.set('ScoreService', new ScoreService(
    AppDataSource,
    Container.get('UserService')
));

// Register other services
Container.set('CubeService', new CubeService(
    AppDataSource,
    Container.get('CardService')
));

Container.set('ComputerVisionService', new ComputerVisionService(
    AppDataSource,
    Container.get('CardService')
));

// Register TournamentService last as it has many dependencies
Container.set('TournamentService', new TournamentService(
    AppDataSource,
    Container.get('PreferenceService'),
    Container.get('MatchService'),
    Container.get('CubeService'),
    Container.get('RatingService'),
    Container.get('ScoreService'),
    Container.get('UserService')
));

// Register services that depend on TournamentService
Container.set('PairingsService', new PairingsService(
    AppDataSource,
    Container.get('TournamentService'),
    Container.get('MatchService')
));

Container.set('DraftService', new DraftService(
    AppDataSource,
    Container.get('TournamentService'),
    Container.get('CardService')
));

// Register EnrollmentService before controllers that need it
Container.set('EnrollmentService', new EnrollmentService(
    AppDataSource,
    Container.get('TournamentService')
));

// Register controllers
Container.set(CardController, new CardController(
    Container.get('CardService')
));

Container.set(CubeController, new CubeController(
    Container.get('CubeService'),
    Container.get('CardService')
));

Container.set(ComputerVisionController, new ComputerVisionController(
    Container.get('ComputerVisionService')
));

Container.set(MatchController, new MatchController(
    Container.get('MatchService')
));

Container.set(RatingController, new RatingController(
    Container.get('RatingService')
));

Container.set(UserController, new UserController(
    Container.get('UserService'),
    Container.get('EnrollmentService'),
    Container.get('MatchService')
));

Container.set(TournamentController, new TournamentController(
    Container.get('TournamentService'),
    Container.get('EnrollmentService'),
    Container.get('ScoreService'),
    Container.get('CubeService'),
    Container.get('PairingsService'),
    Container.get('DraftService'),
    Container.get('MatchService')
));

Container.set(PhotosController, new PhotosController(
    Container.get('FileService')
));

// Create tsoa-compatible container
export const iocContainer: IocContainer = {
    get: <T>(controller: { prototype: T }): Promise<T> => {
        const instance = Container.get<T>(controller as any);
        return Promise.resolve(instance);
    }
};

export { Container }; 