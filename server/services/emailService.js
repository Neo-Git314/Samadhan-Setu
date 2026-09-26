import nodemailer from 'nodemailer';

/**
 * Sends an email using nodemailer with SMTP configuration from env.
 * Includes graceful simulation when SMTP credentials are unconfigured or in test mode.
 * @param {Object} options - { to, subject, text, html }
 * @returns {Promise<{ sent: boolean, messageId?: string, simulated?: boolean }>}
 */
export const sendMail = async ({ to, subject, text, html }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

  // Fallback / simulation for development and testing environments without active SMTP
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || SMTP_HOST === 'smtp.example.com' || SMTP_USER.includes('your_smtp') || SMTP_USER === 'test_user') {
    console.log('[emailService] SMTP not configured — email skipped');
    return {
      sent: true,
      simulated: true,
      messageId: `simulated-${Date.now()}`
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: FROM_EMAIL || 'noreply@samadhansetu.in',
      to,
      subject,
      text: text || '',
      html: html || text || ''
    });

    console.log(`[emailService] Email successfully sent to <${to}> (ID: ${info.messageId})`);
    return {
      sent: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`[emailService] Failed to send email to <${to}>:`, error.message);
    return {
      sent: false,
      error: error.message
    };
  }
};

export default {
  sendMail
};
