const { Router } = require('express');
const { startLoadTest, getJobDetails } = require('../loadTestHandler');

const router = Router();

router.post('/load-test', startLoadTest);

router.get('/load-test/:jobId', getJobDetails);
  
module.exports = router;