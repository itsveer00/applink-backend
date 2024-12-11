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
          const deepLink = 'whatsapp://send';
          const fallbackUrl = '${playStoreUrl}';

          const openApp = () => {
            try {
              // Open the app via deep link
              window.location.href = deepLink;

              // If the app is not installed, redirect to the Play Store after 3 seconds
              setTimeout(() => {
                window.location.href = fallbackUrl;
              }, 3000);
            } catch (error) {
              // Fallback to Play Store if deep link fails
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
