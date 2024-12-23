import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Create a Referral Schema
const referralSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const Referral = mongoose.model('Referral', referralSchema);

// Route to Generate Referral Link
app.get('/generate', async (req, res) => {
  const phoneNumber = req.query.phone; // Example: /generate?phone=1234567890
  if (!phoneNumber) {
    return res.status(400).send('Phone number is required');
  }

  const code = `referral_${Math.random().toString(36).substr(2, 8)}`; // Generate unique code
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

  try {
    await Referral.create({ code, phoneNumber, expiresAt }); // Stores the referral details the database
    res.send(`Referral link: https://applink-backend.vercel.app/referral/${code}`); // Response: Returns the generated referral link
  } catch (err) {
    res.status(500).send('Error generating referral link');
  }
});

// Route to Validate Referral Link
app.get('/referral/:code', async (req, res) => {
  const referralCode = req.params.code;

  try {
    const referral = await Referral.findOne({ code: referralCode }); // Try to find the referral code in DB

    if (!referral || new Date() > referral.expiresAt) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invalid Link</title>
          </head>
          <body>
            <h1>Invalid or Expired Referral Link</h1>
          </body>
        </html>
      `);
    }

    // Include the referral code in the WhatsApp message
    const referralMessage = `Hello, this message is prefilled for youuu. Use this referral code: ${referral.code}`;
    const deepLink = `whatsapp://send?text=${encodeURIComponent(referralMessage)}`;
    const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN';

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting...</title>
        </head>
        <body>
          <h1>Welcome! Redirecting to WhatsApp...</h1>
          <script>
            const deepLink = '${deepLink}';
            const fallbackUrl = '${fallbackUrl}';

            const openApp = () => {
              try {
                // Attempt to open WhatsApp
                window.location.href = deepLink;

                // Redirect to Play Store if WhatsApp is not installed
                setTimeout(() => {
                  window.location.href = fallbackUrl;
                }, 3000);
              } catch (error) {
                // Fallback in case of an error
                window.location.href = fallbackUrl;
              }
            };

            // Trigger redirection
            openApp();
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error validating referral link');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
