const { parentPort, workerData } = require('worker_threads');
const axios = require('axios');

const { url, method, headers, body, requests, concurrency } = workerData;

const performLoadTest = async () => {
  try {
    const results = { totalRequests: 0, success: 0, failure: 0, errors: [], executionTime: 0 };
    const promises = [];

    const startTime = Date.now();  // Start Time
    for (let i = 0; i < requests; i++) {
      promises.push(
        axios({ method, url, headers, data: body })
          .then(() => {
            results.success++;
          })
          .catch((err) => {
            results.failure++;
            results.errors.push(err.message);
          })
          .finally(() => {
            results.totalRequests++;
          })
      );

      // Control concurrency
      if (promises.length >= concurrency) {
        await Promise.all(promises);
        promises.length = 0;
      }
    }

    await Promise.all(promises); // Finish remaining requests

    const endTime = Date.now();  // End Time
    results.executionTime = (endTime - startTime) / 1000;
    return results;
  } catch (err) {
    console.log(`error in worker thread is ${error}`);
    parentPort.postMessage({ error: err.message });
  }
};

performLoadTest()
  .then((results) => parentPort.postMessage(results))
  .catch((error) => parentPort.postMessage({ error: error.message }));
