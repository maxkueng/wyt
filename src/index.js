/* @flow */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export default function wyt(turnsPerInterval: number, interval: number) {
  const throughput = turnsPerInterval / interval;
  const timePerTurn = interval / turnsPerInterval;

  type State = {
    lastReload: number;
    availableTurns: number;
  };

  const state: State = {
    lastReload: Date.now(),
    availableTurns: turnsPerInterval,
  };

  function reload() {
    const now = Date.now();
    const timeDelta = now - state.lastReload;
    const reloadTime = Math.min(timeDelta, interval);
    const reloadedTurns = reloadTime * throughput;
    const newAvalableTurns = state.availableTurns + reloadedTurns;

    state.lastReload = now;
    state.availableTurns = Math.min(newAvalableTurns, turnsPerInterval);
  }

  async function waitTurn(turns?: number = 1): Promise<void> {
    if (turns > turnsPerInterval) {
      throw new Error('Turns can not be greater than the number of turns per interval');
    }

    reload();

    const turnsToWait = Math.max(0, turns - state.availableTurns);
    const wait = Math.ceil(turnsToWait * timePerTurn);

    await sleep(wait);
    state.availableTurns -= turns;
  }

  return waitTurn;
}
