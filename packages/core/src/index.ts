/**
 * reobservable core
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 10:24:23
 */
import { merge, of, throwError } from 'rxjs'
import { mergeMap, mapTo, catchError, map } from 'rxjs/operators'
import {
  createEpicMiddleware,
  ofType,
  combineEpics,
  ActionsObservable,
  StateObservable
} from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  combineReducers,
  applyMiddleware,
  createStore,
  Store,
  Middleware,
  Reducer
} from 'redux'
import * as mergeWith from 'lodash.mergewith'
import * as cloneDeep from 'lodash.clonedeep'
import * as invariant from 'invariant'

import loadingReducer from './reducers/loading'
import errorReducer from './reducers/error'
import Model, { Flow, Selectors, Dependencies } from './types/Model'
import { getPayload, actionSanitizer } from './utils/action'
import { Action } from './types/action'
import end from './operators/end'
import endTo from './operators/endTo'
import createService, {
  ServiceConfig,
  ServiceFunc
} from './operators/createService'
import {
  LOADING_START_ACTION,
  LOADING_END_ACTION,
  ERROR_SET_ACTION
} from './constants/actionTypes'
import { FLOW_END_INDICATOR } from './constants/meta'
import { Notification } from './types/Notification'
import { noop } from './utils/function'
import { LEVEL as NOTIFICATION_LEVEL } from './constants/notification'

import * as Symbols from './constants/symbols'
import { isNil } from './utils/logic'

interface Models {
  [modelName: string]: Model<any>
}

interface ReduxConfig {
  middleware?: Middleware | [Middleware]
  rootReducer?: (
    reducer: Reducer,
    reducers: { [key: string]: Reducer }
  ) => Reducer
}

interface Config {
  models?: Models
  redux?: ReduxConfig
  notification?: Notification
  services?: {
    [serviceName: string]: ServiceConfig<any, any>;
  }
}

export type InitFunc = (config: Config) => Store

const selectors: { [selectorsName: string]: Selectors<any> } = {}

const services: {
  [stringName: string]: ServiceFunc<any, any>;
} = {}

let notification: Notification = {
  info: noop,
  success: noop,
  error: noop,
  warn: noop
}

const patchWith = (objValue, srcValue) => {
  if (Array.isArray(srcValue)) {
    return srcValue
  }
}

const composeEnhancers = composeWithDevTools({
  actionSanitizer
})

export const init: InitFunc = config => {
  const { models = {}, redux = {} } = config
  notification = {
    ...notification,
    ...(config.notification || {})
  }

  const epics = []

  const reducers = {
    loading: loadingReducer,
    error: errorReducer
  }

  /**
   * 创建 model 的 reducer
   * @param {*} mode
   */
  const createReducer = (model: Model<any>) => {
    invariant(
      !reducers.hasOwnProperty(model.name),
      `model ${model.name} has been defined`
    )
    reducers[model.name] = function(state = model.state, action: Action) {
      const { type } = action
      const payload = getPayload(action)
      switch (type) {
        case `${model.name}/change`: {
          return { ...state, ...payload }
        }
        case `${model.name}/patch`: {
          return mergeWith(cloneDeep(state), payload, patchWith)
        }
        case `${model.name}/reset`: {
          if (Array.isArray(payload.states) && payload.states.length) {
            return Object.keys(state).reduce((newState, key) => {
              if (payload.states.indexOf(key) > -1) {
                newState[key] = cloneDeep(model.state[key])
              } else {
                newState[key] = state[key]
              }
              return newState
            }, {})
          } else {
            return { ...model.state }
          }
        }
        default: {
          const [modelName, reducerName] = type.split('/')

          if (
            modelName === model.name &&
            typeof model.reducers[reducerName] === 'function'
          ) {
            return model.reducers[reducerName](state, payload)
          }

          if (typeof model.reducers[type] === 'function') {
            return model.reducers[type](state, payload)
          }

          return state
        }
      }
    }
  }

  /**
   * 创建 epic
   * @param actionType
   * @param flow
   */
  const createEpic = (actionType: string, flow: Flow) => {
    return function epic<S>(
      action$: ActionsObservable<Action>,
      state$: StateObservable<S>,
      dependencies: Dependencies
    ) {
      const flow$ = flow(
        action$.pipe(
          ofType<Action, Action>(actionType),
          map(action => ({ ...action, payload: getPayload(action) }))
        ),
        action$,
        state$,
        dependencies
      )

      const loadingStart$ = action$.pipe(
        ofType(actionType),
        mapTo({
          type: LOADING_START_ACTION,
          payload: { flow: actionType }
        })
      )

      return merge(
        loadingStart$,
        flow$.pipe(
          mergeMap(action => {
            if (!action) {
              return throwError('inner error')
            }
            if (action[FLOW_END_INDICATOR]) {
              const hideAction = {
                type: LOADING_END_ACTION,
                payload: { flow: actionType }
              }
              return of(action, hideAction)
            } else {
              return of(action)
            }
          }),
          catchError(error => {
            console.error(`@reobservable[flow ${actionType} error]`, error)
            return of({
              type: ERROR_SET_ACTION,
              payload: { flow: actionType, error: error }
            })
          })
        )
      )
    }
  }

  /**
   * 创建 flows
   * @param {*} model
   */
  const createFlows = (model: Model<any>) => {
    Object.keys(model.flows).forEach(flowName => {
      const flow = model.flows[flowName]
      const actionType = `${model.name}/${flowName}`
      epics.push(createEpic(actionType, flow))
    })
  }

  Object.keys(models).forEach(key => {
    const model = {
      reducers: {},
      selectors: {},
      flows: {},
      state: {},
      ...models[key]
    }
    createReducer(model)
    createFlows(model)
    selectors[model.name] = model.selectors
  })

  // 配置 redux
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      end,
      endTo,
      services
    }
  })

  const extraMiddleware = redux.middleware
    ? Array.isArray(redux.middleware)
      ? redux.middleware
      : [redux.middleware]
    : []

  const middleware = applyMiddleware(epicMiddleware, ...extraMiddleware)

  let rootReducer = combineReducers(reducers)
  if (redux.rootReducer) {
    rootReducer = redux.rootReducer(rootReducer, reducers)
  }

  const store = createStore(rootReducer, composeEnhancers(middleware))

  // 配置 services
  Object.keys(config.services || {}).forEach(key => {
    const service = config.services[key]
    services[key] = createService(notification, service, store)
  })

  epicMiddleware.run(combineEpics(...epics))

  return store
}

export function getSelectors(model: string) {
  return selectors[model]
}

export function getService(service: string) {
  return services[service]
}

export function notificate(type: string, message: any) {
  if (!isNil(message)) {
    return (notification[type] || notification.info)(message)
  }
}

export { NOTIFICATION_LEVEL, Symbols }
