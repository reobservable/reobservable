/**
 * action types
 * @author yoyoyohamapi
 * @ignore created 2018-08-03 11:19:14
 */
import { FLOW_END_INDICATOR } from '../constants/meta'
import { ALIAS } from '../constants/symbols'

export interface Action {
  type: string
  payload?: any
  [ALIAS]?: string
}

export interface EndAction {
  type: string
  [FLOW_END_INDICATOR]: boolean
  payload?: any
}
