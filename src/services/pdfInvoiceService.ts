import jsPDF from 'jspdf';
import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';
import { formatOrderDateIST, formatOrderTimeIST } from '../utils/dateIST';

/**
 * 6-Stage Linear Order Progression for Celestia Atelier
 */
const SIX_STAGE_STEPS = [
  { id: 'placed', label: 'Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'out_for_delivery', label: 'Out for Del.' },
  { id: 'delivered', label: 'Delivered' },
];

/**
 * Generates an official, luxury A4 PDF Invoice / Order Confirmation document
 * matching Celestia Atelier brand aesthetics (Obsidian, Champagne Gold, Ivory).
 * 
 * Strict A4 Portrait Specifications:
 * - Page Width: 210mm, Page Height: 297mm
 * - Safe Left Margin: 14mm, Safe Right Margin: 196mm (Printable Width: 182mm)
 * - 100% Native vector jsPDF engine — zero external plugin dependencies
 * - Amazon / Flipkart-level professional clarity with luxury Atelier finesse
 * - Multi-page pagination support for large orders
 */
export function generateOrderInvoicePDF(order: OrderMetadata): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 14;
  const rightMargin = 196;
  const contentWidth = rightMargin - leftMargin; // 182mm

  const orderDate = new Date(order.createdAt);
  const formattedDate = formatOrderDateIST(orderDate);
  const formattedTime = formatOrderTimeIST(orderDate);

  // Map fulfillment status to 6-stage index
  const stageMap: Record<string, number> = {
    placed: 0,
    confirmed: 1,
    preparing: 2,
    shipped: 3,
    out_for_delivery: 4,
    delivered: 5,
  };
  const currentStageIndex = stageMap[order.fulfillmentStatus?.toLowerCase()] ?? 1;

  // Helper to draw Header on a given page
  const drawPageHeader = (pageNumber: number, isFirstPage: boolean) => {
    // 0. Base Clean Canvas
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // 1. Luxury Header Banner (Obsidian Background)
    const headerHeight = isFirstPage ? 36 : 22;
    doc.setFillColor(24, 20, 17); // Obsidian #181411
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    // Gold Accent Strip
    doc.setFillColor(216, 195, 154); // Gold #D8C39A
    doc.rect(0, headerHeight, pageWidth, 1.2, 'F');

    if (isFirstPage) {
      // Brand Name & Heritage Subtitle
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(250, 247, 240); // Pearl Ivory #FAF7F0
      doc.text('C E L E S T I A', leftMargin, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(216, 195, 154);
      doc.text('FINE JEWELLERY & BESPOKE ATELIER • MUMBAI', leftMargin, 20.5);
      doc.setFontSize(7);
      doc.setTextColor(190, 185, 180);
      doc.text('Redefined for All. • MMXXVI', leftMargin, 26);

      // Document Heading & Order Meta (Right-aligned strictly at 196mm)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(250, 247, 240);
      doc.text('TAX INVOICE & ORDER CONFIRMATION', rightMargin, 13, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(216, 195, 154);
      doc.text(`Order #${order.orderNumber}`, rightMargin, 18.5, { align: 'right' });

      doc.setFontSize(7.5);
      doc.setTextColor(190, 185, 180);
      doc.text(`${formattedDate} • ${formattedTime}`, rightMargin, 24, { align: 'right' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text(
        `PAYMENT: ${order.financialStatus.toUpperCase()} • STATUS: ${order.fulfillmentStatus.toUpperCase()}`,
        rightMargin,
        29.5,
        { align: 'right' }
      );
    } else {
      // Compact Continuation Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(250, 247, 240);
      doc.text('CELESTIA ATELIER • INVOICE CONTINUATION', leftMargin, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(216, 195, 154);
      doc.text(`Order #${order.orderNumber} (Page ${pageNumber})`, rightMargin, 12, { align: 'right' });
    }
  };

  // Helper to draw Footer
  const drawPageFooter = (currentPage: number, totalPages: number) => {
    const footerY = pageHeight - 11;
    doc.setDrawColor(230, 220, 200);
    doc.line(leftMargin, footerY - 3, rightMargin, footerY - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(130, 120, 115);
    doc.text(
      `Support: ${BRAND_INFO.email} | WhatsApp: +91 7718825792 | Bandra West, Mumbai 400050`,
      leftMargin,
      footerY
    );

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${currentPage} of ${totalPages}`, rightMargin, footerY, { align: 'right' });
  };

  // Start Drawing Page 1
  drawPageHeader(1, true);

  // 2. Customer & Logistics Dual Meta Cards
  const metaY = 42;
  const cardWidth = 88;
  const cardHeight = 36;

  // Box 1: Billed & Shipped To (Left: 14mm to 102mm)
  doc.setFillColor(250, 247, 240); // Pearl #FAF7F0
  doc.setDrawColor(228, 218, 200);
  doc.roundedRect(leftMargin, metaY, cardWidth, cardHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(122, 91, 40); // Gold
  doc.text('BILLED & SHIPPED TO:', leftMargin + 4, metaY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(24, 20, 17);
  doc.text(order.customer.name.slice(0, 36), leftMargin + 4, metaY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 70, 65);
  const addressLines = doc.splitTextToSize(order.customer.address, 80);
  doc.text(addressLines.slice(0, 2), leftMargin + 4, metaY + 16);

  doc.setFontSize(7);
  doc.setTextColor(100, 90, 85);
  doc.text(`Phone: ${order.customer.phone}`, leftMargin + 4, metaY + 26);
  doc.text(`Email: ${order.customer.email.slice(0, 38)}`, leftMargin + 4, metaY + 31);

  // Box 2: Fulfillment & Payment Details (Right: 108mm to 196mm)
  const rightCardX = 108;
  doc.setFillColor(250, 247, 240);
  doc.setDrawColor(228, 218, 200);
  doc.roundedRect(rightCardX, metaY, cardWidth, cardHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(122, 91, 40);
  doc.text('FULFILLMENT & PAYMENT SUMMARY:', rightCardX + 4, metaY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 70, 65);

  // Payment Row
  doc.text('Payment Method:', rightCardX + 4, metaY + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 20, 17);
  doc.text(`${order.paymentMethod} (${order.financialStatus.toUpperCase()})`, rightCardX + 30, metaY + 11);

  // Shipping Row
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 70, 65);
  doc.text('Shipping Method:', rightCardX + 4, metaY + 16.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 20, 17);
  doc.text(`${order.shippingMethod.slice(0, 26)}`, rightCardX + 30, metaY + 16.5);

  // Estimated Delivery Row
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 70, 65);
  doc.text('Est. Delivery:', rightCardX + 4, metaY + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 120, 80); // Emerald
  const estDate = order.estimatedDelivery?.estimatedDateFormatted || '2-3 Business Days';
  const estTime = order.estimatedDelivery?.expectedTimeWindow ? ` (${order.estimatedDelivery.expectedTimeWindow})` : '';
  doc.text(`${estDate}${estTime}`.slice(0, 32), rightCardX + 30, metaY + 22);

  // Tracking AWB Row
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 70, 65);
  doc.text('Tracking AWB:', rightCardX + 4, metaY + 27.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(122, 91, 40);
  doc.text(`${order.trackingNumber || 'MUM-EXP-LIVE'} (${order.carrier || 'Delhivery'})`.slice(0, 32), rightCardX + 30, metaY + 27.5);

  // 3. 6-Stage Order Status Visual Progression Timeline
  const timelineY = 82;
  const timelineHeight = 16;
  doc.setFillColor(250, 247, 240);
  doc.setDrawColor(228, 218, 200);
  doc.roundedRect(leftMargin, timelineY, contentWidth, timelineHeight, 2, 2, 'FD');

  // Timeline Header Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(122, 91, 40);
  doc.text(
    `ORDER STATUS TIMELINE (STAGE ${currentStageIndex + 1} OF 6: ${SIX_STAGE_STEPS[currentStageIndex].label.toUpperCase()})`,
    leftMargin + 4,
    timelineY + 4.5
  );

  // Timeline Progress Track
  const trackStartX = leftMargin + 12;
  const trackEndX = rightMargin - 12;
  const stepSpacing = (trackEndX - trackStartX) / (SIX_STAGE_STEPS.length - 1);
  const nodeCenterY = timelineY + 9;

  // Background connecting line
  doc.setDrawColor(220, 210, 195);
  doc.setLineWidth(0.6);
  doc.line(trackStartX, nodeCenterY, trackEndX, nodeCenterY);

  // Completed progress connecting line
  if (currentStageIndex > 0) {
    doc.setDrawColor(16, 120, 80);
    doc.setLineWidth(0.8);
    doc.line(trackStartX, nodeCenterY, trackStartX + currentStageIndex * stepSpacing, nodeCenterY);
  }

  // Draw 6 Nodes
  SIX_STAGE_STEPS.forEach((step, idx) => {
    const nodeX = trackStartX + idx * stepSpacing;
    const isCompleted = idx < currentStageIndex;
    const isCurrent = idx === currentStageIndex;

    if (isCompleted) {
      // Completed Stage (Emerald Filled Circle with Vector Checkmark)
      doc.setFillColor(16, 120, 80);
      doc.setDrawColor(16, 120, 80);
      doc.circle(nodeX, nodeCenterY, 2.5, 'FD');
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.4);
      doc.line(nodeX - 1.0, nodeCenterY, nodeX - 0.2, nodeCenterY + 0.8);
      doc.line(nodeX - 0.2, nodeCenterY + 0.8, nodeX + 1.1, nodeCenterY - 0.7);
    } else if (isCurrent) {
      // Active Current Stage (Obsidian Circle with Gold Accent)
      doc.setFillColor(24, 20, 17);
      doc.setDrawColor(216, 195, 154);
      doc.setLineWidth(0.6);
      doc.circle(nodeX, nodeCenterY, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(216, 195, 154);
      doc.text(`${idx + 1}`, nodeX, nodeCenterY + 0.9, { align: 'center' });
    } else {
      // Pending Stage
      doc.setFillColor(245, 240, 230);
      doc.setDrawColor(200, 190, 175);
      doc.setLineWidth(0.3);
      doc.circle(nodeX, nodeCenterY, 2.2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5);
      doc.setTextColor(120, 110, 100);
      doc.text(`${idx + 1}`, nodeX, nodeCenterY + 0.8, { align: 'center' });
    }

    // Step Label Below Node
    doc.setFont('helvetica', isCurrent ? 'bold' : 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(isCurrent ? 24 : isCompleted ? 16 : 120, isCurrent ? 20 : isCompleted ? 120 : 110, isCurrent ? 17 : isCompleted ? 80 : 100);
    doc.text(step.label, nodeX, timelineY + 14.5, { align: 'center' });
  });

  // 4. Itemized Products Table
  let currentY = 102;
  const tableHeaderHeight = 7;

  // Table Header Row (Obsidian #181411)
  const drawTableHeader = (yPos: number) => {
    doc.setFillColor(24, 20, 17);
    doc.rect(leftMargin, yPos, contentWidth, tableHeaderHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(250, 247, 240);
    doc.text('#', leftMargin + 3, yPos + 4.8);
    doc.text('ITEM DESCRIPTION & BESPOKE CUSTOMIZATION', leftMargin + 10, yPos + 4.8);
    doc.text('QTY', leftMargin + 112, yPos + 4.8, { align: 'center' });
    doc.text('UNIT PRICE', leftMargin + 146, yPos + 4.8, { align: 'right' });
    doc.text('TOTAL AMOUNT', rightMargin - 3, yPos + 4.8, { align: 'right' });
  };

  drawTableHeader(currentY);
  currentY += tableHeaderHeight;

  let pageIndex = 1;
  const pageLimitY = pageHeight - 55; // Threshold before pushing to new page

  // Render Item Rows
  order.items.forEach((item, index) => {
    const hasNotes = Boolean(item.boxType || item.customNotes);
    const rowHeight = hasNotes ? 14 : 9.5;

    // Check if we need to advance to page 2
    if (currentY + rowHeight > pageLimitY) {
      drawPageFooter(pageIndex, 2);
      doc.addPage();
      pageIndex++;
      drawPageHeader(pageIndex, false);
      currentY = 28;
      drawTableHeader(currentY);
      currentY += tableHeaderHeight;
    }

    const isEven = index % 2 === 1;
    if (isEven) {
      doc.setFillColor(252, 250, 246);
      doc.rect(leftMargin, currentY, contentWidth, rowHeight, 'F');
    }

    // Row separator line
    doc.setDrawColor(235, 228, 215);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, currentY + rowHeight, rightMargin, currentY + rowHeight);

    // Item Index
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 90, 85);
    doc.text(`${index + 1}`, leftMargin + 3, currentY + 5.5);

    // Product Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 20, 17);
    const itemTitle = doc.splitTextToSize(item.title, 95);
    doc.text(itemTitle[0], leftMargin + 10, currentY + 5.5);

    // Customization / Packaging subtext
    if (hasNotes) {
      let subY = currentY + 9.2;
      if (item.boxType) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(122, 91, 40);
        doc.text(`Packaging: ${item.boxType}`, leftMargin + 10, subY);
        subY += 3.5;
      }
      if (item.customNotes) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.5);
        doc.setTextColor(90, 80, 75);
        doc.text(`Note: "${item.customNotes.slice(0, 60)}"`, leftMargin + 10, subY);
      }
    }

    // Qty (Centered at 126mm)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(24, 20, 17);
    doc.text(`${item.quantity}`, leftMargin + 112, currentY + 5.5, { align: 'center' });

    // Unit Price (Right-aligned at 160mm)
    doc.text(`INR ${item.price.toLocaleString('en-IN')}`, leftMargin + 146, currentY + 5.5, { align: 'right' });

    // Line Total (Right-aligned at 193mm)
    doc.setFont('helvetica', 'bold');
    doc.text(`INR ${(item.price * item.quantity).toLocaleString('en-IN')}`, rightMargin - 3, currentY + 5.5, { align: 'right' });

    currentY += rowHeight;
  });

  // 5. Totals Breakdown & Authenticity Guarantee (Placed neatly below table)
  currentY += 5;

  // Check if summary fits on current page
  if (currentY + 45 > pageHeight - 15) {
    drawPageFooter(pageIndex, pageIndex + 1);
    doc.addPage();
    pageIndex++;
    drawPageHeader(pageIndex, false);
    currentY = 28;
  }

  const blockStartY = currentY;

  // Left Card: Authenticity Seal & Warranty (x: 14mm to 102mm)
  const sealWidth = 88;
  const sealHeight = 31;
  doc.setFillColor(250, 247, 240);
  doc.setDrawColor(216, 195, 154);
  doc.roundedRect(leftMargin, blockStartY, sealWidth, sealHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(122, 91, 40);
  doc.text('CELESTIA ATELIER AUTHENTICITY SEAL', leftMargin + 4, blockStartY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(80, 70, 65);
  const sealText = doc.splitTextToSize(
    'Every piece is individually handcrafted in Mumbai with hypoallergenic, anti-tarnish stainless steel & 18K gold vermeil. Please record an uncut unboxing video upon arrival for our 7-day hassle-free replacement warranty.',
    80
  );
  doc.text(sealText, leftMargin + 4, blockStartY + 10.5);

  // Clean vector badge icon
  const badgeY = blockStartY + 25.5;
  doc.setFillColor(16, 120, 80);
  doc.circle(leftMargin + 6, badgeY, 1.8, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.line(leftMargin + 5.2, badgeY, leftMargin + 5.8, badgeY + 0.6);
  doc.line(leftMargin + 5.8, badgeY + 0.6, leftMargin + 6.8, badgeY - 0.6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(16, 120, 80);
  doc.text('100% Anti-Tarnish Guarantee • Mumbai Handcrafted', leftMargin + 9.5, badgeY + 0.8);

  // Right Card: Financial Calculation & Grand Total Summary (x: 108mm to 196mm)
  const summaryX = 108;
  let sumY = blockStartY + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 70, 65);

  doc.text('Bag Subtotal:', summaryX + 4, sumY);
  doc.text(`INR ${order.subtotal.toLocaleString('en-IN')}`, rightMargin - 3, sumY, { align: 'right' });
  sumY += 4.5;

  doc.text('Shipping & Handling:', summaryX + 4, sumY);
  doc.text(
    order.shippingCost === 0 ? 'FREE (INR 0)' : `INR ${order.shippingCost.toLocaleString('en-IN')}`,
    rightMargin - 3,
    sumY,
    { align: 'right' }
  );
  sumY += 4.5;

  const discount = order.subtotal + order.shippingCost - order.total;
  if (discount > 0) {
    doc.setTextColor(16, 120, 80);
    doc.text('Special Instant Discount:', summaryX + 4, sumY);
    doc.text(`- INR ${discount.toLocaleString('en-IN')}`, rightMargin - 3, sumY, { align: 'right' });
    sumY += 4.5;
  }

  // Grand Total Highlight Pill
  sumY += 1;
  const totalBoxHeight = 10;
  doc.setFillColor(243, 235, 219); // Champagne #F3EBDB
  doc.setDrawColor(216, 195, 154);
  doc.roundedRect(summaryX, sumY, cardWidth, totalBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(24, 20, 17);
  doc.text('Grand Total (INR):', summaryX + 4, sumY + 6.2);

  doc.setFontSize(9.5);
  doc.setTextColor(122, 91, 40);
  doc.text(`INR ${order.total.toLocaleString('en-IN')}`, rightMargin - 4, sumY + 6.2, { align: 'right' });

  // 6. Draw Final Page Footers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(p, totalPages);
  }

  return doc;
}

/**
 * Triggers instant, reliable download of the PDF invoice in the browser
 */
export function downloadOrderInvoicePDF(order: OrderMetadata): void {
  try {
    const doc = generateOrderInvoicePDF(order);
    const filename = `CELESTIA_Order_${order.orderNumber}.pdf`;
    
    // Standard jsPDF save
    doc.save(filename);
  } catch (err) {
    console.error('[PDF Engine] Error saving PDF, falling back to blob open:', err);
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
