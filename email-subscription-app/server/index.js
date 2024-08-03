
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rajk@260510789',
  database: 'subscription_db'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajkhairnar26@gmail.com',
    pass: 'qsmz qous awxz ysop'
  }
});

// Subscribe 
app.post('/subscribe', (req, res) => {
  const { name, email } = req.body;
  if (!validateName(name) || !validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid name or email' });
  }

  const query = 'INSERT INTO subscribers (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err, result) => {
    if (err) {
      return res.status(500).send('Error subscribing');
    }

    const mailOptions = {
      from: 'rajkhairnar26@gmail.com',
      to: email,
      subject: 'Thank you for subscribing',
      text: 'Thank you for subscribing to our service!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.status(200).json({ message: 'Subscription successful!' });
    });
  });
});

// Unsubscribe 
app.post('/unsubscribe', (req, res) => {
  const { email } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const query = 'DELETE FROM subscribers WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).send('Error unsubscribing');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const mailOptions = {
      from: 'rajkhairnar26@gmail.com',
      to: email,
      subject: 'Sorry to see you go',
      text: 'We are sorry to see you go!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.status(200).json({ message: 'Unsubscription successful!' });
      return
    });
  });
});


const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name) => /^[A-Za-z\s]+$/.test(name) && name.trim() !== '';

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
