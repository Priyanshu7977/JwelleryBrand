import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';
import { formatOrderDateIST, formatOrderTimeIST } from '../utils/dateIST';

/**
 * Generates an official, luxury A4 PDF Invoice / Order Confirmation document
 * matching Celestia Atelier brand aesthetics (Obsidian, Champagne Gold, Ivory).
 */
export function generateOrderInvoicePDF(order: OrderMetadata): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const orderDate = new Date(order.createdAt);
  const formattedDate = formatOrderDateIST(orderDate);
  const formattedTime = formatOrderTimeIST(orderDate);

  // 1. Luxury Header Bar (Obsidian Background)
  doc.setFillColor(24, 20, 17); // Obsidian #181411
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Gold Accent Strip
  doc.setFillColor(216, 195, 154); // Gold #D8C39A
  doc.rect(0, 40, pageWidth, 1.5, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(250, 247, 240); // Pearl Ivory #FAF7F0
  doc.text('C E L E S T I A', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(216, 195, 154);
  doc.text('FINE JEWELLERY & BESPOKE ATELIER • MUMBAI', 15, 25);
  doc.setTextColor(200, 200, 200);
  doc.text('Redefined for All.', 15, 30);

  // Invoice / Confirmation Label on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(250, 247, 240);
  doc.text('TAX INVOICE & ORDER CONFIRMATION', pageWidth - 15, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(216, 195, 154);
  doc.text(`Order #${order.orderNumber}`, pageWidth - 15, 25, { align: 'right' });
  doc.setTextColor(200, 200, 200);
  doc.text(`${formattedDate} • ${formattedTime}`, pageWidth - 15, 30, { align: 'right' });

  // 2. Customer & Atelier Meta Block
  let y = 50;

  // Left Column: Customer & Delivery Destination
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 20, 17);
  doc.text('BILLED & SHIPPED TO:', 15, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(60, 50, 45);
  doc.text(order.customer.name, 15, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 80, 75);
  
  // Wrap address neatly
  const splitAddress = doc.splitTextToSize(order.customer.address, 85);
  doc.text(splitAddress, 15, y + 11);
  
  const addressHeight = splitAddress.length * 4.5;
  doc.text(`Phone: ${order.customer.phone}`, 15, y + 11 + addressHeight);
  doc.text(`Email: ${order.customer.email}`, 15, y + 16 + addressHeight);

  // Right Column: Atelier Details & Fulfillment Summary
  const rightX = 115;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 20, 17);
  doc.text('FULFILLMENT & PAYMENT SUMMARY:', rightX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 50, 45);
  doc.text(`Payment Method: `, rightX, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.paymentMethod} (${order.financialStatus.toUpperCase()})`, rightX + 30, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.text(`Shipping Method: `, rightX, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.shippingMethod}`, rightX + 30, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.text(`Estimated Delivery: `, rightX, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 120, 80); // Emerald
  doc.text(`${order.estimatedDelivery?.estimatedDateFormatted || '2-3 Business Days'}`, rightX + 30, y + 16);

  if (order.trackingNumber) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 50, 45);
    doc.text(`Tracking AWB: `, rightX, y + 21);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(122, 91, 40); // Gold
    doc.text(`${order.trackingNumber} (${order.carrier})`, rightX + 30, y + 21);
  }

  // 3. Itemized Products Table
  const tableStartY = Math.max(y + 24 + addressHeight, 82);

  const tableBody = order.items.map((item, idx) => {
    let description = item.title;
    if (item.boxType) description += `\nPackaging: ${item.boxType}`;
    if (item.customNotes) description += `\nCustom Note: "${item.customNotes}"`;

    return [
      idx + 1,
      description,
      item.quantity,
      `INR ${item.price.toLocaleString('en-IN')}`,
      `INR ${(item.price * item.quantity).toLocaleString('en-IN')}`,
    ];
  });

  autoTable(doc, {
    startY: tableStartY,
    head: [['#', 'Item Description & Bespoke Customization', 'Qty', 'Unit Price', 'Total Amount']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [24, 20, 17],
      textColor: [250, 247, 240],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
    },
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 4,
      textColor: [30, 26, 23],
      lineColor: [230, 220, 200],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [251, 249, 245],
    },
    margin: { left: 15, right: 15 },
  });

  // 4. Financial Calculations Box
  const finalY = (doc as any).lastAutoTable.finalY + 8;
  const summaryX = pageWidth - 80;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 70, 65);

  doc.text('Subtotal:', summaryX, finalY);
  doc.text(`INR ${order.subtotal.toLocaleString('en-IN')}`, pageWidth - 15, finalY, { align: 'right' });

  doc.text('Shipping & Handling:', summaryX, finalY + 5);
  doc.text(
    order.shippingCost === 0 ? 'FREE (INR 0)' : `INR ${order.shippingCost.toLocaleString('en-IN')}`,
    pageWidth - 15,
    finalY + 5,
    { align: 'right' }
  );

  const discount = order.subtotal + order.shippingCost - order.total;
  if (discount > 0) {
    doc.setTextColor(16, 120, 80);
    doc.text('Special Instant Discount:', summaryX, finalY + 10);
    doc.text(`- INR ${discount.toLocaleString('en-IN')}`, pageWidth - 15, finalY + 10, { align: 'right' });
  }

  // Grand Total Box
  const totalBoxY = finalY + (discount > 0 ? 15 : 10);
  doc.setFillColor(243, 235, 219); // Champagne #F3EBDB
  doc.roundedRect(summaryX - 5, totalBoxY - 4, 70, 12, 2, 2, 'F');
  doc.setDrawColor(216, 195, 154);
  doc.roundedRect(summaryX - 5, totalBoxY - 4, 70, 12, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(24, 20, 17);
  doc.text('Grand Total:', summaryX, totalBoxY + 3.5);
  doc.setTextColor(122, 91, 40);
  doc.text(`INR ${order.total.toLocaleString('en-IN')}`, pageWidth - 15, totalBoxY + 3.5, { align: 'right' });

  // 5. Unboxing Guarantee & Warranty Badge
  const badgeY = Math.max(totalBoxY + 22, pageHeight - 45);
  
  doc.setFillColor(250, 247, 240);
  doc.setDrawColor(216, 195, 154);
  doc.roundedRect(15, badgeY, pageWidth - 30, 20, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(122, 91, 40);
  doc.text('CELESTIA ATELIER AUTHENTICITY & 100% ANTI-TARNISH SEAL', 20, badgeY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 80, 75);
  doc.text(
    'Every piece is individually handcrafted in Mumbai with hypoallergenic, anti-tarnish stainless steel & 18K gold vermeil. Please record an uncut unboxing video upon arrival for our 7-day hassle-free replacement warranty.',
    20,
    badgeY + 11,
    { maxWidth: pageWidth - 40 }
  );

  // 6. Footer Information
  doc.setFontSize(7.5);
  doc.setTextColor(130, 120, 115);
  doc.text(
    `Questions or inquiries? WhatsApp Concierge: +91 7718825792 | Email: ${BRAND_INFO.email} | Mumbai Atelier 400050`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc;
}

/**
 * Triggers instant download of the PDF invoice in the browser
 */
export function downloadOrderInvoicePDF(order: OrderMetadata): void {
  const doc = generateOrderInvoicePDF(order);
  const filename = `CELESTIA_Order_${order.orderNumber}.pdf`;
  doc.save(filename);
}

/**
 * Generates PDF binary data as base64 or blob for email attachments
 */
export function getOrderInvoiceBlob(order: OrderMetadata): Blob {
  const doc = generateOrderInvoicePDF(order);
  return doc.output('blob');
}
