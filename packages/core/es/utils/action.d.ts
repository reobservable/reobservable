/**
 * action utils
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 13:10:52
 */
import { Action } from '../types/Action';
/**
 * get action payload
 * @param {Action} action
 */
export declare function getPayload(action: Action): any;
/**
 * action sanitizer for redux-dev-tools
 * @param {Action} action
 */
export declare function actionSanitizer(action: any): any;
