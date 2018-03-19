import test from 'ava';
import wyt from '../build';

function createTimer() {
  const start = Date.now();
  return () => Date.now() - start;
}

function roughly(value, expected, accuracy = 100) {
  const v = Math.round(value / accuracy) * accuracy;
  const e = Math.round(expected / accuracy) * accuracy;
  return Math.abs(v - e) < accuracy;
}

test('1 per second', async (t) => {
  const timer = createTimer();
  const rpi = 1;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const t1 = await waitTurn();
  t.true(roughly(0, timer()));
  const t2 = await waitTurn();
  t.true(roughly(1000, timer()));
  const t3 = await waitTurn();
  t.true(roughly(2000, timer()));
  const t4 = await waitTurn();
  t.true(roughly(3000, timer()));
  const t5 = await waitTurn();
  t.true(roughly(4000, timer()));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0));
  t.true(roughly(t2, interval / rpi));
  t.true(roughly(t3, interval / rpi));
  t.true(roughly(t4, interval / rpi));
  t.true(roughly(t5, interval / rpi));
});

test('1 per second in parallel', async (t) => {
  const timer = createTimer();
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
  t.true(roughly(4000, timer()));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0 * (interval / rpi)));
  t.true(roughly(t2, 1 * (interval / rpi)));
  t.true(roughly(t3, 2 * (interval / rpi)));
  t.true(roughly(t4, 3 * (interval / rpi)));
  t.true(roughly(t5, 4 * (interval / rpi)));
});

test('2 per second', async (t) => {
  const timer = createTimer();
  const rpi = 2;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const t1 = await waitTurn();
  t.true(roughly(0, timer()));
  const t2 = await waitTurn();
  t.true(roughly(0, timer()));
  const t3 = await waitTurn();
  t.true(roughly(500, timer()));
  const t4 = await waitTurn();
  t.true(roughly(1000, timer()));
  const t5 = await waitTurn();
  t.true(roughly(1500, timer()));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0));
  t.true(roughly(t2, 0));
  t.true(roughly(t3, interval / rpi));
  t.true(roughly(t4, interval / rpi));
  t.true(roughly(t5, interval / rpi));
});

test('2 per second in parallel', async (t) => {
  const timer = createTimer();
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
  t.true(roughly(3 * (interval / rpi), timer()));

  t.log([t1, t2, t3, t4, t5]);

  t.true(roughly(t1, 0 * (interval / rpi)));
  t.true(roughly(t2, 0 * (interval / rpi)));
  t.true(roughly(t3, 1 * (interval / rpi)));
  t.true(roughly(t4, 2 * (interval / rpi)));
  t.true(roughly(t5, 3 * (interval / rpi)));
});


test('multiple turns per take', async (t) => {
  const timer = createTimer();
  const rpi = 2;
  const interval = 1000;
  const waitTurn = wyt(rpi, interval);

  const t1 = await waitTurn();
  t.true(roughly(0, timer()));
  const t2 = await waitTurn();
  t.true(roughly(0, timer()));
  const t3 = await waitTurn(2);
  t.true(roughly(1000, timer()));
  const t4 = await waitTurn();
  t.true(roughly(1500, timer()));
  const t5 = await waitTurn();
  t.true(roughly(2000, timer()));

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
