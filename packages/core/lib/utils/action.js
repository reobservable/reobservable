"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logic_1 = require("./logic");
var symbols_1 = require("../constants/symbols");
/**
 * get action payload
 * @param {Action} action
 */
function getPayload(action) {
    return logic_1.isNil(action) ? {} : action.payload;
}
exports.getPayload = getPayload;
/**
 * action sanitizer for redux-dev-tools
 * @param {Action} action
 */
function actionSanitizer(action) {
    return action[symbols_1.ALIAS] ? Object.assign({}, action, {
        type: action[symbols_1.ALIAS]
    }) : action;
}
exports.actionSanitizer = actionSanitizer;
//# sourceMappingURL=action.js.map