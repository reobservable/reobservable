# Get Started

## Installation

```bash
npm install @reobservable/core
```

Suppose we want to build a user management app which should display a user list in the web page, the following steps should be followed:

## Define Service

At first, you should declare the service that in charge of the communication of the frontend and backend. In this example, suppose you prefre [axios](https://github.com/axios/axios) for api request:

```ts
import { AxiosResponse, AxiosError } from 'axios'
import { ServiceConfig, ServiceFunc } from '@reobservable/core'

interface ApiService extends ServiceConfig<AxiosResponse<{data: any}>, AxiosError> {}

const api: ApiService = {
  templates: {
    success: (resp) => 'ok!',
    error: (error) => 'error!'
  }
}

export default api
```

## Define Models

In this scenario, we should define a **user** model to aggregate state, actions, async actions & reducers.

```ts
import { Model } from '@reobservable/core'
import { merge } from 'rxjs'
import { switchMap, withLatestFrom, map, mapTo } from 'rxjs/operators'
import { IUserState, IState } from './types'
import { fetchUsers } from './service'

const user: Model<IUserState, IState> = {
  name: 'user',
  state: {
    list: [],
    total: 0
  },
  reducers: {
   fetchSuccess(state, payload) {
     return {
       ...state,
       list: payload.list,
       total: payload.total
     }
   },
   fetchError(state, payload) {
     return {
       ...state,
       list: [],
       total: 0
     }
   }
  },
  flows: {
    fetch(flow$, action$, state$, dependencies) {
      const { api } = dependencies.services
      return flow$.pipe(
        withLatestFrom(state$, (action, state) => {
          const params = {
            // construct params from state or action payload
          }
          return params
        }),
        switchMap(params => {
          const [success$, error$] = api(
            '/api/fetchUsers',
            fetchUsers(params)
          )

          return merge(
            success$.pipe(
              map(resp => ({
                type: 'user/fetchSuccess',
                payload: {
                  list: resp.list,
                  total: resp.total
                }
              }))
            ),
            error$.pipe(
              mapTo({type: 'user/fetchError'})
            )
          )
        })
      )
    }
  }
}
```

## Create Redux Store

Finnaly, we could call `init(options)` to create redux store:

```tsx
import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@reobservable/core'

import user from './models/user'
import api from './services/api'

const store = init({
  services: {
    api
  },
  models: {
    user
  }
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
```