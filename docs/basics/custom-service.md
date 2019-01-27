# Custom Service

In a modern web app, we should considering following parts when we dealing with the communication between the browser and the server:

- How to **konw** if a service failed or not.
- How to **konw** if a service is running or not.
- How to **notify** the user of the service result.

## Define service & notification

**Service** is an important concept in reobservable. You can custom a service through `init` api:

```ts
import { AxiosResponse, AxiosError } from 'axios'
import { ServiceConfig, ServiceFunc, init } from '@reobservable/core'
import { message } from 'antd'

interface IApiResp {
  data: {
    code: number,
    message: string,
    body: any
  }
}

interface ApiService extends ServiceConfig<AxiosResponse<IApiResp>, AxiosError> {}

const apiService: ApiService = {
  isSuccess: (resp) => resp.data.code === 0,
  errorSelector: (resp) => resp.data.message,
  templates: {
    success: (resp) => 'ok!',
    error: (error) => `Error: ${error}`
  }
}

const store  = init({
  models: {
    // modesl
  },
  services: {
    api: apiService
  },
  notification: message
})
```

In the above example, we:
- Use Axios as our **service lib**.
- **Declare how to know a service failed or not by override `isSuccess` property**: If code inside the response is equal to `0`, then reobservble know that service is success.
- **Declare how to select error message when service failed by override `errorSelector` property**. We select `message` property from the response as our error message.
- **Define a notification template by override `templates` property**. It determines what message should be notified to user in reobservbale.

We also defined the **notification** in reobservable with [**Message**](https://ant.design/components/message/) in ant design. It implements the methods defined in the `Notification` interface:

```ts
interface Notification {
  info?: notificate,
  success?: notificate,
  warn?: notificate,
  error?: notificate
}
```

Then, when the service succeed, we will see: 

![](../public/success-notify.png)

and when the service failed with the following response: 

```ts
{
  code: -1,
  message: 'Invalid params'
}
```

we will see:

![](../public/error-notify.png)

> We can also override **nothing** when we custom a service. If we did this, then the service library we used will be in charge of how a service failed or not, and the 

## Use service

Then, we can call service function in a flow's dependencies:

```ts
import { Model, NOTIFICATION_LEVEL } from '@reobservable/core'

const model: Model<IUser, IState> = {
  name: 'user',
  state: {
    list: []
  },
  reducers: {
    fetchSuccess(state, payload) {
      return { ...state, list: payload.list }
    },
    fetchError(state, payload) {
      return { ...state, list: [] }
    }
  },
  flows: {
    fetch(flow$, action$, payload$, dependencies) {
      const { api } = dependencies.services
      
      return flow$.pipe(
        switchMap(action => {
          const [success$, error$] = api(
            'user/fetch',
            service.fetchUser(params),
            {
              level: NOTIFICATION_LEVEL.error,
              templates: {
                error: (error) => 'Fetch users error!'
              }
            }
          )
          return merge(
            success$.pipe(map(resp => ({type: 'user/fetchSuccess', payload: resp}))),
            error$.pipe(mapTo({type: 'user/fetchError'}))
          )
        })
      )
    }
  }
}
```

The signature of the service function is:

```ts
export type ServiceFunc<T, E> = 
  (serviceName: string, service: Promise<T> | Observable<T>, options?: ServiceOptions<T, E>) =>
    [Observable<Result<T, E>>, Observable<Result<T, E>>]
```

It take 3 parameters:

- `serviceName`: the service name, it helps store to know how to pick up the loading or error state of the service.
- `service`: is a Promise or an Observable object that in charge of communicating with the server.
- `options`: the service options. We will describe it next.

then return two observable: `success$` and `error$`.

## Custom options

In a service call, you can custom following service options:

```ts
interface ServiceOptions<T, E> {
  level: NotificationLevel,
  templates?: ServiceTemplates<T, E>,
  retry?: number,
  retryDelay?: number
}
```

- `level`: the service notification level. It determines the timing of a service result notification, three different level supported currently:
  - `NOTIFICATION_LEVEL.silent`: don't notify.
  - `NOTIFICATION_LEVEL.error`: notify user only when service.
  - `NOTIFICATION_LEVEL.all`: notify user whether service is success or not.
- `templates`: the same as the `templates` in service defination, but only act on this service call.
- `retry`: max count of a service should retry. Default is `0`.
- `retryDelay`: Delay ms of a service retry. Default is `0`.

## Loading & error

We can pick up the loading and error state by service name:

```ts
const mapStateToProps = (state: IState) => ({
  isUserFetching: state.loading.services['user/fetch'],
  userFetchError: state.error.services['user/fetch']
})
```

