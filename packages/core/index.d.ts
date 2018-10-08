import { Middleware, Reducer, Store } from 'redux'
import Model, { Selectors } from './src/types/model'
import { Notification } from './src/types/Notification'
import { init, getSelectors, getService, NOTIFICATION_LEVEL, notificate } from './src'
import * as Symbols from './src/constants/symbols'
import { ServiceConfig, ServiceFunc } from './src/operators/createService'

export as namespace ReObservable

export { 
  Model, 
  Notification, 
  init, 
  getSelectors,
  getService,
  notificate,
  ServiceConfig, 
  ServiceFunc,
  NOTIFICATION_LEVEL,
  Symbols
}

export interface LoadingState {
  flows: {
    [stateName: string]: boolean
  },
  services: {
    [stateName: string]: boolean
  }
}

export interface ErrorState {
  flows: {
    [stateName: string]: any
  },
  services: {
    [stateName: string]: any
  }
}
