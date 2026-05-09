import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use((req, _res, next) => {
  const auth = req.headers.authorization ? '(Has Token)' : '(No Token)';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${auth}`);
  next();
});

app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api', routes);
app.use(errorHandler);
