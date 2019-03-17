/**
 * action utils
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 13:10:52
 */
import { Action } from '../types/action'
import { isNil } from './logic'
import { ALIAS } from '../constants/symbols'

/**
 * get action payload
 * @param {Action} action
 */
export function getPayload(action: Action) {
  return isNil(action.payload) ? {} : action.payload
}

/**
 * action sanitizer for redux-dev-tools
 * @param {Action} action
 */
export function actionSanitizer(action) {
  return action[ALIAS]
    ? Object.assign({}, action, {
        type: action[ALIAS]
      })
    : action
}
