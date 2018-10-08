import { isNil } from './logic';
import { ALIAS } from '../constants/symbols';
/**
 * get action payload
 * @param {Action} action
 */
export function getPayload(action) {
    return isNil(action.payload) ? {} : action.payload;
}
/**
 * action sanitizer for redux-dev-tools
 * @param {Action} action
 */
export function actionSanitizer(action) {
    return action[ALIAS] ? Object.assign({}, action, {
        type: action[ALIAS]
    }) : action;
}
//# sourceMappingURL=action.js.map