const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN';

  // Send a webpage with logic to open the app or redirect to the Play Store
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redirecting...</title>
      </head>
      <body>
        <h1>Redirecting to the app...</h1>
        <script>
          // Attempt to open the app via deep link
          const deepLink = 'intent://send#Intent;package=com.whatsapp;scheme=whatsapp;end';
          const fallbackUrl = '${playStoreUrl}';

          const openApp = () => {
            // Try to open the app
            window.location.href = deepLink;

            // If the app is not installed, redirect to the Play Store after 3 seconds
            setTimeout(() => {
              window.location.href = fallbackUrl;
            }, 3000);
          };

          // Trigger redirection logic
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
