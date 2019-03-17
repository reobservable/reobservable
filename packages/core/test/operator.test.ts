/**
 * operator test
 * @author yoyoyohamapi
 * @ignore created 2018-08-14 19:12:37
 */
import { expect } from 'chai'
import { TestScheduler } from 'rxjs/testing'
import { FLOW_END_INDICATOR } from '../src/constants/meta'
import end from '../src/operators/end'
import endTo from '../src/operators/endTo'

describe('operator', () => {
  let scheduler

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).deep.equal(expected)
    })
  })

  it('#end', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const current$ = cold('-a', {
        a: 1
      })
      const endAction$ = current$.pipe(
        end(current => ({
          type: 'SET_CURRENT_USER',
          payload: {
            current
          }
        }))
      )

      expectObservable(endAction$).toBe('-e', {
        e: {
          type: 'SET_CURRENT_USER',
          payload: {
            current: 1
          },
          [FLOW_END_INDICATOR]: true
        }
      })
    })
  })

  it('#endTo', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const clear$ = cold('-a')
      const endAction$ = clear$.pipe(
        endTo({
          type: 'SET_CURRENT_USER',
          payload: {
            current: null
          }
        })
      )

      expectObservable(endAction$).toBe('-e', {
        e: {
          type: 'SET_CURRENT_USER',
          payload: {
            current: null
          },
          [FLOW_END_INDICATOR]: true
        }
      })
    })
  })
})
