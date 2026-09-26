import { jsPDF } from 'jspdf';

/**
 * Samadhan Setu PDF Color Palette
 */
const COLORS = {
  NAVY: [18, 59, 104],       // #123B68 - Primary
  BLUE: [40, 120, 184],      // #2878B8 - Secondary
  ORANGE: [245, 130, 32],    // #F58220 - Saffron/Orange Accent
  LIGHT_BLUE: [238, 247, 252],// #EEF7FC - Background tint
  GRAY_BG: [248, 250, 252],   // #F8FAFC
  BORDER: [217, 228, 237],    // #D9E4ED
  TEXT_MAIN: [23, 50, 77],    // #17324D
  TEXT_MUTED: [88, 113, 138], // #58718A
  WHITE: [255, 255, 255],
  GREEN: [22, 163, 74]        // #16A34A
};

/**
 * Draw Samadhan Setu Logo inside jsPDF canvas
 */
function drawSamadhanLogo(doc, x, y, size = 38) {
  doc.saveGraphicsState();

  // Orange bottom Setu arch
  doc.setFillColor(...COLORS.ORANGE);
  doc.setDrawColor(...COLORS.ORANGE);
  // Curved base arc
  doc.ellipse(x + size / 2, y + size * 0.72, size * 0.42, size * 0.12, 'F');

  // Navy Setu bridge arch
  doc.setFillColor(...COLORS.NAVY);
  doc.ellipse(x + size / 2, y + size * 0.64, size * 0.38, size * 0.10, 'F');

  // Center figure (Community / Citizen)
  doc.setFillColor(...COLORS.NAVY);
  doc.circle(x + size / 2, y + size * 0.28, size * 0.10, 'F');

  // Left figure (Civic body)
  doc.setFillColor(...COLORS.BLUE);
  doc.circle(x + size * 0.26, y + size * 0.36, size * 0.08, 'F');

  // Right figure (Industry / University Partner)
  doc.setFillColor(...COLORS.BLUE);
  doc.circle(x + size * 0.74, y + size * 0.36, size * 0.08, 'F');

  // Central civic spark / help star in orange
  doc.setFillColor(...COLORS.ORANGE);
  doc.circle(x + size / 2, y + size * 0.48, size * 0.045, 'F');

  doc.restoreGraphicsState();
}

/**
 * Draw official header banner across page
 */
function drawHeader(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Navy Header Banner
  doc.setFillColor(...COLORS.NAVY);
  doc.rect(0, 0, pageWidth, 34, 'F');

  // Orange Accent Stripe directly beneath
  doc.setFillColor(...COLORS.ORANGE);
  doc.rect(0, 34, pageWidth, 2.5, 'F');

  // Draw Logo in White box or clean circle
  doc.setFillColor(...COLORS.WHITE);
  doc.roundedRect(14, 5, 24, 24, 3, 3, 'F');
  drawSamadhanLogo(doc, 15, 6, 22);

  // Logo Text: SAMADHAN SETU
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.WHITE);
  doc.text('SAMADHAN SETU', 43, 17);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 237, 248);
  doc.text('National Civic Grievance & Collaborative Problem Solving Platform', 43, 23);

  // Portal tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.ORANGE);
  doc.text('CITIZEN PUBLIC SERVICE REDRESSAL REGISTER · PAN-INDIA', 43, 28);
}

/**
 * Draw official footer on all pages
 */
function drawFooter(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const y = pageHeight - 16;

  // Thin separator
  doc.setDrawColor(...COLORS.BORDER);
  doc.setLineWidth(0.5);
  doc.line(14, y - 2, pageWidth - 14, y - 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.NAVY);
  doc.text(
    'Samadhan Setu · Citizen Grievance & Collaborative Problem Solving Platform',
    pageWidth / 2,
    y + 2,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.TEXT_MUTED);
  doc.text(
    'Official digitally authenticated receipt · No physical signature required · Verify at samadhansetu.gov.in',
    pageWidth / 2,
    y + 6.5,
    { align: 'center' }
  );
}

/**
 * Format Date to DD/MM/YYYY
 */
function formatDate(isoOrDateString) {
  if (!isoOrDateString) return new Date().toLocaleDateString('en-IN');
  const d = new Date(isoOrDateString);
  if (isNaN(d.getTime())) return isoOrDateString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Create jsPDF instance and render complete acknowledgement
 */
export function generateAcknowledgementPDF(grievance) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Draw Header
  drawHeader(doc);

  let curY = 43;

  // 1. Title Banner: GRIEVANCE ACKNOWLEDGEMENT
  doc.setFillColor(...COLORS.LIGHT_BLUE);
  doc.setDrawColor(...COLORS.BORDER);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, curY, contentWidth, 13, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.NAVY);
  doc.text('GRIEVANCE ACKNOWLEDGEMENT', margin + 6, curY + 8.5);

  // Acknowledgement Number on Right
  const ackNum =
    grievance.acknowledgementNumber ||
    grievance.id ||
    `SS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.ORANGE);
  doc.text(`Ack No: ${ackNum}`, pageWidth - margin - 6, curY + 8.5, { align: 'right' });

  curY += 17;

  // 2. Metadata Grid (2 columns: Date, Status, Statutory SLA, Department)
  const metaBoxWidth = (contentWidth - 4) / 2;
  const metaBoxHeight = 11;

  const createdAt = grievance.createdAt || new Date().toISOString();
  const dateFormatted = formatDate(createdAt);
  const timeFormatted = new Date(createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const statusLabel = (grievance.status || 'Submitted / Under Review').replace(/_/g, ' ').toUpperCase();

  const metaItems = [
    { label: 'Date of Filing:', val: `${dateFormatted} at ${timeFormatted}` },
    { label: 'Current Status:', val: statusLabel, isHighlight: true },
    { label: 'Statutory Resolution SLA:', val: '15 Working Days (Right to Service)' },
    { label: 'Assigned Department:', val: grievance.department || 'Public Redressal Authority' }
  ];

  metaItems.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = margin + col * (metaBoxWidth + 4);
    const by = curY + row * (metaBoxHeight + 2.5);

    doc.setFillColor(...COLORS.GRAY_BG);
    doc.setDrawColor(...COLORS.BORDER);
    doc.setLineWidth(0.3);
    doc.rect(bx, by, metaBoxWidth, metaBoxHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...COLORS.TEXT_MUTED);
    doc.text(item.label.toUpperCase(), bx + 3, by + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    if (item.isHighlight) {
      doc.setTextColor(...COLORS.GREEN);
    } else {
      doc.setTextColor(...COLORS.NAVY);
    }
    doc.text(item.val, bx + 3, by + 8.5, { maxWidth: metaBoxWidth - 6 });
  });

  curY += metaBoxHeight * 2 + 7;

  // 3. Citizen Details Section
  doc.setFillColor(...COLORS.NAVY);
  doc.rect(margin, curY, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.WHITE);
  doc.text('1. CITIZEN INFORMATION', margin + 4, curY + 4.2);

  curY += 6;

  doc.setFillColor(...COLORS.WHITE);
  doc.setDrawColor(...COLORS.BORDER);
  doc.setLineWidth(0.3);
  doc.rect(margin, curY, contentWidth, 18, 'FD');

  const citizenFields = [
    { label: 'Citizen Name', val: grievance.citizenName || grievance.submittedBy?.name || 'Citizen' },
    { label: 'Mobile Number', val: grievance.citizenMobile || grievance.submittedBy?.phone || 'Verified Mobile' },
    { label: 'Email Address', val: grievance.citizenEmail || grievance.submittedBy?.email || 'N/A' },
    { label: 'Residential Address', val: grievance.citizenAddress || grievance.address || 'N/A' }
  ];

  citizenFields.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const fx = margin + 4 + col * (contentWidth / 2);
    const fy = curY + 5 + row * 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.TEXT_MUTED);
    doc.text(`${f.label}:`, fx, fy);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.TEXT_MAIN);
    doc.text(` ${f.val}`, fx + 32, fy, { maxWidth: contentWidth / 2 - 36 });
  });

  curY += 22;

  // 4. Incident Location Section (Pan-India)
  doc.setFillColor(...COLORS.NAVY);
  doc.rect(margin, curY, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.WHITE);
  doc.text('2. JURISDICTION & INCIDENT LOCATION (PAN-INDIA)', margin + 4, curY + 4.2);

  curY += 6;

  doc.setFillColor(...COLORS.WHITE);
  doc.setDrawColor(...COLORS.BORDER);
  doc.setLineWidth(0.3);
  doc.rect(margin, curY, contentWidth, 18, 'FD');

  const locationFields = [
    { label: 'State / UT', val: grievance.state || 'India' },
    { label: 'District', val: grievance.district || 'N/A' },
    { label: 'City / Town / Village', val: grievance.city || grievance.location || 'N/A' },
    { label: 'Pincode', val: grievance.pincode || 'N/A' }
  ];

  locationFields.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const lx = margin + 4 + col * (contentWidth / 2);
    const ly = curY + 5 + row * 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.TEXT_MUTED);
    doc.text(`${f.label}:`, lx, ly);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.TEXT_MAIN);
    doc.text(` ${f.val}`, lx + 32, ly, { maxWidth: contentWidth / 2 - 36 });
  });

  curY += 22;

  // 5. Complaint Details Section
  doc.setFillColor(...COLORS.NAVY);
  doc.rect(margin, curY, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.WHITE);
  doc.text('3. COMPLAINT DETAILS & GRIEVANCE PARTICULARS', margin + 4, curY + 4.2);

  curY += 6;

  const descBoxHeight = 46;
  doc.setFillColor(...COLORS.WHITE);
  doc.setDrawColor(...COLORS.BORDER);
  doc.setLineWidth(0.3);
  doc.rect(margin, curY, contentWidth, descBoxHeight, 'FD');

  // Category
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.TEXT_MUTED);
  doc.text('Complaint Category:', margin + 4, curY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.NAVY);
  doc.text(
    ` ${grievance.category || 'General Civic Grievance'}`,
    margin + 34,
    curY + 5.5
  );

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.TEXT_MUTED);
  doc.text('Complaint Title:', margin + 4, curY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(...COLORS.NAVY);
  doc.text(
    ` ${grievance.subject || grievance.title || 'Civic Grievance'}`,
    margin + 34,
    curY + 11,
    { maxWidth: contentWidth - 40 }
  );

  // Description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.TEXT_MUTED);
  doc.text('Description:', margin + 4, curY + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.TEXT_MAIN);
  const descText = grievance.description || 'No detailed description provided.';
  const splitDesc = doc.splitTextToSize(descText, contentWidth - 8);
  doc.text(splitDesc.slice(0, 7), margin + 4, curY + 22);

  // Attached Evidence Note
  const attachments = grievance.attachments || [];
  const attachCount = attachments.length || (grievance.mediaUrls?.length || 0);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(...COLORS.TEXT_MUTED);
  doc.text(
    `Attached Evidence Documents: ${attachCount > 0 ? `${attachCount} file(s) recorded in portal` : 'None'}`,
    margin + 4,
    curY + descBoxHeight - 3
  );

  curY += descBoxHeight + 5;

  // 6. Important Information Box
  doc.setFillColor(...COLORS.LIGHT_BLUE);
  doc.setDrawColor(...COLORS.BLUE);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, curY, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.NAVY);
  doc.text('IMPORTANT CITIZEN INSTRUCTIONS', margin + 4, curY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.TEXT_MAIN);
  const infoLines = [
    `• Your grievance has been registered under statutory public service norms. Please keep Acknowledgement Number ${ackNum} safe for tracking.`,
    `• Real-time status, nodal officer updates, and field notes can be tracked anytime at: https://samadhansetu.gov.in/track?id=${ackNum}`,
    `• If not redressed within 15 working days, this matter is automatically escalated to the District First Appellate Authority.`
  ];

  infoLines.forEach((line, i) => {
    doc.text(line, margin + 4, curY + 9.5 + i * 4.5, { maxWidth: contentWidth - 8 });
  });

  // Draw Footer
  drawFooter(doc);

  return doc;
}

/**
 * Trigger browser download of PDF
 */
export function downloadGrievancePDF(grievance) {
  const doc = generateAcknowledgementPDF(grievance);
  const ackNum = grievance.acknowledgementNumber || grievance.id || 'Grievance';
  doc.save(`Samadhan_Setu_Acknowledgement_${ackNum}.pdf`);
}

/**
 * Open identical PDF in print preview (DOES NOT call raw window.print())
 * Uses iframe with blob URL so print output matches PDF 100%
 */
export function printGrievancePDF(grievance) {
  const doc = generateAcknowledgementPDF(grievance);
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  // Hidden print iframe
  let printIframe = document.getElementById('samadhan-pdf-print-frame');
  if (!printIframe) {
    printIframe = document.createElement('iframe');
    printIframe.id = 'samadhan-pdf-print-frame';
    printIframe.style.position = 'fixed';
    printIframe.style.top = '-9999px';
    printIframe.style.left = '-9999px';
    printIframe.style.width = '1px';
    printIframe.style.height = '1px';
    printIframe.style.border = 'none';
    document.body.appendChild(printIframe);
  }

  printIframe.src = blobUrl;
  printIframe.onload = () => {
    try {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
    } catch {
      // Fallback: open in new tab if iframe printing blocked
      window.open(blobUrl, '_blank');
    }
  };
}

export default {
  generateAcknowledgementPDF,
  downloadGrievancePDF,
  printGrievancePDF
};
