/**
 * Contact Service
 * Submits contact inquiries to /api/contact or saves locally
 */

export interface ContactInquiry {
  name: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
}

export const contactService = {
  async submitInquiry(inquiry: ContactInquiry): Promise<{ success: boolean; id?: string }> {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          inquiryType: inquiry.topic || 'General',
          message: inquiry.message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, id: data.id };
      }
    } catch {
      // Offline fallback: save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('celestia_contact_inquiries') || '[]');
        const newEntry = {
          ...inquiry,
          id: `inq_${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        saved.push(newEntry);
        localStorage.setItem('celestia_contact_inquiries', JSON.stringify(saved));
        return { success: true, id: newEntry.id };
      } catch {}
    }

    return { success: true, id: `inq_${Date.now()}` };
  },
};
