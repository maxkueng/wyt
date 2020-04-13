wyt - time-based rate limiter
=============================

[![Build Status](https://travis-ci.org/maxkueng/wyt.svg)](https://travis-ci.org/maxkueng/wyt)
[![Codebeat badge](https://codebeat.co/badges/af8d6a72-3709-4f59-887f-b30f9b0cce55)](https://codebeat.co/projects/github-com-maxkueng-wyt-master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/20ca348079de40a484aee2ebfb4b8fe5)](https://www.codacy.com/app/maxkueng/wyt?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=maxkueng/wyt&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/306ee5df3480babf4d9d/maintainability)](https://codeclimate.com/github/maxkueng/wyt/maintainability)
[![Coverage Status](https://coveralls.io/repos/maxkueng/wyt/badge.svg?branch=master&service=github)](https://coveralls.io/github/maxkueng/wyt?branch=master)

[![NPM](https://nodei.co/npm/wyt.png)](https://nodei.co/npm/wyt/)

**wyt** (pronounced _wait_) is a time-based rate limiter that uses promises.

## Use Cases

 - Limiting calls to APIs that only allow a limited number of requests within a
   certain period. Just call it before your HTTP requests.

 - As an alternative to `setInterval` or `setTimeout` in polling loops. 

   If you want to run run a function every second and you use `setInterval`, your function might run multiple times at the same time if your function occasionally takes more than 1 second to run. This might cause problems.

   Alternatively, if you use `setTimeout(update, 1000)` in a recursive update loop, your update interval will be 1000ms plus the time it takes for your update function to run. You'd have to measure the time and dynamically set the timeout.

   _wyt_ takes care of this for you. It'll make sure that your update function
   runs every second unless the update function takes more than 1s to run, in
   which case it will run it again immediately.

## Features

 - Promise-based API
 - Full test coverage
 - TypeScript support
 - Easy to use

## Installation

```sh
npm install --save wyt
```

## Usage

### Rate-limiting API calls

Just put it in front of your HTTP requests.

```js
import wyt from 'wyt';

// 5 API calls per second
const rateLimit = wyt(5, 1000);

async function getStuff() {
  await rateLimit();
  const response = await fetch('/stuff');
  return response.json();
}

await getStuff();
await getStuff();
await getStuff();
await getStuff();
await getStuff();
await getStuff(); // has to wait unless the previous 5 calls together took longer than 1000ms
```

### Update loops

```js
import wyt from 'wyt';

// Once per second
const rateLimit = wyt(1, 1000);

async function update() {
  await rateLimit();
  await updateMyStuff();
  update();
}

update();
```

If, for example, `updateMyStuff()` takes 900ms that `rateLimit()` will wait only 100ms.

## API

### const rateLimit = wyt(requestsPerInterval: number, interval: number)

 - `requestsPerInterval` _(number)_: The number of requests that can be
   executed within a certain interval.
 - `interval` _(number)_: The interval within which `requestsPerInterval` can
   be executed.

Returns a function `(requests?: number) => Promise<number>` that can be called
before before requesting a rate-limited resource in order to not exceed the
limit.

### const timeWaited = await rateLimit(requests?: number)

 - `requests` _(number, optional, default: 1)_: The number of requests that
   will be used at the same time. For example, if your code fetches two
   resources in parallel. You can not use more requests at the same time as
   `requestsPerInterval`.

Returns a promise `Promise<number>` that will resolve with the time waited as
soon as another request can be made. If more than `requestsPerInterval` are
requested at the same time the promise will reject.

## License

Copyright (c) 2017 - 2020 Max Kueng and contributors

MIT License

