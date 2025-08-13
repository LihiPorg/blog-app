import express from 'express';
import { createUser } from  '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.post('/', createUser);


export default usersRouter;
