/**
 * flow tests
 * @author yoyoyohamapi
 * @ignore created 2018-09-21 15:10:10
 */
import { expect } from 'chai'
import { Store } from 'redux'
import { map, delay } from 'rxjs/operators'
import { init } from '../src'
import Model from '../src/types/Model'
import end from '../src/operators/end'

interface UserState {
  list: User[],
  current: number
}

interface PostState {
  list: Post[],
  current: number
}

interface User {
  id: number,
  name: string,
  age: number
}

interface Post {
  id: number,
  title: string,
  content: string
}

const user: Model<UserState> = {
  name: 'user',
  state: {
    list: [],
    current: null
  },
  flows: {
    throwError(flow$) {
      return flow$.pipe(
        map(({payload}) => {
          if (payload.throw) {
            throw Error('error')
          } else {
            return {
              type: 'none'
            }
          }
        })
      )
    }
  }
}

const post: Model<PostState> = {
  name: 'post',
  state: {
    list: [],
    current: null
  },
  reducers: {
    fetchSuccess(state, payload) {
      return {
        ...state,
        list: payload.list
      }
    }
  },
  flows: {
    fetch(flow$) {
      return flow$.pipe(
        delay(10),
        end(() => ({
          type: 'post/fetchSuccess',
          payload: {
            list: [{
              id: 1, title: '#1', content: '#1 content'
            }, {
              id: 2, title: '#2', content: '#2 content'
            }, {
              id: 3, title: '#3', content: '#3 content'
            }]
          }
      })))
    }
  }
}

describe('flow', () => {
  let store: Store

  const initStore = () => {
    store = init({
      models: { user, post }
    })
  }

  beforeEach(initStore)

  it('should set loading true when flow start', () => {
    store.dispatch({
      type: 'post/fetch'
    })

    const loading = store.getState().loading
    expect(loading.flows['post/fetch']).to.be.true
  })

  it('should set loading false when flow end', (done) => {
    store.dispatch({
      type: 'post/fetch'
    })

    setTimeout(() => {
      const loading = store.getState().loading
      expect(loading.flows['post/fetch']).to.be.false
      done()
    }, 20)
  })

  it('should catch flow error', () => {
    store.dispatch({
      type: 'user/throwError',
      payload: {
        throw: true
      }
    })

    const error = store.getState().error
    expect(error.flows['user/throwError']).to.property('message').be.equal('error')
  })

  it('should reset error when action retry', () => {
    store.dispatch({
      type: 'user/throwError',
      payload: {
        throw: true
      }
    })

    store.dispatch({
      type: 'user/throwError',
      payload: {
        throw: false
      }
    })

    const error = store.getState().error
    expect(error.flows['user/throwError']).to.be.null
  })

  it('should not stop current flow when other flow throw error', (done) => {
    store.dispatch({
       type: 'user/throwError'
    })

    store.dispatch({
      type: 'post/fetch'
    })

    setTimeout(() => {
      const state = store.getState()
      expect(state.post.list).to.not.empty
      done()
    }, 20)
  })
})
