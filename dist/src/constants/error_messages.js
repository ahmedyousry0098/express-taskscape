"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = Object.freeze({
    conflict: (obj) => `${obj} already exist`,
    serverErr: 'Ops, unexpected error occures, please try again',
    unavailableService: 'service not availale, please try again later',
    notFound: (obj) => `${obj} not found`
});
