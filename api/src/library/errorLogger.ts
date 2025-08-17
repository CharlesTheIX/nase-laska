import winston from 'winston';
const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'error.log',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json())
    })
  ],
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple())
});
export default errorLogger;
