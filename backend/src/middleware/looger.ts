import { Request, Response, NextFunction } from "express";

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  console.log(
    `➡️  [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(
      `⬅️  [${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
