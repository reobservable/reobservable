/**
 * service
 * @author yoyoyohamapi
 * @ingore created 2018-08-13 23:55:23
 */
import { AxiosResponse, AxiosError } from 'axios'
import { ServiceConfig, ServiceFunc } from '@reobservable/core'

export interface ApiService
  extends ServiceConfig<AxiosResponse<{ data: any }>, AxiosError> {}
export interface ApiServiceFunc<T = any>
  extends ServiceFunc<AxiosResponse<T>, AxiosError> {}
