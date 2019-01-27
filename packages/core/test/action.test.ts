/**
 * action test
 * @author yoyoyohamapi
 * @ignore created 2018-09-19 17:10:46
 */
import { expect } from 'chai'
import { Symbols } from '../src'
import { actionSanitizer, getPayload } from '../src/utils/action'
import { Action } from '../src/types/action'

describe('action', () => {
  it('should payload be {} when payload is nil', () => {
    expect(getPayload({type: 'undefined payload'})).to.deep.equal({})
    expect(getPayload({type: 'null payload`', payload: null})).to.deep.equal({})
  })

  it('should support action alias', () => {
    const action: Action = {
      type: 'foo',
      [Symbols.ALIAS]: 'FOO',
      payload: {}
    }

    expect(actionSanitizer(action)).to.deep.include({
      type: 'FOO'
    })

    expect(actionSanitizer({type: 'foo', payload: {}})).to.deep.include({
      type: 'foo'
    })
  })
})
