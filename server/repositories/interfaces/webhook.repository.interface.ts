import { WebhookLogEntity } from '../../types/index';

export interface IWebhookRepository {
  logEvent(log: Omit<WebhookLogEntity, 'id' | 'createdAt'>): Promise<WebhookLogEntity>;
  isIdempotencyKeyProcessed(key: string): Promise<boolean>;
  updateStatus(id: string, status: 'processed' | 'failed', error?: string): Promise<void>;
}
