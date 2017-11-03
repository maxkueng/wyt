wyt - wait your turn
====================

[![Build Status](https://travis-ci.org/maxkueng/wyt.svg)](https://travis-ci.org/maxkueng/wyt)
[![Codebeat badge](https://codebeat.co/badges/af8d6a72-3709-4f59-887f-b30f9b0cce55)](https://codebeat.co/projects/github-com-maxkueng-wyt-master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/20ca348079de40a484aee2ebfb4b8fe5)](https://www.codacy.com/app/maxkueng/wyt?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=maxkueng/wyt&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/306ee5df3480babf4d9d/maintainability)](https://codeclimate.com/github/maxkueng/wyt/maintainability)
[![Coverage Status](https://coveralls.io/repos/maxkueng/wyt/badge.svg?branch=master&service=github)](https://coveralls.io/github/maxkueng/wyt?branch=master)

**wyt** is a time-based rate limiter that uses promises.

## Use Cases

 - Limiting calls to APIs that only allow a limited number of calls within a
   certain period.

## Features

 - Promise-based API
 - Full test coverage
 - Flow typed (published Flow definitions coming soon)

## Installation

```sh
npm install wyt
```

## Usage

```js
import wyt from 'wyt';

// 5 api calls per second
const waitTurn = wyt(5, 1000);

async function apiCall() {
  await waitTurn();
  // so stuff
}
```

## API

### const waitTurn = wyt(turnsPerInterval: number, interval: number)

 - `turnsPerInterval` _(number)_: The number of turns that can be taken within
   a certain interval.
 - `interval` _(number)_: The interval within which `turnsPerInterval` can be executed.

Returns a function that can be called to "take a turn".

### await waitTurn(turns?: number)

 - `turns` _(number, optional, default: 1)_: The number of turnsthat will be
   taken at the same time. You can not await more turns at the same time as
   `turnsPerInterval`.

Returns a promise that will resolve as soon as another turn can be taken. If
more than `turnsPerInterval` are requested at the same time the promise will
reject.

## Example

Alice, Bob, Cindy, Derek, Elizabeth, Fred, Gwendolyn, Herbert and Iris want to
buy tickets for a theater. They coincidentally queue up at the ticket desk in
alphabetical order.  
Derek and Elizabeth are friends and buy their tickets together.  
Gwendolyn, Herbert and Iris are a group and want to buy their tickets together
too.

Barbara, who works at the ticket desk, can handle 2 customers at the same time
in only 1 second, and she can handle a single customer in only 0.5 seconds. But
if she has to handle 3 customers at the same time it's too stressful for her
and she rejects them.

```js
import wyt from 'wyt';

/**
 * A helper function that returns the seconds that have passed.
 */
function timePassed() {
  this.start = this.start || Date.now();
  now = now || Date.now();
  return Math.round(((Date.now() - this.start) / 1000) * 10) / 10;
}

/**
 * The ticket desk can handle 2 customers per 1000 milliseconds.
 */
const waitTurn = wyt(2, 1000);

await waitTurn();
console.log(`Alice waited ${timePassed()} seconds`);
// > Alice waited 0 seconds

await waitTurn();
console.log(`Bob waited ${timePassed()} seconds`);
// > Bob waited 0 seconds

/**
 * Alice and Bob got their tickets immediately because Barbara was prepared and
 * nobody was waiting at the ticket desk before.
 */

await waitTurn();
console.log(`Cindy waited ${timePassed()} seconds`);
// Cindy waited 0.5 seconds

/**
 * Cindy got her ticket afer half a second because Barbara can handle a single
 * customer in 1000 / 2 milliseconds.
 */

/**
 * Derek and Elizabeth go together and take 2 turns at the same time.
 */
await waitTurn(2);
console.log(`Derek and Elizabeth waited ${timePassed()} seconds`);
// Derek and Elisabeth waited 1.5 seconds

/**
 * Derek and Elizabeth had to wait a full second after Cindy because it takes
 * Barbara a whole second to process two customers.
 */

await waitTurn();
console.log(`Fred waited ${timePassed()} seconds`);
// Fred waited 2 seconds

/**
 * Fred waited a total of two seconds, but only 0.5 seconds after Derek and
 * Elizabeth.
 */

/**
 * Gwendolyn, Herbert and Iris want to buy tickets at the same time.
 */
await waitTurn(3);
console.log(`Gwendolyn waited ${timePassed()} seconds`);
// UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id:2):
//   Error: Turns can not be greater than the number of turns per interval

/**
 * Barbara can only handle 2 customers per 1000ms so she rejected the whole
 * group by throwing an exception.
 * In order to handle the group of three she would have to be able to handle 3
 * customers per 1500ms instead.
 */
 
 ```

## License

Copyright (c) 2017 Max Kueng

MIT License
