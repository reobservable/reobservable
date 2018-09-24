# Motivation

I'm a big fan of [dvajs](https://github.com/dvajs/dva), its architecture helps me get rid out of the boilerplate of redux. But I think saga in dva sometimes may be a little bit verbose since I'm prefer functional reactive programming(frp) than imperative programming. 

I kown reinvent the weel could be a terrible practice, but there was no plan that dva and dva plugins provide any support for frp. At last I decided to create **reobservable**, which, in a world, is a state manager mixined dva architecture and frp concept(rxjs + redux-observable).