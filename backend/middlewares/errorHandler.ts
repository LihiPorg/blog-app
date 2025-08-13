import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] ERROR in ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err.message || err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });
};

export default errorHandler;
