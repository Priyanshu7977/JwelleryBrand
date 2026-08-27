import { ContactInquiryEntity } from '../../types/index';

export interface IContactRepository {
  create(inquiry: Omit<ContactInquiryEntity, 'id' | 'status' | 'createdAt'>): Promise<ContactInquiryEntity>;
  findAll(options?: { status?: string; limit?: number; offset?: number }): Promise<{ inquiries: ContactInquiryEntity[]; total: number }>;
  findById(id: string): Promise<ContactInquiryEntity | null>;
  updateStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<ContactInquiryEntity | null>;
}
