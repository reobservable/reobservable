/**
 * action test
 * @author yoyoyohamapi
 * @ignore created 2018-09-19 17:10:46
 */
import { expect } from 'chai'
import { Symbols } from '../src'
import { actionSanitizer } from '../src/utils/action'
import { Action } from '../src/types/Action'

describe('action', () => {
  it('should support action alias', () => {
    const action: Action = {
      type: 'foo',
      [Symbols.ALIAS]: 'FOO',
      payload: {}
    }

    expect(actionSanitizer(action)).to.deep.include({
      type: 'FOO'
    })
  })
})
