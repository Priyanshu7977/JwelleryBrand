import { OrderEntity } from '../types/index';
import { formatOrderDateIST, formatOrderTimeIST } from './tracking.service';

export interface InvoiceMetadata {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  total: number;
  items: Array<{ title: string; quantity: number; price: number; total: number }>;
}

export class PdfService {
  generateInvoiceData(order: OrderEntity): InvoiceMetadata {
    return {
      invoiceNumber: `INV-${order.orderNumber.replace('ORD-', '')}`,
      orderNumber: order.orderNumber,
      date: formatOrderDateIST(order.createdAt),
      time: formatOrderTimeIST(order.createdAt),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      shippingAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
      total: order.total,
      items: order.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        total: i.lineTotal,
      })),
    };
  }

  // Returns formatted HTML / SVG printable document conforming to ISO A4 (210x297mm)
  generateInvoiceHtml(order: OrderEntity): string {
    const data = this.generateInvoiceData(order);
    const rows = data.items
      .map(
        (i) => `
      <tr style="border-bottom: 1px solid #EFE0C9;">
        <td style="padding: 12px 8px; font-weight: 600;">${i.title}</td>
        <td style="padding: 12px 8px; text-align: center;">${i.quantity}</td>
        <td style="padding: 12px 8px; text-align: right;">₹${i.price}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold;">₹${i.total}</td>
      </tr>`
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice ${data.invoiceNumber}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm; }
    body { font-family: 'Montserrat', sans-serif; color: #1E1A17; background: #FAF7F0; margin: 0; padding: 20px; font-size: 13px; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #FFFFFF; padding: 40px; border-radius: 16px; border: 1px solid #D8C39A; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #A37F3B; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
    .logo span { font-style: italic; color: #A37F3B; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #786E65; border-bottom: 2px solid #D8C39A; }
    .total-bar { margin-top: 24px; text-align: right; font-size: 18px; font-weight: bold; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #786E65; border-top: 1px solid #EFE0C9; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">CEL<span>estia</span></div>
        <div style="font-size: 11px; color: #786E65; margin-top: 4px;">Mumbai Atelier Sanctuary • 18K Anti-Tarnish</div>
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; color: #A37F3B;">TAX INVOICE</h2>
        <div style="font-size: 12px; margin-top: 4px;">Invoice: <strong>${data.invoiceNumber}</strong></div>
        <div style="font-size: 12px;">Date: ${data.date} (${data.time})</div>
      </div>
    </div>

    <div style="margin-top: 24px; display: flex; justify-content: space-between;">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; color: #A37F3B; font-weight: bold;">Billed & Shipped To</div>
        <div style="font-size: 14px; font-weight: bold; margin-top: 4px;">${data.customerName}</div>
        <div style="color: #423C36; max-width: 280px; margin-top: 2px;">${data.shippingAddress}</div>
        <div style="color: #786E65; margin-top: 2px;">${data.customerEmail}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; text-transform: uppercase; color: #A37F3B; font-weight: bold;">Fulfillment</div>
        <div style="margin-top: 4px;">Tracking: <strong>${order.trackingNumber}</strong></div>
        <div>Carrier: ${order.carrier}</div>
        <div>Status: <span style="color: #065F46; font-weight: bold;">${order.financialStatus.toUpperCase()}</span></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="total-bar">
      Grand Total Paid: <span style="color: #A37F3B;">₹${data.total}</span>
    </div>

    <div class="footer">
      Celestia Amor Fine Jewellery Atelier • Bandra West, Mumbai - 400050<br/>
      100% Anti-Tarnish PVD Dual Dip Guarantee • Waterproof Daily Wear
    </div>
  </div>
</body>
</html>`;
  }
}

export const pdfService = new PdfService();
