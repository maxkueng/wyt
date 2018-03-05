import test from 'ava';
import wyt from '../build';

function timePassed(since, accuracy = 100) {
  return Math.round((Date.now() - since) / accuracy) * accuracy;
}

function roughly(value, expected, accuracy = 100) {
  const v = Math.round(value / accuracy) * accuracy;
  const e = Math.round(expected / accuracy) * accuracy;
  return v === e;
}

test('1 per second', async (t) => {
  const start = Date.now();
  const rpi = 1;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const t1 = await waitTurn();
  t.is(0, timePassed(start));
  const t2 = await waitTurn();
  t.is(1000, timePassed(start));
  const t3 = await waitTurn();
  t.is(2000, timePassed(start));
  const t4 = await waitTurn();
  t.is(3000, timePassed(start));
  const t5 = await waitTurn();
  t.is(4000, timePassed(start));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0));
  t.true(roughly(t2, interval / rpi));
  t.true(roughly(t3, interval / rpi));
  t.true(roughly(t4, interval / rpi));
  t.true(roughly(t5, interval / rpi));
});

test('1 per second in parallel', async (t) => {
  const start = Date.now();
  const rpi = 1;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const promises = [
    waitTurn(),
    waitTurn(),
    waitTurn(),
    waitTurn(),
    waitTurn(),
  ];

  const [t1, t2, t3, t4, t5] = await Promise.all(promises);
  t.true(roughly(4000, timePassed(start)));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0 * (interval / rpi)));
  t.true(roughly(t2, 1 * (interval / rpi)));
  t.true(roughly(t3, 2 * (interval / rpi)));
  t.true(roughly(t4, 3 * (interval / rpi)));
  t.true(roughly(t5, 4 * (interval / rpi)));
});

test('2 per second', async (t) => {
  const start = Date.now();
  const rpi = 2;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const t1 = await waitTurn();
  t.is(0, timePassed(start));
  const t2 = await waitTurn();
  t.is(0, timePassed(start));
  const t3 = await waitTurn();
  t.is(500, timePassed(start));
  const t4 = await waitTurn();
  t.is(1000, timePassed(start));
  const t5 = await waitTurn();
  t.is(1500, timePassed(start));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0));
  t.true(roughly(t2, 0));
  t.true(roughly(t3, interval / rpi));
  t.true(roughly(t4, interval / rpi));
  t.true(roughly(t5, interval / rpi));
});

test('2 per second in parallel', async (t) => {
  const start = Date.now();
  const rpi = 2;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const promises = [
    waitTurn(),
    waitTurn(),
    waitTurn(),
    waitTurn(),
    waitTurn(),
  ];

  const [t1, t2, t3, t4, t5] = await Promise.all(promises);
  t.true(roughly(3 * (interval / rpi), timePassed(start)));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0 * (interval / rpi)));
  t.true(roughly(t2, 0 * (interval / rpi)));
  t.true(roughly(t3, 1 * (interval / rpi)));
  t.true(roughly(t4, 2 * (interval / rpi)));
  t.true(roughly(t5, 3 * (interval / rpi)));
});


test('multiple turns per take', async (t) => {
  const start = Date.now();
  const rpi = 2;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const t1 = await waitTurn();
  t.is(0, timePassed(start));
  const t2 = await waitTurn();
  t.is(0, timePassed(start));
  const t3 = await waitTurn(2);
  t.is(1000, timePassed(start));
  const t4 = await waitTurn();
  t.is(1500, timePassed(start));
  const t5 = await waitTurn();
  t.is(2000, timePassed(start));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0));
  t.true(roughly(t2, 0));
  t.true(roughly(t3, 2 * (interval / rpi)));
  t.true(roughly(t4, interval / rpi));
  t.true(roughly(t5, interval / rpi));
});

test('throw if taking more turns per take than turnsperInterval', async (t) => {
  const waitTurn = wyt(2, 10);
  await t.notThrows(waitTurn(2));
  await t.throws(waitTurn(3));
});
