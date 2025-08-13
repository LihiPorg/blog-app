import express from 'express';
import {  login } from  '../controllers/usersController';

const loginRouter = express.Router();

loginRouter.post('/', login);


export default loginRouter;
