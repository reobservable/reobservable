/**
 * redux config test
 * @author yooyoyohamapi
 * @ignore created 2018-10-08 09:38:26
 */

import * as sinon from 'sinon'
import { expect } from 'chai'
import { init } from '../src'
import Model from '../src/types/Model'
import { Middleware, combineReducers } from 'redux'

describe('redux', () => {
  it('should support root reducer wrapper#1', () => {
    const model: Model<{ name: string }> = {
      name: 'model',
      state: {
        name: 'model'
      },
      reducers: {
        changeName(state, payload) {
          return { ...state, name: payload.name }
        },
        dangerouslyChangeName(state, payload) {
          return { ...state, name: payload.name }
        }
      }
    }
    const store = init({
      redux: {
        rootReducer(rootReducer) {
          return function(state, action) {
            if (action.type === 'model/dangerouslyChangeName') {
              return state
            } else {
              return rootReducer(state, action)
            }
          }
        }
      },
      models: { model }
    })

    store.dispatch({
      type: 'model/changeName',
      payload: { name: 'changed' }
    })

    store.dispatch({
      type: 'model/dangerouslyChangeName',
      payload: { name: 'dangerouslyChangedName' }
    })

    const { name } = store.getState().model
    expect(name).to.equal('changed')
  })

  it('should support root reducer wrapper#2', () => {
    const model: Model<{ name: string }> = {
      name: 'model',
      state: {
        name: 'model'
      },
      reducers: {
        changeName(state, payload) {
          return { ...state, name: payload.name }
        },
        dangerouslyChangeName(state, payload) {
          return { ...state, name: payload.name }
        }
      }
    }
    const store = init({
      redux: {
        rootReducer(rootReducer, reducers) {
          return combineReducers({
            ...reducers,
            count: (state = 0, action) => {
              if (action.type === 'count/incr') {
                return state + 1
              } else {
                return state
              }
            }
          })
        }
      },
      models: { model }
    })

    store.dispatch({
      type: 'model/changeName',
      payload: { name: 'changed' }
    })

    store.dispatch({
      type: 'count/incr'
    })

    const { name } = store.getState().model
    const count = store.getState().count
    expect(name).to.equal('changed')
    expect(count).to.equal(1)
  })

  it('should support single redux middleware', () => {
    const fake = sinon.fake()
    const middleware: Middleware = store => {
      return next => action => {
        return fake()
      }
    }

    const store = init({
      redux: {
        middleware
      }
    })

    store.dispatch({ type: 'fetch' })

    expect(fake.calledOnce).to.be.true
  })

  it('should support redux middleware list', () => {
    const fake = sinon.fake()
    const middleware: Middleware = store => {
      return next => action => {
        return fake()
      }
    }

    const store = init({
      redux: {
        middleware: [middleware]
      }
    })

    store.dispatch({ type: 'fetch' })

    expect(fake.calledOnce).to.be.true
  })
})
