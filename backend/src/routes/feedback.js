import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/feedback
router.post('/', async (req, res) => {
  const { email, subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required.' });
  }

  try {
    // 建立 nodemailer transporter（用 Gmail 寄信，建議用 app password）
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FEEDBACK_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD, // 請在 .env 設定 GMAIL_APP_PASSWORD
      },
    });

    const mailOptions = {
      from: email || 'no-reply@planb.app',
      to: process.env.FEEDBACK_EMAIL,
      subject: `[Plan B Feedback] ${subject}`,
      text: `From: ${email || '匿名'}\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Send feedback error:', err);
    res.status(500).json({ error: 'Failed to send feedback.' });
  }
});

export default router; 