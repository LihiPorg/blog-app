import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger';
import 'express-async-errors';
import notesRouter from './routes/notes';
import errorHandler from './middlewares/errorHandler';
import usersRouter from './routes/users';
import loginRouter from './routes/login';


const app = express();

app.use(cors({
  exposedHeaders: ['X-Total-Count']
}));
app.use(express.json());
app.use(logger); 
app.use('/notes',  notesRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use(errorHandler);


export default app;
