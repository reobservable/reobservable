/**
 * user model
 * @author yoyoyohamapi
 * @ignore created 2018-07-17 15:11:14
 */
import { isEqual } from 'lodash/fp'
import { timer, Observable, merge } from 'rxjs'
import { map, combineLatest, distinctUntilChanged, switchMap, startWith, takeUntil, mapTo } from 'rxjs/operators'
import { createSelector } from 'reselect'
import { PaginationProps } from 'antd/lib/pagination'
import { Model, NOTIFICATION_LEVEL, getService } from '@reobservable/core'
import { fetch } from '@services/user'
import { Order, Pagination } from '@models/common'
import { ApiServiceFunc } from '@services/types'

export interface User {
  login: string,
  id: number,
  avatar_url: string,
  url: string,
  html_url: string
}

export interface UserState {
  list: User[],
  pagination: Pagination,
  sort: string,
  isSilentLoading: boolean,
  query: string
}

export interface SearchParam {
  q: string,
  language: string,
  page: number,
  per_page: number,
  sort: string,
  order: Order
}

export interface SearchResp {
  total_count: number,
  items: User[]
}

const showTotal = total => `共 ${total} 条`

const user: Model<UserState, {user: UserState}> = {
  name: 'user',
  state: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10
    },
    sort: 'followers',
    isSilentLoading: false,
    query: ''
  },
  selectors: {
    pagination: createSelector<{user: UserState}, Pagination, PaginationProps>(
      ({user}) => user.pagination,
      ({total, page, pageSize}) => ({
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal
      })
    )
  },
  reducers: {
    startPolling(state) {
      return {...state, isSilentLoading: false}
    },
    fetchSuccess(state, payload) {
      return {
        ...state,
        list: payload.list,
        pagination: {
          ...state.pagination,
          total: payload.total
        },
        isSilentLoading: true
      }
    },
    fetchError(state, payload) {
      return {
        ...state,
        list: [],
        pagination: {
          ...state.pagination,
          total: 0,
          page: 1
        }
      }
    }
  },
  flows: {
    fetch(flow$, action$, state$) {
      const service: ApiServiceFunc<SearchResp> = getService('api')
      const stopPolling$ = action$.ofType('user/stopPolling', 'user/fetchError')
      const params$: Observable<SearchParam> = state$.pipe(
        map(({user}: {user: UserState}) => {
          const { pagination, sort, query } = user
          return {
            q: `${query ? query + ' ' : ''}language:javascript`,
            language: 'javascript',
            page: pagination.page,
            per_page: pagination.pageSize,
            sort,
            order: Order.Desc
          }
        }),
        distinctUntilChanged(isEqual)
      )

      return flow$.pipe(
        combineLatest(params$, (action, params) => params),
        switchMap(params => {
          const polling$ = timer(0, 15 * 1000).pipe(
            takeUntil(stopPolling$),
            switchMap(() => {
              const [success$, error$] = service(
                'user/fetch',
                fetch(params),
                {level: NOTIFICATION_LEVEL.all}
              )
              return merge(
                success$.pipe(
                  map(({resp: {data}}) => ({
                    type: 'user/fetchSuccess',
                    payload: {
                      total: data.total_count,
                      list: data.items
                    }
                }))),
                error$.pipe(
                  mapTo({
                    type: 'user/fetchError',
                    payload: {}
                  })
                )
              )
            }),
            startWith({
              type: 'user/startPolling'
            })
          )
          return polling$
        })
      )
    }
  }
}

export default user
