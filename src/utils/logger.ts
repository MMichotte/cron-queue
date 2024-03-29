import { createLogger, format, transports } from "winston";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  levels: logLevels,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.padLevels(),
    format.printf((log) => `${log.timestamp} ${log.level}: ${log.message}`)
  ),
  transports: [
    new transports.Console({}),
    new transports.File({
      filename: process.env.LOG_FILE,
      maxsize: 10_000_000,
      maxFiles: 15,
    }),
  ],
  exceptionHandlers: [new transports.Console({})],
  rejectionHandlers: [new transports.Console({})],
});

export { logger };
