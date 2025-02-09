const { Router } = require('express');
const { v4: uuidv4 } = require('uuidv4');
const { Worker } = require('worker_threads');
const path = require('path');

const router = Router();

router.post('/load-test', (req, res) => {
    const { url, method = 'GET', headers = {}, body = {}, requests = 100, concurrency = 10 } = req.body;

    if(!url){
        return res.status(400).json({ error: 'url is required!' });
    }

    const jobId = uuidv4();
    jobs[jobId] = { status: 'in-progress', results: null, error: null };

    const worker = new Worker(path.resolve('src', 'workers', 'loadTestWorker.js'), {
        workerData: { url, method, headers, body, requests, concurrency },
    });

    worker.on('message', (results) => {
        jobs[jobId] = { status: 'completed', results: null, error: null };
    });

    worker.on('error', (error) => {
        jobs[jobId] = { status: 'failed', results: null, error: error.message };
    });
  
    worker.on('exit', (code) => {
      if (code !== 0) {
        jobs[jobId] = { status: 'failed', results: null, error: 'Worker exited with an error' };
      }
    });
  
    res.json({ jobId });
});

router.get('/load-test/:jobId', (req, res) => {
    const { jobId } = req.params;
  
    if (!jobs[jobId]) {
      return res.status(404).json({ error: 'Job not found' });
    }
  
    res.json(jobs[jobId]);
});
  
module.exports = router;