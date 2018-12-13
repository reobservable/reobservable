/**
 * service test
 * @author yoyoyohamapi
 * @ignore created 2018-08-14 19:04:55
 */
import { Store } from 'redux'
import { merge, Observable } from 'rxjs'
import { mapTo, switchMap, map } from 'rxjs/operators'
import { expect } from 'chai'
import axios, { AxiosResponse, AxiosError } from 'axios'
import * as nock from 'nock'
import * as sinon from 'sinon'
import { init, getService, NOTIFICATION_LEVEL } from '../src'
import Model from '../src/types/Model'
import { ServiceConfig, ServiceFunc } from '../src/operators/createService'

const request = axios.create({
  baseURL: 'http://api.com'
})

interface ApiService extends ServiceConfig<AxiosResponse, AxiosError> {}
interface ApiServiceFunc<T = any> extends ServiceFunc<AxiosResponse<T>, AxiosError> {}

interface User {
  id: number,
  name: string,
  age: number
}

interface Pagination {
  page: number,
  pageSize: number,
  total: number
}

interface UserState {
  list: User[],
  pagination: Pagination,
  current: number,
  editingPost: number
}

const customTemplates = {
  success: (resp: AxiosResponse) => `follow ${resp.data.user} success`,
  error: (error) => `Error: ${error}`
}

const user: Model<UserState, {user: UserState}> = {
  name: 'user',
  state: {
    list: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    current: null,
    editingPost: null
  },
  reducers: {
    fetchSuccess(state, payload) {
      const { list, total } = payload
      return { ...state, list, pagination: { ...state.pagination, total } }
    },
    fetchError(state) {
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
    follow(flow$) {
      const api = getService('api')
      return flow$.pipe(
        switchMap(() => {
          const [success$, error$] = api(
            'user/follow',
            followUser({}),
            {
              level: NOTIFICATION_LEVEL.all,
              templates: customTemplates
            }
          )
          return merge(success$, error$).pipe(
            mapTo(null)
          )
        })
      )
    },
    rename(flow$, action$, state$, {services: { api }}) {
      return flow$.pipe(
        switchMap(({payload}) => {
          const [success$, error$] = api(
            'user/rename',
            renameUser({name: payload.name}),
            {level: NOTIFICATION_LEVEL.all}
          )
          return merge(success$, error$).pipe(
            mapTo(null)
          )
        })
      )
    },
    unfollow(flow$, action$, state$, {services: { api }}) {
      return flow$.pipe(
        switchMap(({payload}) => {
          const [success$, error$] = api(
            'user/unfollow',
            unfollowUser({name: payload.name}),
            {
              level: NOTIFICATION_LEVEL.all,
              retry: 2
            }
          )
          return merge(success$, error$).pipe(
            mapTo(null)
          )
        })
      )
    },
    unfollowWithRetryDelay(flow$, action$, state$, {services: { api }}) {
      return flow$.pipe(
        switchMap(({payload}) => {
          const [success$, error$] = api(
            'user/unfollow',
            unfollowUser({name: payload.name}),
            {
              level: NOTIFICATION_LEVEL.all,
              retry: 2,
              retryDelay: 1000
            }
          )
          return merge(success$, error$).pipe(
            mapTo(null)
          )
        })
      )
    },
    fetch(flow$) {
      const api: ApiServiceFunc = getService('api')
      return flow$.pipe(
        switchMap(() => {
          const [success$, error$] = api(
            'user/fetch',
            fetchUsers({})
          )

          return merge(
            success$.pipe(
              map(({resp: {data}}) => ({
                type: 'user/fetchSuccess',
                payload: {
                  total: data.total,
                  list: data.items
                }
              }))
            ),
            error$.pipe(
              mapTo({
                type: 'user/fetchError',
                payload: {}
              })
            )
          )
        })
      )
    }
  }
}

const apiService: ApiService = {
  templates: {
    success: (resp) => 'call api success',
    error: (error) => `call api error`
  },
  errorSelector: error => error.message
}

function fetchUsers(params) {
  return request.get('/users', {params})
}

function renameUser(params) {
  return request.post('/users/rename', {params})
}

function followUser(params) {
  return request.post('/users/follow', {params})
}

const createUnfollowUserSubscriber = sinon.spy((observer, params) => {
  request.post('/users/unfollow', {params})
    .then(result => observer.next(result))
    .catch(error => observer.error(error))
})

function unfollowUser(params) {
  return Observable.create(observer => createUnfollowUserSubscriber(observer, params))
}

describe('service', () => {
  let store: Store

  beforeEach(() => {
    store = init({
      models: { user },
      services: {
        api: apiService
      }
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should create services', () => {
    const apiService = getService('api')
    expect(apiService).to.be.instanceof(Function)
  })

  it('should set loading true when service start', () => {
    nock(/api\.com/).get(/users/).reply(200, {
      items: [
        {id: 1, name: 'Messi', age: 31},
        {id: 2, name: 'Neymar', age: 26},
        {id: 3, name: 'Ronaldo', age: 33}
      ],
      total: 20
    })

    store.dispatch({
      type: 'user/fetch'
    })
    const { loading } = store.getState()
    expect(loading).to.deep.include({
      services: {
        'user/fetch': true
      }
    })
  })

  it('should set loading false when service end', (done) => {
    nock(/api\.com/).get(/users/).reply(200, {
      items: [
        {id: 1, name: 'Messi', age: 31},
        {id: 2, name: 'Neymar', age: 26},
        {id: 3, name: 'Ronaldo', age: 33}
      ],
      total: 20
    })
    store.dispatch({
      type: 'user/fetch'
    })
    setTimeout(() => {
      const { loading } = store.getState()
      expect(loading).to.deep.include({
        services: {
          'user/fetch': false
        }
      })
      done()
    }, 10)
  })

  it('should set loading false when service error', (done) => {
    nock(/api\.com/).get(/users/).replyWithError({})
    store.dispatch({
      type: 'user/fetch'
    })
    setTimeout(() => {
      const { loading } = store.getState()
      expect(loading).to.deep.include({
        services: {
          'user/fetch': false
        }
      })
      done()
    }, 10)
  })

  it('should set error when service error', (done) => {
    nock(/api\.com/).get(/users/).replyWithError({
      message: 'Error!',
      code: -1
    })
    store.dispatch({
      type: 'user/fetch'
    })
    setTimeout(() => {
      const { error } = store.getState()
      expect(error).to.deep.include({
        services: {
          'user/fetch': 'Error!'
        }
      })
      done()
    }, 10)
  })

  it('should reset error when service restart', (done) => {
    nock(/api\.com/).get(/users/).replyWithError({
      message: 'Error!',
      code: -1
    })
    store.dispatch({
      type: 'user/fetch'
    })
    setTimeout(() => {
      store.dispatch({
        type: 'user/fetch'
      })
      const { error } = store.getState()
      expect(error).to.deep.include({
        services: {
          'user/fetch': null
        }
      })
      done()
    }, 10)

 })

  it('should not stop epic when service error', (done) => {
    nock(/api\.com/).get(/users/).replyWithError({
      message: 'Error!',
      code: -1
    })
    store.dispatch({
      type: 'user/fetch'
    })
    setTimeout(() => {
      nock(/api\.com/).get(/users/).reply(200, {
        items: [
          {id: 1, name: 'Messi', age: 31},
          {id: 2, name: 'Neymar', age: 26},
          {id: 3, name: 'Ronaldo', age: 33}
        ],
        total: 20
      })
      store.dispatch({
        type: 'user/fetch'
      })
      setTimeout(() => {
        const { user } = store.getState()
        expect(user).to.deep.include({
          list: [
            {id: 1, name: 'Messi', age: 31},
            {id: 2, name: 'Neymar', age: 26},
            {id: 3, name: 'Ronaldo', age: 33}
          ],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 20
          }
        })
        done()
      }, 10)
    }, 10)
  })

  it('should notificate success message when level is all', (done) => {
    const spy = sinon.spy(apiService.templates, 'success')
    nock(/api\.com/).post(/users\/rename/).reply(200, {})
    store.dispatch({
      type: 'user/rename',
      payload: { name: 'john' }
    })
    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      spy.restore()
      done()
    }, 10)
  })

  it('should not notificate success message when level is greater than error', (done) => {
    const spy = sinon.spy(apiService.templates, 'error')
    nock(/api\.com/).post(/users\/rename/).replyWithError({message: 'Error!'})
    store.dispatch({
      type: 'user/rename',
      payload: { name: 'john' }
    })
    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      spy.restore()
      done()
    }, 10)
  })

  it('should notificate none messages when level is silent', (done) => {
    const spy = sinon.spy(apiService.templates, 'success')
    nock(/api\.com/).get(/users/).reply(200, {})
    store.dispatch({
      type: 'user/fetch'
    })
    setTimeout(() => {
      expect(spy.notCalled).to.be.true
      spy.restore()
      done()
    }, 10)
  })

  it('should support service success notification template', (done) => {
    const spy = sinon.spy(customTemplates, 'success')
    nock(/api\.com/).post(/users\/follow/).reply(200, {
      user: 'tom'
    })
    store.dispatch({
      type: 'user/follow'
    })
    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      expect(spy.returnValues[0]).to.equal('follow tom success')
      spy.restore()
      done()
    }, 10)
  })

  it('should support service error notification template', (done) => {
    const spy = sinon.spy(customTemplates, 'error')
    nock(/api\.com/).post(/users\/follow/).replyWithError({
      code: -1,
      message: 'unknown error'
    })
    store.dispatch({
      type: 'user/follow'
    })
    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      expect(spy.returnValues[0]).to.equal('Error: unknown error')
      spy.restore()
      done()
    }, 10)
  })

  it('should support custom success predicate function', (done) => {
    const service: ServiceConfig<AxiosResponse, AxiosError> = {
      isSuccess: resp => resp.data.code !== -1,
      errorSelector: resp => resp.data.message
    }
    const spy = sinon.spy(service, 'isSuccess')
    store = init({
      models: { user },
      services: {
        api: service
      }
    })
    nock(/api\.com/).post(/users\/follow/).reply(200, {
      code: -1,
      message: 'unknown error'
    })
    nock(/api\.com/).get(/users/).reply(200, {
      code: 1,
      message: ''
    })
    store.dispatch({
      type: 'user/follow'
    })
    store.dispatch({
      type: 'user/fetch'
    })
    setTimeout(() => {
      const error = store.getState().error
      expect(spy.calledTwice).to.be.true
      expect(error).to.deep.include({
        services: {
          'user/follow': 'unknown error',
          'user/fetch': null
        }
      })
      sinon.restore()
      done()
    }, 10)
  })

  it('should support default error selector when service.isSuccess has been set', (done) => {
    const service: ServiceConfig<AxiosResponse, AxiosError> = {
      isSuccess: resp => resp.data.code !== -1
    }
    store = init({
      models: { user },
      services: {
        api: service
      }
    })
    nock(/api\.com/).post(/users\/follow/).reply(200, {
      code: -1,
      message: 'unknown error'
    })
    store.dispatch({
      type: 'user/follow'
    })
    setTimeout(() => {
      const error = store.getState().error
      expect(error).to.deep.include({
        services: {
          'user/follow': 'error'
        }
      })
      done()
    }, 10)
  })

  it('should support default error selector when service.isSuccess has not been set', (done) => {
    store = init({
      models: { user },
      services: {
        api: { ...apiService, errorSelector: null }
      }
    })
    nock(/api\.com/).post(/users\/follow/).replyWithError({
      code: -1,
      message: 'unknown error'
    })
    store.dispatch({
      type: 'user/follow'
    })
    setTimeout(() => {
      const error = store.getState().error
      expect(error.services['user/follow']).not.empty
      done()
    }, 10)
  })

  it('should support retry', (done) => {
    store = init({
      models: { user },
      services: {
        api: apiService
      }
    })
    nock(/api\.com/).post(/users\/unfollow/).replyWithError('error')
    store.dispatch({
      type: 'user/unfollow'
    })
    setTimeout(() => {
      expect(createUnfollowUserSubscriber.callCount).to.equal(3)
      const error = store.getState().error
      expect(error.services['user/unfollow']).not.empty
      createUnfollowUserSubscriber.resetHistory()
      done()
    }, 1000)
  }).timeout(2000)

  it('should support retryDelay', (done) => {
    store = init({
      models: { user },
      services: {
        api: apiService
      }
    })
    nock(/api\.com/).post(/users\/unfollow/).replyWithError({
      code: -1,
      message: 'unknown error'
    })
    store.dispatch({
      type: 'user/unfollowWithRetryDelay'
    })
    setTimeout(() => {
      expect(createUnfollowUserSubscriber.callCount).to.equal(1)
    }, 500)
    setTimeout(() => {
      expect(createUnfollowUserSubscriber.callCount).to.equal(2)
    }, 1500)
    setTimeout(() => {
      expect(createUnfollowUserSubscriber.callCount).to.equal(3)
      const error = store.getState().error
      expect(error.services['user/unfollow']).not.empty
      createUnfollowUserSubscriber.resetHistory()
      done()
    }, 3000)
  }).timeout(5000)
})
