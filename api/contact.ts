import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';

type ApiRequest = IncomingMessage & { body: any; query: any; headers: Record<string, string | string[]> };
type ApiResponse = ServerResponse & { status: (code: number) => ApiResponse; json: (data: any) => void };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) 
  : null;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, inquiryType, message } = req.body || {};

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name.' });
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Please enter a message of at least 5 characters.' });
    }

    const cleanData = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 100),
      phone: phone ? String(phone).trim().slice(0, 20) : null,
      inquiry_type: inquiryType || 'Jewellery',
      message: message.trim().slice(0, 2000),
      status: 'new',
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert(cleanData)
        .select('id')
        .single();

      if (error) {
        console.warn('[Contact API] Supabase error:', error);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been received by our Mumbai Atelier Concierge.',
    });
  } catch (err: any) {
    console.error('[Contact API] Exception:', err);
    return res.status(500).json({ error: 'Could not submit inquiry. Please try again.' });
  }
}
