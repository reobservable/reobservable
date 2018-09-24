# Model 

Just like dva, things interact with state are placed in a model. Previously, in plain reudx, we should manage our actions, action types and reducers in different places. But in dva, rematch or reobervable, boilerplate code was moved into the framework, we can focus on state management in a single model.

```js
const model = {
  name: 'user',
  state: {
    list: [],
    total: 0,
    searchKey: '',
    error: null
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
      return { ...state, error: payload.error }
    }
  },
  flows: {
    fetch(flow$, action$, state$) {
      return flow$.pipe(
        withLatestFrom(state$, (action, state) => {
          return {
            searchKey: state.searchKey
          }
        }),
        switchMap(params => {
          return api.fetchUser(params).pipe(
            map(resp => ({
              type: 'user/fetchSuccess',
              payload: {
                list: resp.items,
                total: resp.totalCount
              }
            }))
            catchError(error => of({
            	type: 'user/fetchError',
              payload: { error }
            }))
          )
        })
      )
    }
  }
}
```

As shown above, a model is composed of the following parts:

- **name**

  The name of the model which should be universally **unique**. It determines how to locate then state, action and reducer of the model.

- **state**

  The initial state of the model.

- **reduers**

  The key of any reducer in model's reducers is its **name**. For example, as shown above, we defined a reducer named `fetch`, then if the application dispatches a an action with type `user/fetchSuccess`, the reducer will be called to reduce the next state.

  In addition, if we defined a reducer named `bar/fetchSuccess` in this model, it will be responsible for the `bar/fetchSuccess` action.

  Now, you'd like to know that **reducer is used to interact with synchronous action**.

- **flows**

  Just like reducers, every flow in flows is assiociated with an action by its name. Compare with reducer, flow is designed to **interact with asynchronous action**.

  A flow is like an epic in redux-observable, the concept of them is same, but the  function signature is a little difference. The first argument of a flow is not `action$`, but a `flow$` which means `action$.ofType(model/flow)`.

  As shown above, we defiened a flow named `fetch`, when the application dispatches an `user/fetch` action,  `flow$` in `fetch` will emmit value.
