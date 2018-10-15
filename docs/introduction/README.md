# Motivation

I'm a big fan of [dvajs](https://github.com/dvajs/dva), its architecture helps me get rid out of the boilerplate of redux. But I think saga in dva sometimes may be a little bit verbose since I prefer functional reactive programming(frp) than imperative programming. 

I know that reinvent the weel could be a terrible practice, but there is currently no plan that to support frp in dva community. At last, I decided to create **reobservable**, which, in a world, is a state manager based on dva architecture and provide some support(RxJS + redux-observable) for frp. Dva architecture wiped out the boilerplate code of redux, and RxJS + redux-observable provide a better asynchronous task management.

If you are using redux, you are stucking with the boilerplate code of redux, and you are a fan of frp like me, reobservable may be a good choice.