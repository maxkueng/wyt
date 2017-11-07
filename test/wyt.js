import test from 'ava';
import wyt from '../build';

function timePassed(since) {
  return Math.round(((Date.now() - since) / 1000) * 10) / 10;
}

test('1 per second', async (t) => {
  const start = Date.now();
  const waitTurn = wyt(1, 1000);

  await waitTurn();
  t.is(0, timePassed(start));
  await waitTurn();
  t.is(1, timePassed(start));
  await waitTurn();
  t.is(2, timePassed(start));
  await waitTurn();
  t.is(3, timePassed(start));
  await waitTurn();
  t.is(4, timePassed(start));
});

test('2 per second', async (t) => {
  const start = Date.now();
  const waitTurn = wyt(2, 1000);

  await waitTurn();
  t.is(0, timePassed(start));
  await waitTurn();
  t.is(0, timePassed(start));
  await waitTurn();
  t.is(0.5, timePassed(start));
  await waitTurn();
  t.is(1, timePassed(start));
  await waitTurn();
  t.is(1.5, timePassed(start));
});


test('multiple turns per take', async (t) => {
  const start = Date.now();
  const waitTurn = wyt(2, 1000);

  await waitTurn();
  t.is(0, timePassed(start));
  await waitTurn();
  t.is(0, timePassed(start));
  await waitTurn(2);
  t.is(1, timePassed(start));
  await waitTurn();
  t.is(1.5, timePassed(start));
  await waitTurn();
  t.is(2, timePassed(start));
});

test('throw if taking more turns per take than turnsperInterval', async (t) => {
  const waitTurn = wyt(2, 10);
  await t.notThrows(waitTurn(2));
  await t.throws(waitTurn(3));
});
