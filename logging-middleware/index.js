// logging-middleware/index.js

/**
 * Log an event to the evaluation-service/logs endpoint.
 * @param {string} stack - 'frontend' or 'backend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - 'api', 'component', 'hook', 'page', 'state', 'style', 'auth', 'config', 'middleware', 'utils'
 * @param {string} message - Descriptive log message
 * @param {string} [token] - Optional Bearer token for authentication
 */
async function log(stack, level, pkg, message, token) {
  const validStacks = ['frontend', 'backend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const validFrontendPkgs = ['api', 'component', 'hook', 'page', 'state', 'style', 'auth', 'config', 'middleware', 'utils'];

  if (!validStacks.includes(stack)) throw new Error('Invalid stack');
  if (!validLevels.includes(level)) throw new Error('Invalid level');
  if (!validFrontendPkgs.includes(pkg)) throw new Error('Invalid package');
  if (typeof message !== 'string' || !message.trim()) throw new Error('Message required');

  const body = { stack, level, package: pkg, message };
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Log API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Fallback: do nothing, or optionally store failed logs locally
    // Never use console.log
    return { error: true, message: err.message };
  }
}

module.exports = { log }; 