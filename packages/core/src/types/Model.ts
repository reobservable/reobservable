/**
 * model interface
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 12:47:25
 */
import { Reducer } from 'redux'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { Action } from './Action'
import endTo from '../operators/endTo'
import end from '../operators/end'
import { Observable } from 'rxjs'
import { ServiceFunc } from '../operators/createService'

export interface Reducers<S> {
  readonly [reducerName: string]: Reducer<S>
}

export interface Dependencies<T = any, E = any> {
  end: typeof end,
  endTo: typeof endTo,
  services: {
    [serviceName: string]: ServiceFunc<T, E>
  }
}

export type Flow<S = any> = (
  flow$: ActionsObservable<Action>,
  action$: ActionsObservable<Action>,
  state$: StateObservable<S>,
  dependencies: Dependencies
) => Observable<any>

export interface Flows<R> {
  readonly [flowName: string]: Flow<R>
}

export type Selector<T> = (state: T) => any

export interface Selectors<T> {
  readonly [selectorName: string]: Selector<T>
}

export default interface Model<S, R = any> {
  readonly name: string,
  readonly state?: S,
  readonly reducers?: Reducers<S>,
  readonly flows?: Flows<R>,
  readonly selectors?: Selectors<R>
}
