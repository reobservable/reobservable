# Concepts

Before creating a reobservable app, there are only two concepts you should konw.

## Model

Same as dva, model defines a state machine which mixined **initial state**,**sync actions**, **async actions(flows)**, **reducers** in one place.

```ts
import { Model } from '@reobservable'

const model: Model<State, UserState> = {
  name: 'user',
  state: {
    list: [],
    pagination: {
      totolCount: 0,
      page: 0,
      pageSize: 10
    }
  },
  reducers: {},
  flows: {}
}

export default model
```

As shown above, a model consists of five parts:

**name**

Model name, it indicates the scope of a model in redux store. In this example, we could get the user state by calling `store.getState().user`. Or in React component, we use react-redux:

```ts
const mapStateToPros = (state: IState) => {
  return {
    totalCount: state.user.totalCount
  }
}
```

**state**

Initial state of a model.

**reducers**

Redux reducers. When a synchronous action dispatched, depends on its type, it may hit a reducer to return a new state. For example, if we dispatched an action:

```ts
{
  type: 'user/fetchSuccess',
  payload: {
    list: [{nick: 'john', age: 21}, {nick: 'tom', age: 32}],
    totalCount: 2
  }
}
```

then reobservable will lookup user model to determine if there was a `fetchSuccess` in the defined reducers. If user model has `fetchSuccess` reducer, it will be called, and then, we would get a new state of the user model.

**flows**

Async flows. Every flow defined in model flows have **four** parameters, and return an `ActionObservable`(An observable which emit action):

```ts
const model = {
  name: 'user',
  // ....
  flows: {
    fetch(flow$, action$, payload$, dependencies) {
      return flow$.pipe(
        mapTo({
          type: 'user/fetchSuccess',
          payload: {}
        })
      )
    }
  }
}
```

It's signature is very similar to the **epic** in [redux-observable](https://redux-observable.js.org/). The difference is the first parameter - `flow$`, it is equivalent to `action$.ofType('model/flow')`.

For example, if we dispatched an action:

```ts
{
  type: 'user/fetch',
  payload: {}
}
```

`fetch` flow return in the user model will be responded.

## Service

Service describe the communication between frontend and backend, in reobservable, you can define multiple services: 

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

In reobservable, service was a dependency injected into model flows, and could be used in frp way: 

```ts
const model = {
  // ....
  flows: {
    fetch(flow$, action$, payload$, dependencies) {
      const { api } = dependencies.services
      return flow$.pipe(
        switchMap(action => {
          const [success$, error$] = api(
            'fetch',
            fetch(action.payload.id)
          )

          return merge(
            success$.pipe(
              // success stream
            ),
            error$.pipe(
              // error stream
            )
          )
        })
      )
    }
  }
}
```