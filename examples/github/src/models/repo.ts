/**
 * repo model
 * @author yoyoyohamapi
 * @ignore created 2018-07-17 15:11:14
 */
import * as moment from 'moment'
import { isEqual } from 'lodash/fp'
import { timer, merge, Observable } from 'rxjs'
import {
  map,
  combineLatest,
  distinctUntilChanged,
  switchMap,
  startWith,
  takeUntil,
  mapTo
} from 'rxjs/operators'
import { createSelector } from 'reselect'
import { PaginationProps } from 'antd/lib/pagination'
import { Model, NOTIFICATION_LEVEL, getService } from '@reobservable/core'
import { fetch } from '@services/repo'
import { Order, Pagination } from '@models/common'
import { ApiServiceFunc } from '@services/types'

export interface Repo {
  id: number
  name: string
  full_name: string
  html_url: string
  url: string
  homepage: string
  updated_at: string
}

export interface RepoState {
  list: Repo[]
  pagination: Pagination
  sort: string
  isSilentLoading: boolean
  query: string
}

export interface SearchParam {
  q: string
  page: number
  per_page: number
  sort: string
  order: Order
}

export interface SearchResp {
  total_count: number
  items: Repo[]
}

const showTotal = total => `共 ${total} 条`

const repo: Model<RepoState, { repo: RepoState }> = {
  name: 'repo',
  state: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10
    },
    sort: 'stars',
    isSilentLoading: false,
    query: ''
  },
  reducers: {
    startPolling(state) {
      return { ...state, isSilentLoading: false }
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
  selectors: {
    pagination: createSelector<
      { repo: RepoState },
      Pagination,
      PaginationProps
    >(
      ({ repo }) => repo.pagination,
      ({ total, page, pageSize }) => ({
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal
      })
    )
  },
  flows: {
    fetch(flow$, action$, state$) {
      const service: ApiServiceFunc<SearchResp> = getService('api')
      const stopPolling$ = action$.ofType(
        'repo/stopPolling',
        'repo/fetchError'
      )
      const params$: Observable<SearchParam> = state$.pipe(
        map(state => {
          const { pagination, sort, query } = state.repo
          return {
            q: `${query ? query + '+' : ''}language:javascript`,
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
          const polling$ = timer(0, 30 * 60 * 1000).pipe(
            takeUntil(stopPolling$),
            switchMap(() => {
              const [success$, error$] = service('repo/fetch', fetch(params), {
                level: NOTIFICATION_LEVEL.silent
              })
              return merge(
                success$.pipe(
                  map(({ resp: { data } }) => ({
                    type: 'rep/fetchSuccess',
                    payload: {
                      total: data.total_count,
                      list: data.items.map((item: Repo) => ({
                        ...item,
                        displayUpdated: moment(item.updated_at).format(
                          'YYYY-MM-DD HH:mm'
                        )
                      }))
                    }
                  }))
                ),
                error$.pipe(
                  mapTo({
                    type: 'repo/fetchError',
                    payload: {}
                  })
                )
              )
            }),
            startWith({
              type: 'repo/startPolling',
              payload: {}
            })
          )
          return polling$
        })
      )
    }
  }
}

export default repo
