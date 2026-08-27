import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';

export const contactRouter = Router();

contactRouter.post('/', (req, res, next) => contactController.submit(req, res, next));
