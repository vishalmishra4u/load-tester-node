// src/loadTestHandler.js
const { Worker } = require('worker_threads');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jobs = {};

function startLoadTest(url, method, headers, body, requests, concurrency) {
  const jobId = uuidv4();

  // Initialize job status
  jobs[jobId] = { status: 'in-progress', results: null, error: null };

  const worker = new Worker(path.resolve('src', 'workers', 'loadTestWorker.js'), {
    workerData: { url, method, headers, body, requests, concurrency },
  });

  // Listen for results from the worker
  worker.on('message', (results) => {
    jobs[jobId] = { status: 'completed', results, error: null };
  });

  // Listen for errors from the worker
  worker.on('error', (error) => {
    jobs[jobId] = { status: 'failed', results: null, error: error.message };
  });

  // Listen for worker exit
  worker.on('exit', (code) => {
    if (code !== 0) {
      jobs[jobId] = { status: 'failed', results: null, error: 'Worker exited with an error' };
    }
  });

  return jobId;
}

module.exports = {
  startLoadTest,
  jobs,  // Exporting jobs in case you need to check status elsewhere
};
