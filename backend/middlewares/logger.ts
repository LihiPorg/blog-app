import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '..', 'log.txt');

const logger = (req: Request, res: Response, next: NextFunction) => {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
  next();
};

export default logger;
