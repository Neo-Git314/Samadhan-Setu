import PDFDocument from 'pdfkit';

/**
 * Samadhan Setu PDF Design Tokens
 */
const COLORS = {
  NAVY: '#123B68',
  BLUE: '#2878B8',
  ORANGE: '#F58220',
  LIGHT_BLUE: '#EEF7FC',
  GRAY_BG: '#F8FAFC',
  TEXT_MAIN: '#17324D',
  TEXT_MUTED: '#58718A',
  BORDER: '#D9E4ED',
  WHITE: '#FFFFFF',
  GREEN: '#16A34A'
};

/**
 * Draw reusable Samadhan Setu Header
 */
function drawHeader(doc) {
  // Top brand banner
  doc.rect(0, 0, doc.page.width, 95).fill(COLORS.NAVY);

  // Logo geometric icon representation in SVG paths/shapes
  // Setu base arc
  doc.save();
  doc.translate(40, 20);

  // Orange foundation arc
  doc.path('M 8 36 C 18 30, 36 30, 46 36 C 42 42, 26 44, 8 36 Z').fill(COLORS.ORANGE);
  // Navy/Medium Blue Setu bridge
  doc.path('M 5 32 C 16 26, 38 26, 49 32 C 44 38, 27 40, 5 32 Z').fill(COLORS.BLUE);
  // Three connected figures
  // Center
  doc.circle(27, 12, 4).fill(COLORS.WHITE);
  doc.path('M 21 24 C 21 18, 33 18, 33 24').strokeColor(COLORS.WHITE).lineWidth(2).stroke();
  // Left
  doc.circle(13, 17, 3.5).fill(COLORS.ORANGE);
  doc.path('M 8 28 C 9 23, 19 23, 20 28').strokeColor(COLORS.ORANGE).lineWidth(1.8).stroke();
  // Right
  doc.circle(41, 17, 3.5).fill(COLORS.ORANGE);
  doc.path('M 34 28 C 35 23, 45 23, 46 28').strokeColor(COLORS.ORANGE).lineWidth(1.8).stroke();

  doc.restore();

  // Header Title
  doc.fillColor(COLORS.WHITE)
    .font('Helvetica-Bold')
    .fontSize(20)
    .text('SAMADHAN SETU', 105, 26, { characterSpacing: 1 });

  doc.font('Helvetica')
    .fontSize(9)
    .fillColor('#E2EDF8')
    .text('National Civic Grievance & Collaborative Problem Solving Platform', 105, 50);

  doc.fontSize(8)
    .fillColor(COLORS.ORANGE)
    .text('Public Service & Citizen Redressal Portal · Pan-India Coverage', 105, 65);

  // Decorative bottom bar
  doc.rect(0, 95, doc.page.width, 4).fill(COLORS.ORANGE);
}

/**
 * Draw reusable Samadhan Setu Footer
 */
function drawFooter(doc) {
  const bottom = doc.page.height - 45;
  doc.rect(0, bottom - 10, doc.page.width, 1).fill(COLORS.BORDER);

  doc.font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(COLORS.NAVY)
    .text('SAMADHAN SETU — CITIZEN GRIEVANCE REDRESSAL SYSTEM', 40, bottom, { align: 'center' });

  doc.font('Helvetica')
    .fontSize(7.5)
    .fillColor(COLORS.TEXT_MUTED)
    .text('This is an electronically generated official public-service document. No physical signature is required.', 40, bottom + 12, { align: 'center' });

  doc.fontSize(7)
    .fillColor(COLORS.BLUE)
    .text('Verify & Track at https://samadhansetu.gov.in/track', 40, bottom + 23, { align: 'center' });
}

/**
 * Generate Grievance Acknowledgement PDF
 */
export function generateAcknowledgementPDF(grievance, outputStream) {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    info: {
      Title: `Grievance_Acknowledgement_${grievance.acknowledgementNumber || grievance.id}`,
      Author: 'Samadhan Setu Public Service Platform',
      Subject: 'Citizen Grievance Redressal Acknowledgement'
    }
  });

  if (outputStream) doc.pipe(outputStream);

  drawHeader(doc);

  let y = 115;

  // Title Box
  doc.rect(40, y, doc.page.width - 80, 36).fill(COLORS.LIGHT_BLUE);
  doc.rect(40, y, doc.page.width - 80, 36).strokeColor(COLORS.BORDER).lineWidth(1).stroke();

  doc.fillColor(COLORS.NAVY)
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('OFFICIAL GRIEVANCE ACKNOWLEDGEMENT', 55, y + 10);

  const ackNumber = grievance.acknowledgementNumber || grievance.id || 'SS-2026-UNKNOWN';
  doc.font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.ORANGE)
    .text(`ID: ${ackNumber}`, doc.page.width - 240, y + 12, { align: 'right', width: 185 });

  y += 50;

  // Key Metadata 2-column strip
  const dateFormatted = grievance.createdAt
    ? new Date(grievance.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const metadata = [
    { label: 'Acknowledgement No.', value: ackNumber },
    { label: 'Registration Date & Time', value: dateFormatted },
    { label: 'Current Status', value: (grievance.status || 'Submitted / Under Review').toUpperCase().replace('_', ' ') },
    { label: 'Statutory Resolution SLA', value: '15 Working Days (Right to Public Service)' }
  ];

  const colWidth = (doc.page.width - 90) / 2;
  metadata.forEach((m, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const mx = 40 + col * (colWidth + 10);
    const my = y + row * 34;

    doc.rect(mx, my, colWidth, 28).fill(COLORS.GRAY_BG);
    doc.rect(mx, my, colWidth, 28).strokeColor(COLORS.BORDER).lineWidth(0.5).stroke();

    doc.font('Helvetica')
      .fontSize(7.5)
      .fillColor(COLORS.TEXT_MUTED)
      .text(m.label.toUpperCase(), mx + 8, my + 4);

    doc.font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(idx === 2 ? COLORS.GREEN : COLORS.NAVY)
      .text(m.value, mx + 8, my + 15, { width: colWidth - 16, ellipsis: true });
  });

  y += 80;

  // Section 1: Citizen Particulars
  doc.rect(40, y, doc.page.width - 80, 20).fill(COLORS.NAVY);
  doc.font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(COLORS.WHITE)
    .text('1. CITIZEN INFORMATION', 50, y + 5);

  y += 20;

  const citizenInfo = [
    { label: 'Full Name', value: grievance.citizenName || grievance.submittedBy?.name || 'Citizen' },
    { label: 'Mobile Number', value: grievance.citizenMobile || grievance.submittedBy?.phone || 'Provided upon registration' },
    { label: 'Email Address', value: grievance.citizenEmail || grievance.submittedBy?.email || 'N/A' },
    { label: 'Residential Address', value: grievance.citizenAddress || grievance.address || 'N/A' }
  ];

  doc.rect(40, y, doc.page.width - 80, 52).fill(COLORS.WHITE);
  doc.rect(40, y, doc.page.width - 80, 52).strokeColor(COLORS.BORDER).lineWidth(1).stroke();

  citizenInfo.forEach((info, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = 50 + col * (colWidth + 10);
    const cy = y + 6 + row * 22;

    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.TEXT_MUTED).text(`${info.label}: `, cx, cy, { continued: true });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.TEXT_MAIN).text(info.value);
  });

  y += 65;

  // Section 2: Location Particulars (Pan-India)
  doc.rect(40, y, doc.page.width - 80, 20).fill(COLORS.NAVY);
  doc.font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(COLORS.WHITE)
    .text('2. JURISDICTION & INCIDENT LOCATION (PAN-INDIA)', 50, y + 5);

  y += 20;

  const locationInfo = [
    { label: 'State / UT', value: grievance.state || 'India' },
    { label: 'District', value: grievance.district || 'N/A' },
    { label: 'City / Town / Village', value: grievance.city || grievance.location?.address || 'N/A' },
    { label: 'Pincode', value: grievance.pincode || 'N/A' }
  ];

  doc.rect(40, y, doc.page.width - 80, 52).fill(COLORS.WHITE);
  doc.rect(40, y, doc.page.width - 80, 52).strokeColor(COLORS.BORDER).lineWidth(1).stroke();

  locationInfo.forEach((info, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const lx = 50 + col * (colWidth + 10);
    const ly = y + 6 + row * 22;

    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.TEXT_MUTED).text(`${info.label}: `, lx, ly, { continued: true });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.TEXT_MAIN).text(info.value);
  });

  y += 65;

  // Section 3: Grievance Details
  doc.rect(40, y, doc.page.width - 80, 20).fill(COLORS.NAVY);
  doc.font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(COLORS.WHITE)
    .text('3. GRIEVANCE DETAILS & NATURE OF COMPLAINT', 50, y + 5);

  y += 20;

  const descBoxHeight = 150;
  doc.rect(40, y, doc.page.width - 80, descBoxHeight).fill(COLORS.WHITE);
  doc.rect(40, y, doc.page.width - 80, descBoxHeight).strokeColor(COLORS.BORDER).lineWidth(1).stroke();

  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.TEXT_MUTED).text('Category:', 50, y + 8, { continued: true });
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.TEXT_MAIN).text(`  ${grievance.category || 'General Civic Grievance'}`);

  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.TEXT_MUTED).text('Complaint Title:', 50, y + 24, { continued: true });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.NAVY).text(`  ${grievance.title || grievance.subject || 'N/A'}`);

  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.TEXT_MUTED).text('Detailed Description:', 50, y + 42);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.TEXT_MAIN).text(
    grievance.description || 'No detailed description recorded.',
    50,
    y + 54,
    { width: doc.page.width - 100, height: 80, ellipsis: true }
  );

  y += descBoxHeight + 15;

  // Important Notice Box
  doc.rect(40, y, doc.page.width - 80, 50).fill(COLORS.LIGHT_BLUE);
  doc.rect(40, y, doc.page.width - 80, 50).strokeColor(COLORS.BLUE).lineWidth(0.8).stroke();

  doc.font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor(COLORS.NAVY)
    .text('IMPORTANT CITIZEN INFORMATION:', 50, y + 8);

  doc.font('Helvetica')
    .fontSize(7.5)
    .fillColor(COLORS.TEXT_MAIN)
    .text(
      `1. Please quote Acknowledgement No. ${ackNumber} for all future inquiries.\n` +
      `2. You can track resolution milestones online at https://samadhansetu.gov.in/track?id=${ackNumber}\n` +
      `3. Automatic escalation to the First Appellate Authority is enabled if not redressed within 15 working days.`,
      50,
      y + 20,
      { width: doc.page.width - 100, lineGap: 1.5 }
    );

  drawFooter(doc);

  doc.end();
  return doc;
}

/**
 * Generate Complaint Receipt PDF (Alias / variant)
 */
export function generateComplaintReceiptPDF(grievance, outputStream) {
  return generateAcknowledgementPDF(grievance, outputStream);
}

/**
 * Generate Resolution Document PDF
 */
export function generateResolutionPDF(grievance, resolution, outputStream) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  if (outputStream) doc.pipe(outputStream);

  drawHeader(doc);

  let y = 115;
  doc.rect(40, y, doc.page.width - 80, 36).fill(COLORS.LIGHT_BLUE);
  doc.rect(40, y, doc.page.width - 80, 36).strokeColor(COLORS.BORDER).lineWidth(1).stroke();

  doc.fillColor(COLORS.NAVY)
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('GRIEVANCE RESOLUTION CERTIFICATE', 55, y + 10);

  const ackNumber = grievance.acknowledgementNumber || grievance.id || 'SS-2026-UNKNOWN';
  doc.font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.GREEN)
    .text('STATUS: RESOLVED', doc.page.width - 200, y + 12);

  y += 55;

  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.NAVY).text(`Grievance ID: ${ackNumber}`, 50, y);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.TEXT_MAIN).text(`Title: ${grievance.title || grievance.subject || ''}`, 50, y + 16);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.TEXT_MAIN).text(`Location: ${grievance.city || ''}, ${grievance.district || ''}, ${grievance.state || ''}`, 50, y + 30);

  y += 55;

  doc.rect(40, y, doc.page.width - 80, 100).fill(COLORS.GRAY_BG);
  doc.rect(40, y, doc.page.width - 80, 100).strokeColor(COLORS.BORDER).lineWidth(1).stroke();

  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.NAVY).text('Resolution Details & Engineering Actions Taken:', 50, y + 10);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.TEXT_MAIN).text(
    resolution?.remarks || 'The civic grievance was inspected on-site, rectified by the assigned engineering authority, and confirmed closed in compliance with statutory civic norms.',
    50,
    y + 28,
    { width: doc.page.width - 100 }
  );

  drawFooter(doc);
  doc.end();
  return doc;
}
