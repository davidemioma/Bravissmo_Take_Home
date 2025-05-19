import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
};

// Get status color
const getStatusColor = (status: number): string => {
  if (status >= 500) return colors.red;

  if (status >= 400) return colors.yellow;

  return colors.green;
};

// Sanitize sensitive data
const sanitizeData = (obj: any): any => {
  const sanitized = { ...obj };

  const sensitiveFields = ["password", "token", "authorization", "cookie"];

  Object.keys(sanitized).forEach((key) => {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      sanitized[key] = "[REDACTED]";
    }
  });

  return sanitized;
};

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = randomUUID();

  const start = Date.now();

  // Add requestId to the request object for tracking
  (req as any).requestId = requestId;

  res.on("finish", () => {
    const duration = Date.now() - start;

    const statusColor = getStatusColor(res.statusCode);

    const logData = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: `${statusColor}${res.statusCode}${colors.reset}`,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      query: Object.keys(req.query).length
        ? sanitizeData(req.query)
        : undefined,
      body: Object.keys(req.body).length ? sanitizeData(req.body) : undefined,
    };

    console.log(`
🔍 Request Details:
└─ ID: ${logData.requestId}
└─ Time: ${logData.timestamp}
└─ ${logData.method} ${logData.url}
└─ Status: ${logData.status}
└─ Duration: ${logData.duration}
└─ IP: ${logData.ip}
└─ User-Agent: ${logData.userAgent}
${
  logData.query ? `└─ Query: ${JSON.stringify(logData.query, null, 2)}\n` : ""
}${logData.body ? `└─ Body: ${JSON.stringify(logData.body, null, 2)}\n` : ""}`);
  });

  next();
};

export default logger;
