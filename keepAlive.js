/**
 * Keep-Alive Service
 * Prevents Render free tier from spinning down by pinging itself every 14 minutes
 */

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
const BACKEND_URL = process.env.BACKEND_URL || 'https://lstbooks-backend.onrender.com';

/**
 * Ping the health endpoint to keep the server awake
 */
async function pingServer() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()}`);
    } else {
      console.log(`⚠️ Keep-alive ping returned unexpected status: ${data.status}`);
    }
  } catch (error) {
    console.error(`❌ Keep-alive ping failed: ${error.message}`);
  }
}

/**
 * Start the keep-alive service
 * Only runs in production environment
 */
export function startKeepAlive() {
  // Only run in production (on Render)
  if (process.env.NODE_ENV !== 'production') {
    console.log('⏸️ Keep-alive service disabled in development mode');
    return;
  }

  console.log(`🔄 Keep-alive service started - pinging every ${PING_INTERVAL / 60000} minutes`);
  
  // Ping immediately on startup
  pingServer();
  
  // Then ping every 14 minutes
  setInterval(pingServer, PING_INTERVAL);
}

