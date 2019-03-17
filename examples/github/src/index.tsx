/**
 * Github Demo
 * @author yoyoyohamapi
 * @ignore created 2018-08-08 15:50:46
 */
import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { message } from 'antd'

import { init } from '@reobservable/core'
import App from '@modules/app'
import userModel from '@models/user'
import repoModel from '@models/repo'
import { ApiService } from '@services/types'

import createHistory from 'history/createHashHistory'

import 'antd/dist/antd.css'

const history = createHistory()

const store = init({
  redux: {
    middleware: [routerMiddleware(history)],
    rootReducer(rootReducer) {
      return connectRouter(history)(rootReducer)
    }
  },
  models: {
    user: userModel,
    repo: repoModel
  },
  notification: message,
  services: {
    api: {
      templates: {
        success: resp => 'success',
        error: error => `error`
      }
    } as ApiService
  }
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
