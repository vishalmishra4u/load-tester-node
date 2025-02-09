// src/loadTestHandler.js
const { Worker } = require('worker_threads');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jobs = {};

startLoadTest = (req, res) => {
  const { url, method = 'GET', headers = {}, body = {}, requests = 100, concurrency = 10 } = req.body;

  if (!url) {
      return res.status(400).json({ error: 'url is required!' });
  }
  const jobId = uuidv4();

  // Initialize job status
  jobs[jobId] = { status: 'in-progress', results: null, error: null };
  
  res.json({ jobId, status: 'in-progress' });
  const worker = new Worker(path.resolve('src', 'workers', 'loadTestWorker.js'), {
    workerData: { url, method, headers, body, requests, concurrency },
  });

  // Listen for results from the worker
  worker.on('message', (results) => {
    console.log(`Success from thread!`);
    jobs[jobId] = { status: 'completed', results, error: null };
  });

  // Listen for errors from the worker
  worker.on('error', (error) => {
    console.log(`error in thread : ${error}`);
    jobs[jobId] = { status: 'failed', results: null, error: error.message };
  });

  // Listen for worker exit
  worker.on('exit', (code) => {
    if (code !== 0) {
      jobs[jobId] = { status: 'failed', results: null, error: 'Worker exited with an error' };
    }
  });
}

getJobDetails = (req, res) => {
    const { jobId } = req.params;
    const jobDetails = jobs[jobId];
    
    if (!jobDetails) {
        return res.status(400).json({ error: 'Job not found!' });
    }

    // Return job details
    return res.json({ jobId, ...jobDetails });
}

module.exports = {
  startLoadTest,
  getJobDetails,
  jobs,  // Exporting jobs in case you need to check status elsewhere
};
