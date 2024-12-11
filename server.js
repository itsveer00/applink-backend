const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redirecting...</title>
      </head>
      <body>
        <h1>Redirecting to WhatsApp...</h1>
        <script>
          const deepLink = 'whatsapp://send?text=Hello, this msg prefilled by deeplink';
          const fallbackUrl = '${playStoreUrl}';

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
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
