/**
 * loading reducer
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 12:36:49
 */

import { Action } from '../types/Action'
import {
  LOADING_START_ACTION,
  LOADING_END_ACTION,
  SERVICE_LOADING_START_ACTION,
  SERVICE_LOADING_END_ACTION,
  ERROR_SET_ACTION,
  SERVICE_ERROR_SET_ACTION
} from '../constants/actionTypes'

export default function loading(state = {services: {}, flows: {}}, action: Action): Object {
  const { type } = action
  const payload = action.payload ? action.payload : {}
  switch (type) {
    case LOADING_START_ACTION: {
      return {
        ...state,
        flows: {
          ...state.flows,
          [payload.flow]: true
        }
      }
    }

    case LOADING_END_ACTION: {
      return {
        ...state,
        flows: {
          ...state.flows,
          [payload.flow]: false
        }
      }
    }

    case SERVICE_LOADING_START_ACTION: {
      return {
        ...state,
        services: {
          ...state.services,
          [payload.service]: true
        }
      }
    }

    case SERVICE_LOADING_END_ACTION: {
      return {
        ...state,
        services: {
          ...state.services,
          [payload.service]: false
        }
      }
    }

    // flow 出错时，停止 loading
    case ERROR_SET_ACTION: {
      return {
        ...state,
        flows: {
          ...state.flows,
          [payload.flow]: false
        }
      }
    }

    case SERVICE_ERROR_SET_ACTION: {
      return {
        ...state,
        services: {
          ...state.services,
          [payload.service]: false
        }
      }
    }

    default:
      return state
  }
}
