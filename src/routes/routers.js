const { Router } = require('express');
const { startLoadTest } = require('../loadTestHandler');

const router = Router();

router.post('/load-test', (req, res) => {
    const { url, method = 'GET', headers = {}, body = {}, requests = 100, concurrency = 10 } = req.body;

    if(!url){
        return res.status(400).json({ error: 'url is required!' });
    }

    // Call the startLoadTest function from the handler
    const jobId = startLoadTest(url, method, headers, body, requests, concurrency);

    res.json({ "jobId": jobId });
});

router.get('/load-test/:jobId', (req, res) => {
    const { jobId } = req.params;
  
    if (!jobs[jobId]) {
      return res.status(404).json({ error: 'Job not found' });
    }
  
    res.json(jobs[jobId]);
});
  
module.exports = router;