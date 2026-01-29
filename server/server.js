const app = require('./app');
require('dotenv').config();
const { initFirebase } = require('./config/firebase');

const PORT = process.env.PORT || 5000;

try {
  initFirebase();
  console.log('Firebase initialized');
} catch (err) {
  console.error('Failed to initialize Firebase', err);
  process.exit(1);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});