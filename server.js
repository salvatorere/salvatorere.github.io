const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/brands', (req, res) => {
    res.sendFile(path.join(__dirname, 'brands.html'));
});

app.get('/agents', (req, res) => {
    res.sendFile(path.join(__dirname, 'agents.html'));
});

app.get('/kontakt', (req, res) => {
    res.sendFile(path.join(__dirname, 'kontakt.html'));
});

// E-Mail-Konfiguration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true für 465, false für andere Ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Kontaktformular-Route
app.post('/send-contact', async (req, res) => {
    try {
        const { name, email, phone, company, subject, message } = req.body;
        
        // E-Mail-Inhalt erstellen
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `Neue Kontaktanfrage: ${subject}`,
            html: `
                <h2>Neue Kontaktanfrage von der Webseite</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>E-Mail:</strong> ${email}</p>
                <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
                <p><strong>Unternehmen:</strong> ${company || 'Nicht angegeben'}</p>
                <p><strong>Betreff:</strong> ${subject}</p>
                <p><strong>Nachricht:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Diese E-Mail wurde über das Kontaktformular der Brand Agent GmbH Webseite gesendet.</small></p>
            `
        };
        
        // E-Mail senden
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'E-Mail erfolgreich gesendet!' });
    } catch (error) {
        console.error('Fehler beim Senden der E-Mail:', error);
        res.status(500).json({ success: false, message: 'Fehler beim Senden der E-Mail.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 