const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const Application = require('../models/Application');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST - Submit Application
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, experience, message } = req.body;

    const application = new Application({
      name, email, phone, position, experience, message,
      resumePath: req.file ? req.file.filename : null
    });

    await application.save();

    // Send email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CLIENT_EMAIL,
      subject: `New Job Application - ${position}`,
      html: `
        <h2>New Application Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Position:</b> ${position}</p>
        <p><b>Experience:</b> ${experience}</p>
        <p><b>Message:</b> ${message}</p>
      `,
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: `uploads/${req.file.filename}`
      }] : []
    });

    res.status(201).json({ success: true, message: 'Application submitted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET - All Applications (Admin)
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;