# Reobservable

Redux + rxjs + redux-obersvable best practice. Inspired by dva, rematch.

https://reobservable.github.io/reobservable/

---------------

[![Coverage Status](https://coveralls.io/repos/github/reobservable/reobservable/badge.svg?branch=master)](https://coveralls.io/github/reobservable/reobservable?branch=master)
[![Build Status](https://travis-ci.com/reobservable/reobservable.svg?branch=master)](https://travis-ci.com/reobservable/reobservable)

## Motivation

I'm a big fan of [dvajs](https://github.com/dvas/dva), it helps me get rid out of the boilerplate of redux. But I think redux-saga in dva sometimes can be a little bit verbose since I prefer functional reactive programming(frp) than imperative programming. 

I know that reinvent the weel could be a terrible practice, but in dva community, there is no plan to support frp. At last, I decided to create **reobservable**, which, in a world, is a state manager mixined dva architecture and frp features（RxJS + redux-observable. In reobservable, dva architecture wiped out the boilerplate code of redux, RxJS played an elite role in managing asynchronous task.

If you:

- love redux concept, love the predicatable, centralized, debuggable features 
- stuking with the boilerplate code of redux
- want to use RxJS to managing asynchronous task

try reobservable!

## Installation

```
npm install @reobservable/core --save
```

## Examples

See [reobservble examples](https://github.com/reobservable/reobservable/tree/master/examples)
