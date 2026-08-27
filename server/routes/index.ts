import { Router } from 'express';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { productRouter } from './product.routes';
import { cartRouter } from './cart.routes';
import { wishlistRouter } from './wishlist.routes';
import { orderRouter } from './order.routes';
import { trackingRouter } from './tracking.routes';
import { contactRouter } from './contact.routes';
import { webhookRouter } from './webhook.routes';
import { adminRouter } from './admin.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/wishlist', wishlistRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/tracking', trackingRouter);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/webhooks', webhookRouter);
apiRouter.use('/admin', adminRouter);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    atelier: 'Celestia Luxury Mumbai',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});
