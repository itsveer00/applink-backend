const express = require('express'); // Import Express.js
const app = express(); // Create an Express app
const PORT = 3000; // Define the port number

// Route to handle the app redirection
app.get('/redirect-to-app', (req, res) => {
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.chess&hl=en_IN';
  
  // Send a webpage with logic to open the app or redirect to the Play Store
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Redirecting...</title>
      </head>
      <body>
        <h1>Redirecting to the app...</h1>
        <script>
          // Attempt to open the app via deep link
          const deepLink = 'intent://chess#Intent;package=com.chess;end';
          const fallbackUrl = '${playStoreUrl}';

          const openApp = () => {
            window.location.href = deepLink;
            setTimeout(() => {
              // Redirect to the Play Store if the app isn't installed
              window.location.href = fallbackUrl;
            }, 3000); // Timeout for fallback
          };

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
