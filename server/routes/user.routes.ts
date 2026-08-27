import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

export const userRouter = Router();

userRouter.use(authenticate);

userRouter.put('/profile', (req, res, next) => userController.updateProfile(req, res, next));
userRouter.get('/addresses', (req, res, next) => userController.getAddresses(req, res, next));
userRouter.post('/addresses', (req, res, next) => userController.addAddress(req, res, next));
userRouter.delete('/addresses/:id', (req, res, next) => userController.deleteAddress(req, res, next));
