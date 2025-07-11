/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CardController } from './../controller/card.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CubeController } from './../controller/cube.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ComputerVisionController } from './../controller/computerVision.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MatchController } from './../controller/match.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RatingController } from './../controller/rating.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TournamentController } from './../controller/tournament.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PhotosController } from './../controller/photos.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controller/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DraftController } from './../controller/draft.controller';
import { expressAuthentication } from './../auth/auth';
// @ts-ignore - no great way to install types from subpackage
import { iocContainer } from './../container';
import type { IocContainer, IocContainerFactory } from '@tsoa/runtime';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Color": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["W"]},{"dataType":"enum","enums":["U"]},{"dataType":"enum","enums":["B"]},{"dataType":"enum","enums":["R"]},{"dataType":"enum","enums":["G"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CardFace": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"imageUri":{"dataType":"string","required":true},"toughness":{"dataType":"double","required":true},"power":{"dataType":"double","required":true},"colors":{"dataType":"array","array":{"dataType":"refAlias","ref":"Color"},"required":true},"oracleText":{"dataType":"string","required":true},"manaCost":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Card": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "scryfallId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "manaCost": {"dataType":"string","required":true},
            "oracleText": {"dataType":"string","required":true},
            "power": {"dataType":"double","required":true},
            "toughness": {"dataType":"double","required":true},
            "set": {"dataType":"string","required":true},
            "cmc": {"dataType":"double","required":true},
            "colors": {"dataType":"array","array":{"dataType":"refAlias","ref":"Color"},"required":true},
            "type": {"dataType":"string","required":true},
            "faces": {"dataType":"array","array":{"dataType":"refAlias","ref":"CardFace"},"required":true},
            "tokens": {"dataType":"array","array":{"dataType":"refObject","ref":"Token"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Token": {
        "dataType": "refObject",
        "properties": {
            "tokenFor": {"dataType":"array","array":{"dataType":"refObject","ref":"Card"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CardList": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "cubeId": {"dataType":"double","required":true},
            "cube": {"ref":"Cube","required":true},
            "cards": {"dataType":"array","array":{"dataType":"refObject","ref":"ListedCard"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Status": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["started"]},{"dataType":"enum","enums":["completed"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TournamentStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"Status"},{"dataType":"enum","enums":["cancelled"]},{"dataType":"enum","enums":["completed"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Tournament": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "startDate": {"dataType":"datetime","required":true},
            "endDate": {"dataType":"datetime","required":true},
            "entryFee": {"dataType":"double","required":true},
            "totalSeats": {"dataType":"double","required":true},
            "preferencesRequired": {"dataType":"double","required":true},
            "status": {"ref":"TournamentStatus","required":true},
            "drafts": {"dataType":"array","array":{"dataType":"refObject","ref":"Draft"},"required":true},
            "userEnrollmentEnabled": {"dataType":"boolean","required":true},
            "enrollments": {"dataType":"array","array":{"dataType":"refObject","ref":"Enrollment"},"required":true},
            "cubeAllocations": {"dataType":"array","array":{"dataType":"refObject","ref":"TournamentCube"},"required":true},
            "staffMembers": {"dataType":"array","array":{"dataType":"refObject","ref":"User"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DraftStatus": {
        "dataType": "refAlias",
        "type": {"ref":"Status","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Draft": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "tournament": {"ref":"Tournament","required":true},
            "draftNumber": {"dataType":"double","required":true},
            "firstRound": {"dataType":"double","required":true},
            "lastRound": {"dataType":"double","required":true},
            "status": {"ref":"DraftStatus","required":true},
            "pods": {"dataType":"array","array":{"dataType":"refObject","ref":"DraftPod"},"required":true},
            "startTime": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Cube": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "owner": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "imageUrl": {"dataType":"string","required":true},
            "cardlist": {"ref":"CardList","required":true},
            "tournamentAllocations": {"dataType":"array","array":{"dataType":"refObject","ref":"TournamentCube"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DraftPod": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "draftId": {"dataType":"double","required":true},
            "draft": {"ref":"Draft","required":true},
            "podNumber": {"dataType":"double","required":true},
            "cubeId": {"dataType":"double","required":true},
            "cube": {"ref":"Cube","required":true},
            "seats": {"dataType":"array","array":{"dataType":"refObject","ref":"DraftPodSeat"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "isAdmin": {"dataType":"boolean","required":true},
            "isDummy": {"dataType":"boolean","required":true},
            "rating": {"dataType":"double","required":true},
            "enrollments": {"dataType":"array","array":{"dataType":"refObject","ref":"Enrollment"},"required":true},
            "tournamentsStaffed": {"dataType":"array","array":{"dataType":"refObject","ref":"Tournament"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Enrollment": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "tournamentId": {"dataType":"double","required":true},
            "tournament": {"ref":"Tournament","required":true},
            "playerId": {"dataType":"double","required":true},
            "player": {"ref":"User","required":true},
            "paid": {"dataType":"boolean","required":true},
            "dropped": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DraftPodSeat": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "podId": {"dataType":"double","required":true},
            "pod": {"ref":"DraftPod","required":true},
            "playerId": {"dataType":"double","required":true},
            "player": {"ref":"User","required":true},
            "seat": {"dataType":"double","required":true},
            "deckPhotoUrl": {"dataType":"string","required":true},
            "draftPoolReturned": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TournamentCube": {
        "dataType": "refObject",
        "properties": {
            "tournament": {"ref":"Tournament","required":true},
            "cube": {"ref":"Cube","required":true},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListedCard": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "card": {"ref":"Card","required":true},
            "cardlist": {"ref":"CardList","required":true},
            "pickedCards": {"dataType":"array","array":{"dataType":"refObject","ref":"PickedCard"},"required":true},
            "quantityInCube": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PickedCard": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "listedCard": {"ref":"ListedCard","required":true},
            "quantityPicked": {"dataType":"double","required":true},
            "picker": {"ref":"DraftPodSeat","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CubeDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double"},"cardlist":{"dataType":"union","subSchemas":[{"ref":"CardList"},{"dataType":"enum","enums":[null]}],"required":true},"imageUrl":{"dataType":"string","required":true},"url":{"dataType":"string","required":true},"owner":{"dataType":"string","required":true},"description":{"dataType":"string","required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"scryfallId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CubeCardDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokens":{"dataType":"array","array":{"dataType":"refAlias","ref":"TokenDto"}},"quantity":{"dataType":"double","required":true},"scryfallId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CubeDiffDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"newCards":{"dataType":"array","array":{"dataType":"refAlias","ref":"CubeCardDto"},"required":true},"orphanedCards":{"dataType":"array","array":{"dataType":"refObject","ref":"ListedCard"},"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Point": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"y":{"dataType":"double","required":true},"x":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ComputerVisionCard": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"nearPolygons":{"dataType":"double","required":true},"matchFound":{"dataType":"boolean","required":true},"text":{"dataType":"string","required":true},"polygon":{"dataType":"array","array":{"dataType":"refAlias","ref":"Point"},"required":true},"listedCard":{"dataType":"union","subSchemas":[{"ref":"ListedCard"},{"dataType":"undefined"}],"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ComputerVisionDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"cvCards":{"dataType":"array","array":{"dataType":"refAlias","ref":"ComputerVisionCard"},"required":true},"imageHeight":{"dataType":"double","required":true},"imageWidth":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlayerDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DraftPodSeatDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"draftPoolReturned":{"dataType":"boolean","required":true},"deckPhotoUrl":{"dataType":"string","required":true},"player":{"ref":"PlayerDto","required":true},"seat":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DraftPodDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"seats":{"dataType":"array","array":{"dataType":"refAlias","ref":"DraftPodSeatDto"}},"cube":{"ref":"CubeDto"},"podNumber":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DraftDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"pods":{"dataType":"array","array":{"dataType":"refAlias","ref":"DraftPodDto"}},"startTime":{"dataType":"datetime","required":true},"status":{"ref":"DraftStatus","required":true},"lastRound":{"dataType":"double","required":true},"firstRound":{"dataType":"double","required":true},"draftNumber":{"dataType":"double","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TournamentDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"staffMembers":{"dataType":"array","array":{"dataType":"refAlias","ref":"PlayerDto"},"required":true},"cubeAllocations":{"dataType":"array","array":{"dataType":"refAlias","ref":"TournamentCubeDto"},"required":true},"enrollments":{"dataType":"array","array":{"dataType":"refAlias","ref":"EnrollmentDto"},"required":true},"userEnrollmentEnabled":{"dataType":"boolean","required":true},"drafts":{"dataType":"array","array":{"dataType":"refAlias","ref":"DraftDto"},"required":true},"status":{"ref":"TournamentStatus","required":true},"preferencesRequired":{"dataType":"double","required":true},"totalSeats":{"dataType":"double","required":true},"entryFee":{"dataType":"double","required":true},"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EnrollmentDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"dropped":{"dataType":"boolean","required":true},"paid":{"dataType":"boolean","required":true},"player":{"ref":"PlayerDto","required":true},"tournament":{"ref":"TournamentDto","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TournamentCubeDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"count":{"dataType":"double","required":true},"cube":{"ref":"CubeDto","required":true},"tournament":{"ref":"TournamentDto","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoundStatus": {
        "dataType": "refAlias",
        "type": {"ref":"Status","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"matchType":{"ref":"PodDraftMatch","required":true},"playerGoingFirst":{"ref":"PlayerDto","required":true},"resultSubmittedBy":{"ref":"PlayerDto","required":true},"player2GamesWon":{"dataType":"double","required":true},"player1GamesWon":{"dataType":"double","required":true},"player2":{"ref":"PlayerDto","required":true},"player1":{"ref":"PlayerDto","required":true},"tableNumber":{"dataType":"double","required":true},"round":{"ref":"RoundDto","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoundDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"matches":{"dataType":"array","array":{"dataType":"refAlias","ref":"MatchDto"},"required":true},"startTime":{"dataType":"datetime","required":true},"status":{"ref":"RoundStatus","required":true},"roundNumber":{"dataType":"double","required":true},"tournament":{"ref":"TournamentDto","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PodDraftMatch": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["1v5"]},{"dataType":"enum","enums":["2v6"]},{"dataType":"enum","enums":["3v7"]},{"dataType":"enum","enums":["4v8"]},{"dataType":"enum","enums":["oddsWinners"]},{"dataType":"enum","enums":["oddsLosers"]},{"dataType":"enum","enums":["evensWinners"]},{"dataType":"enum","enums":["evensLosers"]},{"dataType":"enum","enums":["final"]},{"dataType":"enum","enums":["jumbofinal"]},{"dataType":"enum","enums":["mid1"]},{"dataType":"enum","enums":["mid2"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StandingsRow": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"opponentMatchWinPercentage":{"dataType":"double","required":true},"draftsWon":{"dataType":"double","required":true},"matchPoints":{"dataType":"double","required":true},"lastName":{"dataType":"string","required":true},"firstName":{"dataType":"string","required":true},"playerId":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlayerTournamentScoreDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"opponentMatchWinPercentage":{"dataType":"double","required":true},"draftsWon":{"dataType":"double","required":true},"points":{"dataType":"double","required":true},"tournament":{"ref":"TournamentDto","required":true},"player":{"ref":"PlayerDto","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCubePreferenceDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"points":{"dataType":"double","required":true},"cubeId":{"dataType":"double","required":true},"tournamentId":{"dataType":"double","required":true},"playerId":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Preference": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "tournamentId": {"dataType":"double","required":true},
            "tournament": {"ref":"Tournament","required":true},
            "playerId": {"dataType":"double","required":true},
            "player": {"ref":"User","required":true},
            "cube": {"ref":"Cube","required":true},
            "points": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlayerWithRatingDto": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"PlayerDto"},{"dataType":"nestedObjectLiteral","nestedProperties":{"rating":{"dataType":"double","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PreferenceDto": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"points":{"dataType":"double","required":true},"cube":{"ref":"CubeDto","required":true},"player":{"ref":"PlayerDto","required":true},"tournament":{"ref":"TournamentDto","required":true},"id":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlayerTournamentInfo": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"preferences":{"dataType":"array","array":{"dataType":"refAlias","ref":"PreferenceDto"},"required":true},"enrollment":{"ref":"EnrollmentDto","required":true},"tournament":{"ref":"TournamentDto","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "token": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsCardController_generateCardDb: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/db/generate',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.generateCardDb)),

            async function CardController_generateCardDb(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_generateCardDb, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'generateCardDb',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_getCardDb: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/db',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.getCardDb)),

            async function CardController_getCardDb(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_getCardDb, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCardDb',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_updateCardDb: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/db/update',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.updateCardDb)),

            async function CardController_updateCardDb(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_updateCardDb, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'updateCardDb',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_getCardById: Record<string, TsoaRoute.ParameterSchema> = {
                scryfallId: {"in":"path","name":"scryfallId","required":true,"dataType":"string"},
        };
        app.get('/card/id/:scryfallId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.getCardById)),

            async function CardController_getCardById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_getCardById, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCardById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_getCardByName: Record<string, TsoaRoute.ParameterSchema> = {
                cardname: {"in":"path","name":"cardname","required":true,"dataType":"string"},
        };
        app.get('/card/name/:cardname',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.getCardByName)),

            async function CardController_getCardByName(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_getCardByName, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCardByName',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_getCards: Record<string, TsoaRoute.ParameterSchema> = {
                cards: {"in":"body","name":"cards","required":true,"dataType":"array","array":{"dataType":"string"}},
        };
        app.post('/card/list',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.getCards)),

            async function CardController_getCards(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_getCards, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCards',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_getAllTokens: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/tokens',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.getAllTokens)),

            async function CardController_getAllTokens(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_getAllTokens, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllTokens',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_searchForCard: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"path","name":"query","required":true,"dataType":"string"},
        };
        app.get('/card/search/:query',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.searchForCard)),

            async function CardController_searchForCard(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_searchForCard, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'searchForCard',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_getAllPickedCards: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/picked',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.getAllPickedCards)),

            async function CardController_getAllPickedCards(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_getAllPickedCards, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllPickedCards',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_getAllListedCards: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/listed',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.getAllListedCards)),

            async function CardController_getAllListedCards(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_getAllListedCards, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllListedCards',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_deleteOrphanListedCards: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/listed/deleteOrphans',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.deleteOrphanListedCards)),

            async function CardController_deleteOrphanListedCards(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_deleteOrphanListedCards, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'deleteOrphanListedCards',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCardController_removeAllPickedCards: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/card/picked/removeAll',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CardController)),
            ...(fetchMiddlewares<RequestHandler>(CardController.prototype.removeAllPickedCards)),

            async function CardController_removeAllPickedCards(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCardController_removeAllPickedCards, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CardController>(CardController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'removeAllPickedCards',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_getAllCubes: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/cube',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.getAllCubes)),

            async function CubeController_getAllCubes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_getAllCubes, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllCubes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_getCube: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/cube/:id',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.getCube)),

            async function CubeController_getCube(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_getCube, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCube',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_getCubesForTournament: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/cube/tournament/:tournamentId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.getCubesForTournament)),

            async function CubeController_getCubesForTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_getCubesForTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCubesForTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_addCube: Record<string, TsoaRoute.ParameterSchema> = {
                cube: {"in":"body","name":"cube","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"imageUrl":{"dataType":"string","required":true},"owner":{"dataType":"string","required":true},"url":{"dataType":"string","required":true},"description":{"dataType":"string","required":true},"title":{"dataType":"string","required":true}}},
        };
        app.post('/cube/add',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.addCube)),

            async function CubeController_addCube(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_addCube, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'addCube',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_editCube: Record<string, TsoaRoute.ParameterSchema> = {
                cube: {"in":"body","name":"cube","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"imageUrl":{"dataType":"string","required":true},"owner":{"dataType":"string","required":true},"url":{"dataType":"string","required":true},"description":{"dataType":"string","required":true},"title":{"dataType":"string","required":true},"cubeId":{"dataType":"double","required":true}}},
        };
        app.put('/cube/edit',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.editCube)),

            async function CubeController_editCube(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_editCube, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'editCube',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_updateCubeCardlist: Record<string, TsoaRoute.ParameterSchema> = {
                update: {"in":"body","name":"update","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"cards":{"dataType":"array","array":{"dataType":"refAlias","ref":"CubeCardDto"},"required":true},"cubeId":{"dataType":"double","required":true}}},
        };
        app.put('/cube/cardlist',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.updateCubeCardlist)),

            async function CubeController_updateCubeCardlist(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_updateCubeCardlist, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'updateCubeCardlist',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_getCubeDiff: Record<string, TsoaRoute.ParameterSchema> = {
                diff: {"in":"body","name":"diff","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"cards":{"dataType":"array","array":{"dataType":"any"},"required":true},"cubeId":{"dataType":"double","required":true}}},
        };
        app.post('/cube/diff',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.getCubeDiff)),

            async function CubeController_getCubeDiff(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_getCubeDiff, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCubeDiff',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_getCardlist: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/cube/cardlist/:id',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.getCardlist)),

            async function CubeController_getCardlist(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_getCardlist, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCardlist',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCubeController_playerReturnedCards: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                seatId: {"in":"path","name":"seatId","required":true,"dataType":"double"},
        };
        app.get('/cube/:id/picked/return/:seatId',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CubeController)),
            ...(fetchMiddlewares<RequestHandler>(CubeController.prototype.playerReturnedCards)),

            async function CubeController_playerReturnedCards(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCubeController_playerReturnedCards, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CubeController>(CubeController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'playerReturnedCards',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsComputerVisionController_getListedCardsFromImageUrl: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"cubeCards":{"dataType":"array","array":{"dataType":"refObject","ref":"ListedCard"},"required":true},"url":{"dataType":"string","required":true}}},
        };
        app.post('/computerVision/cardsFromImageUrl',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ComputerVisionController)),
            ...(fetchMiddlewares<RequestHandler>(ComputerVisionController.prototype.getListedCardsFromImageUrl)),

            async function ComputerVisionController_getListedCardsFromImageUrl(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsComputerVisionController_getListedCardsFromImageUrl, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ComputerVisionController>(ComputerVisionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getListedCardsFromImageUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsComputerVisionController_getTextFromUrl: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true}}},
        };
        app.post('/computerVision/textFromUrl',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ComputerVisionController)),
            ...(fetchMiddlewares<RequestHandler>(ComputerVisionController.prototype.getTextFromUrl)),

            async function ComputerVisionController_getTextFromUrl(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsComputerVisionController_getTextFromUrl, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ComputerVisionController>(ComputerVisionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getTextFromUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsComputerVisionController_textsToListedCards: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"dictionary":{"dataType":"array","array":{"dataType":"refObject","ref":"ListedCard"},"required":true},"rawTexts":{"ref":"ComputerVisionDto","required":true}}},
        };
        app.post('/computerVision/textsToCards',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ComputerVisionController)),
            ...(fetchMiddlewares<RequestHandler>(ComputerVisionController.prototype.textsToListedCards)),

            async function ComputerVisionController_textsToListedCards(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsComputerVisionController_textsToListedCards, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ComputerVisionController>(ComputerVisionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'textsToListedCards',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMatchController_getMatchesForRound: Record<string, TsoaRoute.ParameterSchema> = {
                roundId: {"in":"path","name":"roundId","required":true,"dataType":"double"},
        };
        app.get('/match/round/:roundId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MatchController)),
            ...(fetchMiddlewares<RequestHandler>(MatchController.prototype.getMatchesForRound)),

            async function MatchController_getMatchesForRound(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_getMatchesForRound, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MatchController>(MatchController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getMatchesForRound',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMatchController_submitResult: Record<string, TsoaRoute.ParameterSchema> = {
                result: {"in":"body","name":"result","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"player2GamesWon":{"dataType":"double","required":true},"player1GamesWon":{"dataType":"double","required":true},"resultSubmittedBy":{"dataType":"double","required":true},"roundId":{"dataType":"double","required":true},"matchId":{"dataType":"double","required":true}}},
        };
        app.post('/match/submitResult',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MatchController)),
            ...(fetchMiddlewares<RequestHandler>(MatchController.prototype.submitResult)),

            async function MatchController_submitResult(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_submitResult, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<MatchController>(MatchController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'submitResult',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRatingController_updateElo: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"winnerNumber":{"dataType":"double","required":true},"player2Id":{"dataType":"double","required":true},"player1Id":{"dataType":"double","required":true},"kValue":{"dataType":"double","required":true}}},
        };
        app.post('/rating/updateElo',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RatingController)),
            ...(fetchMiddlewares<RequestHandler>(RatingController.prototype.updateElo)),

            async function RatingController_updateElo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRatingController_updateElo, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<RatingController>(RatingController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'updateElo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRatingController_resetEloForUser: Record<string, TsoaRoute.ParameterSchema> = {
                playerId: {"in":"path","name":"playerId","required":true,"dataType":"double"},
        };
        app.get('/rating/resetElo/:playerId',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RatingController)),
            ...(fetchMiddlewares<RequestHandler>(RatingController.prototype.resetEloForUser)),

            async function RatingController_resetEloForUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRatingController_resetEloForUser, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<RatingController>(RatingController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'resetEloForUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_generateCsvFromRound: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                roundId: {"in":"path","name":"roundId","required":true,"dataType":"double"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/tournament/:tournamentId/round/:roundId/results',
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.generateCsvFromRound)),

            async function TournamentController_generateCsvFromRound(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_generateCsvFromRound, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'generateCsvFromRound',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getAllTournaments: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/tournament',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getAllTournaments)),

            async function TournamentController_getAllTournaments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getAllTournaments, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllTournaments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getFutureTournaments: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/tournament/future',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getFutureTournaments)),

            async function TournamentController_getFutureTournaments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getFutureTournaments, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getFutureTournaments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getPastTournaments: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/tournament/past',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getPastTournaments)),

            async function TournamentController_getPastTournaments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getPastTournaments, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getPastTournaments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getOngoingTournaments: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/tournament/ongoing',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getOngoingTournaments)),

            async function TournamentController_getOngoingTournaments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getOngoingTournaments, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getOngoingTournaments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getTournament: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getTournament)),

            async function TournamentController_getTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getTournamentEnrollments: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/enrollment',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getTournamentEnrollments)),

            async function TournamentController_getTournamentEnrollments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getTournamentEnrollments, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getTournamentEnrollments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getTournamentAndDrafts: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/drafts',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getTournamentAndDrafts)),

            async function TournamentController_getTournamentAndDrafts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getTournamentAndDrafts, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getTournamentAndDrafts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getCurrentDraft: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/draft',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getCurrentDraft)),

            async function TournamentController_getCurrentDraft(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getCurrentDraft, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCurrentDraft',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getCurrentRound: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/round',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getCurrentRound)),

            async function TournamentController_getCurrentRound(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getCurrentRound, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCurrentRound',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getMatch: Record<string, TsoaRoute.ParameterSchema> = {
                _tournamentId: {"in":"path","name":"_tournamentId","required":true,"dataType":"double"},
                roundId: {"in":"path","name":"roundId","required":true,"dataType":"double"},
                playerId: {"in":"path","name":"playerId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:_tournamentId/round/:roundId/match/:playerId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getMatch)),

            async function TournamentController_getMatch(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getMatch, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getMatch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getMostRecentRound: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/round/recent',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getMostRecentRound)),

            async function TournamentController_getMostRecentRound(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getMostRecentRound, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getMostRecentRound',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getStandings: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                roundNumber: {"in":"path","name":"roundNumber","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/standings/:roundNumber',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getStandings)),

            async function TournamentController_getStandings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getStandings, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getStandings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getPreviousScore: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/score/:userId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getPreviousScore)),

            async function TournamentController_getPreviousScore(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getPreviousScore, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getPreviousScore',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getCubesForTournament: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/tournament/:id/cubes',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getCubesForTournament)),

            async function TournamentController_getCubesForTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getCubesForTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getCubesForTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_enrollIntoTournament: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/enroll/:userId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.enrollIntoTournament)),

            async function TournamentController_enrollIntoTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_enrollIntoTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'enrollIntoTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_cancelEnrollment: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/cancel/:userId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.cancelEnrollment)),

            async function TournamentController_cancelEnrollment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_cancelEnrollment, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'cancelEnrollment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_dropFromTournament: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/drop/:userId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.dropFromTournament)),

            async function TournamentController_dropFromTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_dropFromTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'dropFromTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_setCubePreferences: Record<string, TsoaRoute.ParameterSchema> = {
                preferences: {"in":"body","name":"preferences","required":true,"dataType":"array","array":{"dataType":"refAlias","ref":"UserCubePreferenceDto"}},
        };
        app.post('/tournament/preferences',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.setCubePreferences)),

            async function TournamentController_setCubePreferences(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_setCubePreferences, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'setCubePreferences',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_deleteCubePreferences: Record<string, TsoaRoute.ParameterSchema> = {
                preferences: {"in":"body","name":"preferences","required":true,"ref":"UserCubePreferenceDto"},
        };
        app.put('/tournament/preferences/delete',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.deleteCubePreferences)),

            async function TournamentController_deleteCubePreferences(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_deleteCubePreferences, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'deleteCubePreferences',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getPreferencesForUser: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/preferences/:userId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getPreferencesForUser)),

            async function TournamentController_getPreferencesForUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getPreferencesForUser, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getPreferencesForUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_startTournament: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/start',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.startTournament)),

            async function TournamentController_startTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_startTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'startTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_endTournament: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/end',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.endTournament)),

            async function TournamentController_endTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_endTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'endTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_generateDrafts: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/draft/generate',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.generateDrafts)),

            async function TournamentController_generateDrafts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_generateDrafts, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'generateDrafts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_initiateDraft: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                draftId: {"in":"path","name":"draftId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/draft/:draftId/initiate',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.initiateDraft)),

            async function TournamentController_initiateDraft(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_initiateDraft, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'initiateDraft',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_startDraft: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                draftId: {"in":"path","name":"draftId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/draft/:draftId/start',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.startDraft)),

            async function TournamentController_startDraft(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_startDraft, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'startDraft',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_endDraft: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                draftId: {"in":"path","name":"draftId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/draft/:draftId/end',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.endDraft)),

            async function TournamentController_endDraft(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_endDraft, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'endDraft',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_startRound: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                roundId: {"in":"path","name":"roundId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/round/:roundId/start',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.startRound)),

            async function TournamentController_startRound(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_startRound, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'startRound',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_endRound: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                roundId: {"in":"path","name":"roundId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/round/:roundId/end',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.endRound)),

            async function TournamentController_endRound(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_endRound, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'endRound',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_generatePairings: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                draftId: {"in":"path","name":"draftId","required":true,"dataType":"double"},
                roundId: {"in":"path","name":"roundId","required":true,"dataType":"double"},
        };
        app.put('/tournament/:tournamentId/draft/:draftId/round/:roundId/pairings',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.generatePairings)),

            async function TournamentController_generatePairings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_generatePairings, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'generatePairings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_staffCancelEnrollment: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.post('/tournament/staff/:tournamentId/cancel/:userId',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.staffCancelEnrollment)),

            async function TournamentController_staffCancelEnrollment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_staffCancelEnrollment, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'staffCancelEnrollment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_setDraftPoolReturned: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                seatId: {"in":"path","name":"seatId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/setDraftPoolReturned/:seatId',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.setDraftPoolReturned)),

            async function TournamentController_setDraftPoolReturned(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_setDraftPoolReturned, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'setDraftPoolReturned',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_staffSubmitResult: Record<string, TsoaRoute.ParameterSchema> = {
                result: {"in":"body","name":"result","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"player2GamesWon":{"dataType":"double","required":true},"player1GamesWon":{"dataType":"double","required":true},"resultSubmittedBy":{"dataType":"double","required":true},"matchId":{"dataType":"double","required":true},"roundId":{"dataType":"double","required":true}}},
        };
        app.post('/tournament/staff/:tournamentId/submitResult',
            authenticateMiddleware([{"staff":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.staffSubmitResult)),

            async function TournamentController_staffSubmitResult(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_staffSubmitResult, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'staffSubmitResult',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_createTournament: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentData: {"in":"body","name":"tournamentData","required":true,"dataType":"any"},
        };
        app.post('/tournament/create',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.createTournament)),

            async function TournamentController_createTournament(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_createTournament, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'createTournament',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_getTournamentStaff: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/tournament/:tournamentId/staff',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.getTournamentStaff)),

            async function TournamentController_getTournamentStaff(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_getTournamentStaff, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getTournamentStaff',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_addToStaff: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/staff/:userId/add',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.addToStaff)),

            async function TournamentController_addToStaff(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_addToStaff, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'addToStaff',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_removeFromStaff: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/staff/:userId/remove',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.removeFromStaff)),

            async function TournamentController_removeFromStaff(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_removeFromStaff, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'removeFromStaff',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTournamentController_setDeckPhotoForUser: Record<string, TsoaRoute.ParameterSchema> = {
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                seatId: {"in":"path","name":"seatId","required":true,"dataType":"double"},
        };
        app.post('/tournament/:tournamentId/setDeckPhoto/:seatId',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TournamentController)),
            ...(fetchMiddlewares<RequestHandler>(TournamentController.prototype.setDeckPhotoForUser)),

            async function TournamentController_setDeckPhotoForUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_setDeckPhotoForUser, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TournamentController>(TournamentController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'setDeckPhotoForUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPhotosController_servePhoto: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/photos/*',
            ...(fetchMiddlewares<RequestHandler>(PhotosController)),
            ...(fetchMiddlewares<RequestHandler>(PhotosController.prototype.servePhoto)),

            async function PhotosController_servePhoto(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPhotosController_servePhoto, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<PhotosController>(PhotosController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'servePhoto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_signup: Record<string, TsoaRoute.ParameterSchema> = {
                user: {"in":"body","name":"user","required":true,"dataType":"any"},
        };
        app.post('/user/signup',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.signup)),

            async function UserController_signup(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_signup, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'signup',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getAllUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/user/all',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getAllUsers)),

            async function UserController_getAllUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAllUsers, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAllUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_userExists: Record<string, TsoaRoute.ParameterSchema> = {
                email: {"in":"path","name":"email","required":true,"dataType":"string"},
        };
        app.get('/user/exists/:email',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.userExists)),

            async function UserController_userExists(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_userExists, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'userExists',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/user/:id',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUser)),

            async function UserController_getUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUser, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUsersTournaments: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/user/:id/tournaments',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsersTournaments)),

            async function UserController_getUsersTournaments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersTournaments, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getUsersTournaments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getTournamentsStaffed: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/user/:id/staff',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getTournamentsStaffed)),

            async function UserController_getTournamentsStaffed(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getTournamentsStaffed, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getTournamentsStaffed',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUserTournamentInfo: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/user/:id/tournament/:tournamentId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserTournamentInfo)),

            async function UserController_getUserTournamentInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserTournamentInfo, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getUserTournamentInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getPlayerMatchHistory: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
        };
        app.get('/user/:userId/tournament/:tournamentId/matches',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getPlayerMatchHistory)),

            async function UserController_getPlayerMatchHistory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getPlayerMatchHistory, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getPlayerMatchHistory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_login: Record<string, TsoaRoute.ParameterSchema> = {
                credentials: {"in":"body","name":"credentials","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
        };
        app.post('/user/login',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.login)),

            async function UserController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_login, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.post('/user/delete/:userId',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.deleteUser)),

            async function UserController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_deleteUser, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_setPassword: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true}}},
        };
        app.put('/user/password/:userId',
            authenticateMiddleware([{"admin":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.setPassword)),

            async function UserController_setPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_setPassword, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<UserController>(UserController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'setPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDraftController_getPodsForDraft: Record<string, TsoaRoute.ParameterSchema> = {
                draftId: {"in":"path","name":"draftId","required":true,"dataType":"double"},
        };
        app.get('/draft/pods/:draftId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DraftController)),
            ...(fetchMiddlewares<RequestHandler>(DraftController.prototype.getPodsForDraft)),

            async function DraftController_getPodsForDraft(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDraftController_getPodsForDraft, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<DraftController>(DraftController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getPodsForDraft',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDraftController_getSeatsForPod: Record<string, TsoaRoute.ParameterSchema> = {
                draftPodId: {"in":"path","name":"draftPodId","required":true,"dataType":"double"},
        };
        app.get('/draft/seats/:draftPodId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DraftController)),
            ...(fetchMiddlewares<RequestHandler>(DraftController.prototype.getSeatsForPod)),

            async function DraftController_getSeatsForPod(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDraftController_getSeatsForPod, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<DraftController>(DraftController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getSeatsForPod',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDraftController_getDraftInfoForUser: Record<string, TsoaRoute.ParameterSchema> = {
                draftId: {"in":"path","name":"draftId","required":true,"dataType":"double"},
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.get('/draft/:draftId/user/:userId',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DraftController)),
            ...(fetchMiddlewares<RequestHandler>(DraftController.prototype.getDraftInfoForUser)),

            async function DraftController_getDraftInfoForUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDraftController_getDraftInfoForUser, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<DraftController>(DraftController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getDraftInfoForUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDraftController_getRoundsForDraft: Record<string, TsoaRoute.ParameterSchema> = {
                draftId: {"in":"path","name":"draftId","required":true,"dataType":"double"},
        };
        app.get('/draft/:draftId/rounds',
            authenticateMiddleware([{"loggedIn":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DraftController)),
            ...(fetchMiddlewares<RequestHandler>(DraftController.prototype.getRoundsForDraft)),

            async function DraftController_getRoundsForDraft(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDraftController_getRoundsForDraft, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<DraftController>(DraftController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getRoundsForDraft',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDraftController_submitDeck: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                tournamentId: {"in":"path","name":"tournamentId","required":true,"dataType":"double"},
                seatId: {"in":"path","name":"seatId","required":true,"dataType":"double"},
                file: {"in":"formData","name":"file","required":true,"dataType":"file"},
                token: {"in":"header","name":"authorization","required":true,"dataType":"string"},
        };
        app.post('/draft/tournament/:tournamentId/submitDeck/:seatId',
            authenticateMiddleware([{"loggedIn":[]}]),
            upload.fields([
                {
                    name: "file",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(DraftController)),
            ...(fetchMiddlewares<RequestHandler>(DraftController.prototype.submitDeck)),

            async function DraftController_submitDeck(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDraftController_submitDeck, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<DraftController>(DraftController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'submitDeck',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
