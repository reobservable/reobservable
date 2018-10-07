/**
 * fromService creator
 * @author yoyoyohamapi
 * @ignore created 2018-08-13 14:26:55
 */
import { from, of, Observable } from 'rxjs'
import { catchError, map, filter, tap } from 'rxjs/operators'
import { Store } from 'redux'
import { Notification, NotificationLevel } from '../types/notification'
import { LEVEL } from '../constants/notification'
import { SERVICE_ERROR_SET_ACTION, SERVICE_LOADING_END_ACTION, SERVICE_LOADING_START_ACTION } from '../constants/actionTypes'
import { noop } from '../utils/function'

interface ServiceTemplates<T, E> {
  success: (resp: T) => string,
  error: (error: E) => string
}

export interface ServiceConfig<T, E> {
  templates?: ServiceTemplates<T, E>,
  isSuccess?: (resp: T) => boolean
  errorSelector?: (error: any) => any
}

interface ServiceOptions<T, E> {
  /** 等级 */
  level: NotificationLevel,
  /** 消息模板 */
  templates?: ServiceTemplates<T, E>
}

interface Result<T, E> {
  resp?: T | undefined,
  error?: E | undefined,
  success?: boolean | undefined
}

export type ServiceFunc<T, E> = (serviceName: string, service: Promise<T>, options?: ServiceOptions<T, E>) =>
  [Observable<Result<T, E>>, Observable<Result<T, E>>]

export function partition<T>(source: Observable<T>, predicate: (value: T, index: number) => boolean) {
  return [
    source.pipe(filter(predicate)),
    source.pipe(filter((v, i) => !predicate(v, i))),
  ]
}

/**
 * 创建 fromService creator
 * @param {Notification} notification
 */
export default function createFromService<T, E>(notification: Notification, serviceConfig: ServiceConfig<T, E>, store: Store): ServiceFunc<T, E> {
  /**
   * fromServiceOperators
   * @param service
   * @param options
   */
  return function service(serviceName, service, options = { level: LEVEL.silent }) {
    store.dispatch({
      type: SERVICE_LOADING_START_ACTION,
      payload: {
        service: serviceName
      }
    })
    const { success = noop, error = noop } = options.templates || serviceConfig.templates || {}
    const { level } = options
    const successNotificate = (resp: T) => level >= LEVEL.all &&
      notification.success(success(resp))
    const errorNotificate = (err: E) => level >= LEVEL.error &&
      notification.error(error(err))

    const response$ = (typeof serviceConfig.isSuccess) === 'function'
    ? from(service).pipe(
        map(resp => {
          if (serviceConfig.isSuccess(resp)) {
            return {  resp, success: true }
          } else {
            const error: E = serviceConfig.errorSelector ? serviceConfig.errorSelector(resp) : 'error'
            return { error }
          }
        })
      )
    : from(service).pipe(
        map(resp => {
          return {  resp, success: true }
        }),
        catchError((error: E) => {
          return of({
            error: serviceConfig.errorSelector ? serviceConfig.errorSelector(error) : error
          })
        })
      )

    const [success$, error$]: Observable<Result<T, E>>[] = partition<Result<T, E>>(
      response$,
      (({success}) => success)
    )

    return [
      success$.pipe(
        tap(({resp}) => {
          successNotificate(resp)
          store.dispatch({
            type: SERVICE_LOADING_END_ACTION,
            payload: {
              service: serviceName
            }
          })
        })
      ),
      error$.pipe(
        tap(({error}) => {
          errorNotificate(error)
          store.dispatch({
            type: SERVICE_ERROR_SET_ACTION,
            payload: {
              error,
              service: serviceName
            }
          })
        })
      )
    ]
  }
}
