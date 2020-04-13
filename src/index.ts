function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

type State = {
  lastReload: number;
  availableRequests: number;
};

function reload(requestsPerInterval: number, interval: number, state: State): State {
  const throughput = requestsPerInterval / interval;
  const now = Date.now();
  const reloadTime = Math.min(now - state.lastReload, interval);
  const reloadedRequests = reloadTime * throughput;
  const newAvalableRequests = state.availableRequests + reloadedRequests;

  return {
    ...state,
    lastReload: now,
    availableRequests: Math.min(newAvalableRequests, requestsPerInterval),
  };
}

export = function wyt(
  requestsPerInterval: number,
  interval: number,
): (requests?: number) => Promise<number> {
  const timePerRequest = interval / requestsPerInterval;

  let state: State = {
    lastReload: Date.now(),
    availableRequests: requestsPerInterval,
  };

  async function waitRequest(requests = 1): Promise<number> {
    if (requests > requestsPerInterval) {
      throw new Error('Requests can not be greater than the number of requests per interval');
    }

    state = reload(requestsPerInterval, interval, state);

    const requestsToWait = Math.max(0, requests - state.availableRequests);
    const wait = Math.ceil(requestsToWait * timePerRequest);

    state.availableRequests -= requests;
    await sleep(wait);
    return wait;
  }

  return waitRequest;
}
