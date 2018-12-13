/**
 * model test
 * @author yoyoyohamapi
 * @ignore created 2018-08-14 19:12:12
 */
import { Store } from 'redux'
import { mapTo } from 'rxjs/operators'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { init, getSelectors } from '../src'
import Model from '../src/types/Model'

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

interface PostState {
  list: Post[],
  pagination: Pagination,
  current: string
}

const userInitialState = {
  list: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  },
  current: null,
  editingPost: null
}

const user: Model<UserState, {user: UserState}> = {
  name: 'user',
  state: userInitialState,
  reducers: {
    fetchSuccess(state, payload) {
      const { list, total } = payload
      return { ...state, list, pagination: { ...state.pagination, total } }
    },
    'post/create': function (state, payload) {
      const { id } = payload
      return { ...state, editingPost: id }
    },
    init(state, payload) {
      return state
    }
  },
  selectors: {
    youngsters: (state) => {
      const { list } = state.user
      return list.filter(({age}) => age < 30)
    }
  },
  flows: {
    fetch(flow$) {
      return flow$.pipe(
        mapTo({
          type: 'user/fetchSuccess',
          payload: {
            list: [
              {id: 1, name: 'Messi', age: 31},
              {id: 2, name: 'Neymar', age: 26},
              {id: 3, name: 'Ronaldo', age: 33}
            ],
            total: 20
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
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    current: null
   },
   reducers: {
    init(state, payload) {
      return state
    }
   },
   flows: {
   }
}

describe('model', () => {
  let store: Store

  const initStore = () => {
    store = init({
      models: { user, post }
    })
  }

  describe('#state', () => {
    beforeEach(initStore)

    it('should have model state', () => {
      const state = store.getState()
      expect(state).to.deep.include({
        user: {
          list: [],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 0
          },
          current: null,
          editingPost: null
        },
        post: {
          list: [],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 0
          },
          current: null
        }
      })
    })

    it('should have loading state', () => {
      const state = store.getState()
      expect(state).to.deep.include({
        loading: { flows: {}, services: {} }
      })
    })

    it('should have error state', () => {
      const state = store.getState()
      expect(state).to.deep.include({
        error: { flows: {}, services: {} }
      })
    })
  })

  describe('#reducers', () => {
    beforeEach(initStore)

    it('should have custom reducers', () => {
      store.dispatch({
        type: 'user/fetch'
      })
      const { list, pagination } = store.getState().user
      expect(list).to.have.deep.members([
        {id: 1, name: 'Messi', age: 31},
        {id: 2, name: 'Neymar', age: 26},
        {id: 3, name: 'Ronaldo', age: 33}
      ])
      expect(pagination.total).to.equal(20)
    })

    it('should match model reducer correctly', () => {
      const spyUserInit = sinon.spy(user.reducers, 'init')
      const spyPostInit = sinon.spy(post.reducers, 'init')
      store.dispatch({
        type: 'user/init'
      })
      expect(spyUserInit.calledOnce).to.be.true
      expect(spyPostInit.notCalled).to.be.true
    })

    it('should support reactive the reducer of others', () => {
      store.dispatch({
        type: 'post/create',
        payload: {
          id: 1
        }
      })
      const { editingPost } = store.getState().user
      expect(editingPost).to.equal(1)
    })

    it('should have change reducer', () => {
      store.dispatch({
        type: 'user/change',
        payload: {
          current: 1
        }
      })
      const { current } = store.getState().user
      expect(current).to.equal(1)
    })

    it('should have patch reducer', () => {
      store.dispatch({
        type: 'user/patch',
        payload: {
          pagination: {
            total: 10
          },
          current: 4,
          list: [{id: 1, name: 'Messi', age: 31}]
        }
      })
      const { user } = store.getState()
      expect(user).to.deep.include({
        list: [{id: 1, name: 'Messi', age: 31}],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 10
        },
        current: 4
      })
    })

    it('should have reset reducer', () => {
      store.dispatch({
        type: 'user/patch',
        payload: {
          pagination: { page: 2 },
          current: 4
        }
      })

      store.dispatch({
        type: 'user/reset'
      })

      const { user } = store.getState()
      expect(user).not.to.equal(userInitialState)
      expect(user).to.deep.equal(userInitialState)
    })

    it('should support reset partial state', () => {
      store.dispatch({
        type: 'user/patch',
        payload: {
          current: 4,
          pagination: { page: 2 },
          editingPost: 4
        }
      })

      store.dispatch({
        type: 'user/reset',
        payload: {
          states: ['pagination', 'current']
        }
      })

      const { user } = store.getState()
      expect(user).not.to.equal(userInitialState)
      expect(user).to.deep.equal({
        list: [],
        current: null,
        pagination: userInitialState.pagination,
        editingPost: 4
      })
    })
  })

  describe('#selectors', () => {
    beforeEach(initStore)

    it('should create selectors', () => {
     store.dispatch({
       type: 'user/fetch'
     })
     const youngsters = getSelectors('user').youngsters(store.getState())
     expect(youngsters).to.deep.equal([
      {id: 2, name: 'Neymar', age: 26}
     ])
    })
  })
})
