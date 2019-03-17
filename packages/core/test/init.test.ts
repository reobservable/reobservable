/**
 * init test
 * @author yoyoyohamapi
 * @ignore created 2018-10-08 10:23:13
 */
import { expect } from 'chai'
import { init, notificate } from '../src'
import Model from '../src/types/Model'

describe('#init', () => {
  it('should throw error when model name conflicted', () => {
    expect(function() {
      init({
        models: {
          user: { name: 'user', state: {} },
          duplicatedUser: { name: 'user', state: {} }
        }
      })
    }).to.throw('model user has been defined')
  })

  it('should support empty init', () => {
    expect(function() {
      init({})
    }).to.not.throw()
  })

  it('should support custom notification', () => {
    const notification = {
      info(msg) {
        return msg
      },
      success(msg) {
        return msg
      }
    }

    const user: Model<{ name: string }> = {
      name: 'user'
    }

    init({
      models: { user },
      notification
    })

    expect(notificate('success', 'ok')).to.equal('ok')
    expect(notificate('info', 'none')).to.equal('none')
    expect(notificate('error', 'wrong')).to.be.undefined
    expect(notificate('none', 'none')).to.equal('none')
  })

  it('should not notificate when message is nil', () => {
    const notification = {
      info(msg) {
        return msg
      },
      success(msg) {
        return msg
      }
    }

    const user: Model<{ name: string }> = {
      name: 'user'
    }

    init({
      models: { user },
      notification
    })

    expect(notificate('info', null)).to.be.undefined
    expect(notificate('info', undefined)).to.be.undefined
  })
})
