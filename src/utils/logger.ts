type LogArgs = unknown[];

export const logger = {
  debug: (...args: LogArgs) => {
    if (__DEV__) console.log('[debug]', ...args);
  },
  info: (...args: LogArgs) => {
    if (__DEV__) console.log('[info]', ...args);
  },
  warn: (...args: LogArgs) => console.warn(...args),
  error: (...args: LogArgs) => console.error(...args),
};
