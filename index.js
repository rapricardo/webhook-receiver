
const express = require('express');
const { Queue } = require('bullmq');
const Redis = require('ioredis');

const app = express();
app.use(express.json());

const connection = new Redis({ host: 'redis' });
const queue = new Queue('n8n-jobs', { connection });

const API_KEY = process.env.API_KEY || "tocha123";

app.post('/push', async (req, res) => {
  const auth = req.headers['x-api-key'];
  if (auth !== API_KEY) return res.status(403).send('Forbidden');

  await queue.add('webhook-job', {
    payload: req.body,
    timestamp: new Date().toISOString()
  });

  res.send('Job enfileirado');
});

app.listen(3000, () => {
  console.log("Webhook Receiver rodando na porta 3000");
});
