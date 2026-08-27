import { Request, Response, NextFunction } from 'express';
import { contactRepository } from '../repositories/postgres/contact.repository';
import { AppError } from '../middleware/errorHandler.middleware';

export class ContactController {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, inquiryType, message } = req.body;

      if (!name || name.trim().length < 2) {
        throw new AppError('Name must be at least 2 characters.', 400);
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new AppError('A valid email address is required.', 400);
      }
      if (!message || message.trim().length < 5) {
        throw new AppError('Message must be at least 5 characters.', 400);
      }

      const inquiry = await contactRepository.create({
        name,
        email,
        phone,
        topic: inquiryType || 'General Inquiry',
        message,
      });

      res.status(201).json({
        success: true,
        id: inquiry.id,
        message: 'Your inquiry has been accepted into our Mumbai atelier concierge queue.',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const contactController = new ContactController();
