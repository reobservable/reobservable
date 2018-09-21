/**
 * notification type
 * @author yoyoyohamapi
 * @ignore created 2018-08-13 14:16:13
 */
import { LEVEL } from '../constants/notification'

type notificate = (content: string, duration?: number) => void

export interface Notification {
  info: notificate,
  success: notificate,
  warn: notificate,
  error: notificate
}

export enum NotificationLevel {
  silent = LEVEL.silent,
  erorr = LEVEL.error,
  all = LEVEL.all
}
