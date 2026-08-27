import { IWebhookRepository } from '../interfaces/webhook.repository.interface';
import { WebhookLogEntity } from '../../types/index';
import crypto from 'crypto';

const webhookLogs = new Map<string, WebhookLogEntity>();
const processedKeys = new Set<string>();

export class WebhookRepository implements IWebhookRepository {
  async logEvent(log: Omit<WebhookLogEntity, 'id' | 'createdAt'>): Promise<WebhookLogEntity> {
    const id = crypto.randomUUID();
    const entry: WebhookLogEntity = {
      id,
      source: log.source,
      eventType: log.eventType,
      idempotencyKey: log.idempotencyKey,
      payload: log.payload,
      status: log.status,
      error: log.error,
      createdAt: new Date().toISOString(),
    };

    if (log.idempotencyKey) {
      processedKeys.add(log.idempotencyKey);
    }
    webhookLogs.set(id, entry);
    return { ...entry };
  }

  async isIdempotencyKeyProcessed(key: string): Promise<boolean> {
    return processedKeys.has(key);
  }

  async updateStatus(id: string, status: 'processed' | 'failed', error?: string): Promise<void> {
    const entry = webhookLogs.get(id);
    if (entry) {
      entry.status = status;
      if (error) entry.error = error;
      webhookLogs.set(id, entry);
    }
  }
}

export const webhookRepository = new WebhookRepository();
