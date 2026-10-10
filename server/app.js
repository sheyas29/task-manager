import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './router/taskRouter.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/tasks', routes);
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid task ID' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Server error' });
});
export default app;
