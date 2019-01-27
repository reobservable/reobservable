# Change and Patch Action

## Defination

There are two built-in sync action in reobservable:

- `change` action: change the state declared in action payload
- `patch` action: change the state **partly** declared in action payload.

Correspondingly, every model in reobservable has two default reducer: 

- `change` reducer
- `patch` reducer

Change and patch reducer helps you quickly change the model state **without define any other reducers**.

## Difference

Suppose we defined an user model:

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
  reducers: {
    // ...
  },
  flows: {
    // ...
  }
}
```

Initially, the state of the model is:

```ts
{
  list: [],
  pagination: {
    totolCount: 0,
    page: 0,
    pageSize: 10
  }
}
```

if we dispatched an change action:

```ts
{
  type: 'user/change',
  payload: {
    pagination: { 
      totalCount: 1
    }
  }
}
```

then, new state will be:

```ts
{
  list: [],
  pagination: { 
    totalCount: 1
  }
}
```

As you can see, `page`、 `pageSize` state disappeared since **change** reducer will be overrided the state declared in action payload directly. In this example, **change** reducer overrided the `pagination` state.

Instead, we dispatched an change action:

```ts
{
  type: 'user/patch',
  payload: {
    pagination: { 
      totalCount: 1
    }
  }
}
```

then, new state will be:

```ts
{
  list: [],
  pagination: { 
    totalCount: 1,
    page: 0,
    pageSize: 10
  }
}
``` 

Patch means **patch update** the state, in this example, **patch** reducer will only update the `totalCount` inside the `pagination`.

## Alias

The abuse of change and patch action may cause your redux dev-tools looks unreadable:

```
user/change
user/change
post/change
...
```

To pursue a more clear action flow, we could provide a alias for change and patch action:

```ts
import { Symbols } from '@reobservable/core'

disaptch({
  type: 'user/change',
  [Symbols.ALIAS]: 'user/changePagination',
  payload: {
    pagination: {
      totalCount: 1,
      page: 0,
      pageSize: 10
    }
  }
})
```
