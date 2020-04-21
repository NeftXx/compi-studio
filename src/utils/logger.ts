import { createLogger, format, transports } from 'winston';
import path from 'path';

const consoleFile = format.combine(
  format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  format.printf((info) => {
    const { timestamp, level, message } = info;
    return `[${timestamp}] ${level}:  ${message}`;
  })
);

const consoleFormat = format.combine(format.colorize(), consoleFile);

function tranportConsole() {
  return new transports.Console({
    level: 'debug',
    handleExceptions: true,
    format: consoleFormat,
  });
}

function transportFile(
  filename: string,
  level: string,
  maxsize: number,
  maxFiles: number
) {
  return new transports.File({
    filename,
    level,
    maxsize,
    maxFiles,
    format: consoleFile,
  });
}

export const logger = createLogger({
  transports: [
    tranportConsole(),
    transportFile(
      path.join(__dirname, '../logs/error.log'),
      'error',
      5242880,
      5
    ),
    transportFile(path.join(__dirname, '../logs/info.log'), 'info', 5242880, 5),
  ],
  exitOnError: false,
});

export const stream = {
  write: (message: string) =>
    logger.info(message.substring(0, message.lastIndexOf('\n'))),
};
