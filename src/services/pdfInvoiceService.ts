import jsPDF from 'jspdf';
import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';
import { formatOrderDateIST, formatOrderTimeIST } from '../utils/dateIST';

/**
 * Generates an official, luxury A4 PDF Invoice / Order Confirmation document
 * matching Celestia Atelier brand aesthetics (Obsidian, Champagne Gold, Ivory).
 * (Pure native vector jsPDF engine — zero external plugin dependencies for 100% reliability).
 */
export function generateOrderInvoicePDF(order: OrderMetadata): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
  const orderDate = new Date(order.createdAt);
  const formattedDate = formatOrderDateIST(orderDate);
  const formattedTime = formatOrderTimeIST(orderDate);

  // 0. Base Page Background (Crisp Clean Luxury Canvas)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 1. Luxury Header Banner (Obsidian Background)
  doc.setFillColor(24, 20, 17); // Obsidian #181411
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold Accent Strip
  doc.setFillColor(216, 195, 154); // Gold #D8C39A
  doc.rect(0, 38, pageWidth, 1.5, 'F');

  // Brand Name & Heritage Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(250, 247, 240); // Pearl Ivory #FAF7F0
  doc.text('C E L E S T I A', 15, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(216, 195, 154);
  doc.text('FINE JEWELLERY & BESPOKE ATELIER • MUMBAI', 15, 24);
  doc.setTextColor(200, 200, 200);
  doc.text('Redefined for All. • MMXXVI', 15, 29);

  // Document Heading on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(250, 247, 240);
  doc.text('TAX INVOICE & ORDER RECEIPT', pageWidth - 15, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(216, 195, 154);
  doc.text(`Order #${order.orderNumber}`, pageWidth - 15, 24, { align: 'right' });
  doc.setTextColor(200, 200, 200);
  doc.text(`${formattedDate} • ${formattedTime}`, pageWidth - 15, 29, { align: 'right' });

  // 2. Customer Details & Fulfillment Summary Blocks
  const startY = 48;

  // Box 1: Billed & Shipped To (Left)
  doc.setFillColor(250, 247, 240); // Pearl #FAF7F0
  doc.setDrawColor(230, 220, 200);
  doc.roundedRect(15, startY, 86, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(122, 91, 40); // Gold
  doc.text('BILLED & SHIPPED TO:', 19, startY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(24, 20, 17);
  doc.text(order.customer.name, 19, startY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 70, 65);
  const addressLines = doc.splitTextToSize(order.customer.address, 78);
  doc.text(addressLines.slice(0, 2), 19, startY + 17);
  doc.text(`Phone: ${order.customer.phone}`, 19, startY + 28);
  doc.text(`Email: ${order.customer.email}`, 19, startY + 33);

  // Box 2: Fulfillment & Payment Details (Right)
  const rightBoxX = 109;
  doc.setFillColor(250, 247, 240);
  doc.setDrawColor(230, 220, 200);
  doc.roundedRect(rightBoxX, startY, 86, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(122, 91, 40);
  doc.text('FULFILLMENT & PAYMENT:', rightBoxX + 4, startY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 70, 65);
  
  doc.text('Payment Mode:', rightBoxX + 4, startY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 20, 17);
  doc.text(`${order.paymentMethod} (${order.financialStatus.toUpperCase()})`, rightBoxX + 28, startY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 70, 65);
  doc.text('Dispatch Courier:', rightBoxX + 4, startY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 20, 17);
  doc.text(`${order.shippingMethod}`, rightBoxX + 28, startY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 70, 65);
  doc.text('Est. Delivery:', rightBoxX + 4, startY + 24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 120, 80); // Emerald
  doc.text(`${order.estimatedDelivery?.estimatedDateFormatted || '2-3 Business Days'}`, rightBoxX + 28, startY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 70, 65);
  doc.text('AWB Tracking:', rightBoxX + 4, startY + 30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(122, 91, 40);
  doc.text(`${order.trackingNumber || 'MUM-EXP-LIVE'} (${order.carrier || 'Atelier Courier'})`, rightBoxX + 28, startY + 30);

  // 3. Itemized Products Table (Pure Vector Geometry)
  const tableX = 15;
  let currentY = 94;
  const tableWidth = pageWidth - 30; // 180mm

  // Table Header Row
  doc.setFillColor(24, 20, 17); // Obsidian
  doc.rect(tableX, currentY, tableWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(250, 247, 240);
  doc.text('#', tableX + 3, currentY + 5.5);
  doc.text('ITEM DESCRIPTION & BESPOKE CUSTOMIZATION', tableX + 12, currentY + 5.5);
  doc.text('QTY', tableX + 115, currentY + 5.5, { align: 'center' });
  doc.text('UNIT PRICE', tableX + 145, currentY + 5.5, { align: 'right' });
  doc.text('AMOUNT', tableX + tableWidth - 3, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Table Rows
  order.items.forEach((item, index) => {
    const isEven = index % 2 === 1;
    const rowHeight = item.boxType || item.customNotes ? 14 : 9;

    // Zebra striping
    if (isEven) {
      doc.setFillColor(252, 250, 246);
      doc.rect(tableX, currentY, tableWidth, rowHeight, 'F');
    }

    // Row Bottom Border
    doc.setDrawColor(235, 228, 215);
    doc.line(tableX, currentY + rowHeight, tableX + tableWidth, currentY + rowHeight);

    // Item Index
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 90, 85);
    doc.text(`${index + 1}`, tableX + 3, currentY + 5.5);

    // Item Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(24, 20, 17);
    doc.text(item.title, tableX + 12, currentY + 5.5);

    // Packaging & Custom Notes Subtext
    let subY = currentY + 9.5;
    if (item.boxType) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(122, 91, 40);
      doc.text(`Packaging: ${item.boxType}`, tableX + 12, subY);
      subY += 4;
    }
    if (item.customNotes) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(90, 80, 75);
      doc.text(`Note: "${item.customNotes}"`, tableX + 12, subY);
    }

    // Qty
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(24, 20, 17);
    doc.text(`${item.quantity}`, tableX + 115, currentY + 5.5, { align: 'center' });

    // Unit Price
    doc.text(`INR ${item.price.toLocaleString('en-IN')}`, tableX + 145, currentY + 5.5, { align: 'right' });

    // Line Total
    doc.setFont('helvetica', 'bold');
    doc.text(`INR ${(item.price * item.quantity).toLocaleString('en-IN')}`, tableX + tableWidth - 3, currentY + 5.5, { align: 'right' });

    currentY += rowHeight;
  });

  // 4. Financial Calculations Box
  currentY += 6;
  const summaryBlockX = pageWidth - 85;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 80, 75);

  doc.text('Subtotal:', summaryBlockX, currentY);
  doc.text(`INR ${order.subtotal.toLocaleString('en-IN')}`, pageWidth - 15, currentY, { align: 'right' });
  currentY += 5;

  doc.text('Express Shipping:', summaryBlockX, currentY);
  doc.text(
    order.shippingCost === 0 ? 'FREE (INR 0)' : `INR ${order.shippingCost.toLocaleString('en-IN')}`,
    pageWidth - 15,
    currentY,
    { align: 'right' }
  );
  currentY += 5;

  const discount = order.subtotal + order.shippingCost - order.total;
  if (discount > 0) {
    doc.setTextColor(16, 120, 80);
    doc.text('Special Instant Discount:', summaryBlockX, currentY);
    doc.text(`- INR ${discount.toLocaleString('en-IN')}`, pageWidth - 15, currentY, { align: 'right' });
    currentY += 5;
  }

  // Grand Total Highlight Pill
  currentY += 2;
  doc.setFillColor(243, 235, 219); // Champagne #F3EBDB
  doc.setDrawColor(216, 195, 154);
  doc.roundedRect(summaryBlockX - 4, currentY - 3.5, 74, 11, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 20, 17);
  doc.text('Grand Total:', summaryBlockX, currentY + 3.5);
  doc.setTextColor(122, 91, 40);
  doc.text(`INR ${order.total.toLocaleString('en-IN')}`, pageWidth - 15, currentY + 3.5, { align: 'right' });

  // 5. Unboxing Guarantee & Warranty Seal (Bottom Box)
  const sealY = pageHeight - 48;
  doc.setFillColor(250, 247, 240);
  doc.setDrawColor(216, 195, 154);
  doc.roundedRect(15, sealY, pageWidth - 30, 22, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(122, 91, 40);
  doc.text('CELESTIA ATELIER AUTHENTICITY & 100% ANTI-TARNISH SEAL', 20, sealY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 80, 75);
  doc.text(
    'Every piece is individually handcrafted in Mumbai with hypoallergenic, anti-tarnish stainless steel & 18K gold vermeil. Please record an uncut unboxing video upon arrival for our 7-day hassle-free replacement warranty.',
    20,
    sealY + 12,
    { maxWidth: pageWidth - 40 }
  );

  // 6. Atelier Signature & Support Footer
  doc.setFontSize(7);
  doc.setTextColor(140, 130, 125);
  doc.text(
    `Questions or inquiries? WhatsApp Concierge: +91 7718825792 • Email: ${BRAND_INFO.email} • Bandra West Atelier, Mumbai 400050`,
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center' }
  );

  return doc;
}

/**
 * Triggers instant, reliable download of the PDF invoice in the browser
 */
export function downloadOrderInvoicePDF(order: OrderMetadata): void {
  try {
    const doc = generateOrderInvoicePDF(order);
    const filename = `CELESTIA_Order_${order.orderNumber}.pdf`;
    
    // Use standard jsPDF save
    doc.save(filename);
  } catch (err) {
    console.error('[PDF Engine] Error saving PDF, falling back to blob open:', err);
    // Fallback: Open generated blob in new window for direct print/save
    try {
      const doc = generateOrderInvoicePDF(order);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CELESTIA_Order_${order.orderNumber}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackErr) {
      console.error('[PDF Engine] Fallback failed:', fallbackErr);
    }
  }
}
