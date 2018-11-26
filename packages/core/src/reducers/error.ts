/**
 * error reducer
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 12:43:11
 */
import { Action } from '../types/Action'
import { LOADING_START_ACTION, ERROR_SET_ACTION, SERVICE_ERROR_SET_ACTION, SERVICE_LOADING_START_ACTION } from '../constants/actionTypes'

export default function error(state = {flows: {}, services: {}}, action: Action): Object {
  const { type } = action
  const payload = action.payload ? action.payload : {}
  switch (type) {
    // flow 开始，重置错误
    case LOADING_START_ACTION: {
      return {
        ...state,
        flows: {
          ...state.flows,
          [payload.flow]: null
        }
      }
    }
    case SERVICE_LOADING_START_ACTION: {
      return {
        ...state,
        services: {
          ...state.services,
          [payload.service]: null
        }
      }
    }
    case ERROR_SET_ACTION: {
      return {
        ...state,
        flows: {
          ...state.flows,
          [payload.flow]: payload.error
        }
      }
    }
    case SERVICE_ERROR_SET_ACTION: {
      return {
        ...state,
        services: {
          ...state.services,
          [payload.service]: payload.error
        }
      }
    }
    default:
      return state
  }
}
