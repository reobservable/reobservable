## Feature

- [x] create model's reducers
- [x] create model's selectors
- [x] create model's flows
- [x] support flow loading
- [x] support error loading
- [x] support custom service & server creator
- [x] support service loading
- [x] support service error
- [x] support custom redux config
- [x] support action type alias
- [ ] support global `state$` observing
- [ ] hooks

```ts
import { useEffect } from 'react'
import { useModel, useLoading, useError } from '@reobservable/hooks';

function Counter(props) {
  const { state, flows } = useModel('user')
  const loading = useLoading()
  const error = useError()

  useEffect(() => {
    flows.fetch()
  })

  return (
    {
      loading.services['user/fetch']
        ? (<Spin />)
        : (
          <div>
            <div className='avatar'><img src={user.avatar} /></div>
            <div className='username'>{state.username}</div>
          </div>
        )
    }
  )
}
```

## ecosystem

- [ ] command line tools
- [ ] vscode plugin
  - [ ] snippet
- [x] github demo

