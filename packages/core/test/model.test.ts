/**
 * 模型测试
 * @author yoyoyohamapi
 * @ignore created 2018-08-14 19:12:12
 */
import { Store } from 'redux'
import { mapTo } from 'rxjs/operators'
import { expect } from 'chai'
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
    'post/create': function (state, payload) {
      const { id } = payload
      return { ...state, editingPost: id }
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

  describe('#init', () => {
    it('should throw error when model name conflicted', () => {
      expect(function() {
        init({
          models: {
            user,
            user2: {
              name: 'user',
              state: {}
            }
          }
        })
      }).to.throw('model user has been defined')
    })
  })

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
    it('should support declare reducers of others', () => {
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
        }
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
