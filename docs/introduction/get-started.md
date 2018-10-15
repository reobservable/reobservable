# Get Started

## Installation

```bash
npm install @reobservable/core
```

## Define Model

**models/user.ts**:

```ts
import { Model } from '@reobservable/core'
import { merge } from 'rxjs'
import { switchMap, withLatestFrom, map, mapTo } from 'rxjs/operators'

import { fetchUsers } from './apis'

interface IUser {
  name: string,
  avatar: string,
  age: number
}

interface IUserState = {
  list: IUser[],
  total: number
}

const user: Model<IUserState> = {
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
          return {
            // params
          }
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

## Define Service

> In this example, suppose you use axios for api request:

**services/api.ts**:

```ts
import { AxiosResponse, AxiosError } from 'axios'
import { ServiceConfig, ServiceFunc } from '@reobservable/core'

interface ApiService extends ServiceConfig<AxiosResponse<{data: any}>, AxiosError> {}

export default {
  templates: {
    success: (resp) => 'success',
    error: (error) => `error`
  }
} as ApiService
```


## Create Store

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