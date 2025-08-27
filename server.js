
// This file should be named server.cjs for CommonJS compatibility
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/job1', (req, res) => {
  res.json({
    job_status: 'success',
    record_count: 123,
    trigger_time: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
