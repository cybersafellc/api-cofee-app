import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(
      (info) => `${info.timestamp} [${info.level}]: ${info.message}}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: path.join("tmp", "%DATE%-error.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d", //
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join("tmp", "%DATE%-combined.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
