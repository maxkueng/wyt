/* @flow */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

type State = {
  lastReload: number;
  availableTurns: number;
};

function reload(turnsPerInterval: number, interval: number, state: State): State {
  const throughput = turnsPerInterval / interval;
  const now = Date.now();
  const reloadTime = Math.min(now - state.lastReload, interval);
  const reloadedTurns = reloadTime * throughput;
  const newAvalableTurns = state.availableTurns + reloadedTurns;

  return {
    ...state,
    lastReload: now,
    availableTurns: Math.min(newAvalableTurns, turnsPerInterval),
  };
}

export default function wyt(turnsPerInterval: number, interval: number) {
  const timePerTurn = interval / turnsPerInterval;

  let state: State = {
    lastReload: Date.now(),
    availableTurns: turnsPerInterval,
  };

  async function waitTurn(turns?: number = 1): Promise<number> {
    if (turns > turnsPerInterval) {
      throw new Error('Turns can not be greater than the number of turns per interval');
    }

    state = reload(turnsPerInterval, interval, state);

    const turnsToWait = Math.max(0, turns - state.availableTurns);
    const wait = Math.ceil(turnsToWait * timePerTurn);

    state.availableTurns -= turns;
    await sleep(wait);
    return wait;
  }

  return waitTurn;
}
