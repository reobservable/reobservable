![logo](./logo.png)

# Reobservable

Redux + rxjs + redux-obersvable best practice. Inspired by dva, rematch.

```typescript
const repo: Model<RepoState> = {
  name: 'repo',
  state: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10
    },
    sort: 'stars',
    isSilentLoading: false,
    query: ''
  },
  flows: {
    fetch(flow$, action$, state$) {
      const stopPolling$ = action$.ofType('repo/stopPolling')
      const params$: Observable<SearchParam> = state$.pipe(
        map(state => {
          const { pagination, sort, query } = state.repo
          return {
            q: `${query ? query + '+' : ''}language:javascript`,
            page: pagination.page,
            per_page: pagination.pageSize,
            sort,
            order: Order.Desc
          }
        }),
        distinctUntilChanged(isEqual)
      )

      return flow$.pipe(
        combineLatest(params$, (action, params) => params),
        switchMap(params => {
          const polling$ = interval(30 * 60 * 1000).pipe(
            takeUntil(stopPolling$),
            startWith(null),
            switchMap(() => from(fetch(params))),
            map(({data}: SearchResp) => ({
              type: 'repo/patch',
              payload: {
                pagination: {
                  total: data.total_count
                },
                list: data.items.map((item: Repo) => ({
                  ...item,
                  displayUpdated: moment(item.updated_at).format('YYYY-MM-DD HH:mm')
                })),
                isSilentLoading: true
              }
            })),
            startWith({
              type: 'repo/change',
              payload: {
                list: [],
                isSilentLoading: false
              }
            })
          )
          return polling$
        })
      )
    }
  }
}

export default repo
```

## Get Started

```
npm i
npm run bootstrap
cd examples
npm run start:github
```
