/**
 * endTo operator
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:31:20
 */
import { pipe, UnaryFunction, Observable } from 'rxjs'
import { mapTo } from 'rxjs/operators'
import { Action, EndAction } from '../types/action'
import { FLOW_END_INDICATOR } from '../constants/meta'

/**
 * endTo
 * @param {Action} action
 * @returns {Observable}
 * @method endTo
 */
export default function endTo(action: Action): UnaryFunction<Observable<Action>, Observable<EndAction>> {
  return pipe(
    mapTo({
      ...action,
      [FLOW_END_INDICATOR]: true
    })
  )
}
