import express from 'express';

const userRouter = express.Router();
import userAuth from '../middleware/userAuth.js';
import userInfo from '../Controllers/userinfo.js';


userRouter.get('/data', userAuth, userInfo);

export default userRouter;