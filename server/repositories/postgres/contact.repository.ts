import { IContactRepository } from '../interfaces/contact.repository.interface';
import { ContactInquiryEntity } from '../../types/index';
import crypto from 'crypto';

const inquiriesStore = new Map<string, ContactInquiryEntity>();

export class ContactRepository implements IContactRepository {
  async create(inquiry: Omit<ContactInquiryEntity, 'id' | 'status' | 'createdAt'>): Promise<ContactInquiryEntity> {
    const id = crypto.randomUUID();
    const entry: ContactInquiryEntity = {
      id,
      name: inquiry.name.trim(),
      email: inquiry.email.trim().toLowerCase(),
      phone: inquiry.phone?.trim(),
      topic: inquiry.topic || 'General Inquiry',
      message: inquiry.message.trim(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    inquiriesStore.set(id, entry);
    return { ...entry };
  }

  async findAll(options?: { status?: string; limit?: number; offset?: number }): Promise<{ inquiries: ContactInquiryEntity[]; total: number }> {
    let list = Array.from(inquiriesStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (options?.status) {
      list = list.filter((i) => i.status === options.status);
    }

    const total = list.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;

    return {
      inquiries: list.slice(offset, offset + limit),
      total,
    };
  }

  async findById(id: string): Promise<ContactInquiryEntity | null> {
    const i = inquiriesStore.get(id);
    return i ? { ...i } : null;
  }

  async updateStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<ContactInquiryEntity | null> {
    const i = inquiriesStore.get(id);
    if (!i) return null;
    i.status = status;
    inquiriesStore.set(id, i);
    return { ...i };
  }
}

export const contactRepository = new ContactRepository();
