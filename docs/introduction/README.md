# Motivation

I'm a big fan of [dvajs](https://github.com/dvajs/dva), it helps me get rid out of the boilerplate of redux. But I think redux-saga in dva sometimes can be a little bit verbose since I prefer functional reactive programming(frp) than imperative programming. 

I know that reinvent the weel could be a terrible practice, but in dva community, there is no plan to support frp. At last, I decided to create **reobservable**, which, in a world, is a state manager mixined dva architecture and frp features（RxJS + redux-observable. In reobservable, dva architecture wiped out the boilerplate code of redux, RxJS played an elite role in managing asynchronous task.

If you:

- love redux concept, love the predicatable, centralized, debuggable features 
- stuking with the boilerplate code of redux
- want to use RxJS to managing asynchronous task

try reobservable!