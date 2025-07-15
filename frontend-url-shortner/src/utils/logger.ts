type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

const LOG_STORAGE_KEY = 'urlshort_logs';

function getLogs(): LogEntry[] {
  const logs = localStorage.getItem(LOG_STORAGE_KEY);
  return logs ? JSON.parse(logs) : [];
}

function saveLog(entry: LogEntry) {
  const logs = getLogs();
  logs.push(entry);
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
}

function log(level: LogLevel, message: string) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  saveLog(entry);
}

export const logger = {
  log: (msg: string) => log('log', msg),
  info: (msg: string) => log('info', msg),
  warn: (msg: string) => log('warn', msg),
  error: (msg: string) => log('error', msg),
  getLogs,
}; 