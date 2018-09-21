/**
 * endTo operator
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:31:20
 */
import { UnaryFunction, Observable } from 'rxjs';
import { Action, EndAction } from '../types/Action';
/**
 * endTo
 * @param {Action} action
 * @returns {Observable}
 * @method endTo
 */
export default function endTo(action: Action): UnaryFunction<Observable<Action>, Observable<EndAction>>;
