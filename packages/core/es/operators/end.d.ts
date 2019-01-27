/**
 * end operator
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:31:20
 */
import { UnaryFunction, Observable } from 'rxjs';
import { Action, EndAction } from '../types/action';
/**
 * end operator
 * @param {function(value: Action): EndAction} project
 * @returns {Observable}
 * @method end
 */
export default function end(project: (value: any) => Action): UnaryFunction<Observable<any>, Observable<EndAction>>;
