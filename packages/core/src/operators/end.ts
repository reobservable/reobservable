/**
 * end operator
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:31:20
 */
import { pipe, UnaryFunction, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Action, EndAction } from '../types/action'
import { FLOW_END_INDICATOR } from '../constants/meta'

/**
 * end operator
 * @param {function(value: Action): EndAction} project
 * @returns {Observable}
 * @method end
 */
export default function end(project: (value: any) => Action): UnaryFunction<Observable<any>, Observable<EndAction>> {
  return pipe(
    map((action: Action) => ({
      ...project(action),
      [FLOW_END_INDICATOR]: true
    }))
  )
}
