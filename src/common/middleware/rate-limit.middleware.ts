import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: Map<string, number> = new Map();
  private maxRequestsPerMinute = 10; // Change this value as per your requirements
  private interval = 10000; // 10s in milliseconds

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip;

    if (this.isClientRateLimited(clientIp)) {
      return res
        .status(HttpStatus.TOO_MANY_REQUESTS)
        .json({ message: 'Too many requests. Please try again later.' });
    }

    this.incrementRequestCount(clientIp);
    setTimeout(() => this.decrementRequestCount(clientIp), this.interval);
    next();
  }

  private isClientRateLimited(clientIp: string): boolean {
    const requestCount = this.requests.get(clientIp) || 0;
    return requestCount >= this.maxRequestsPerMinute;
  }

  private incrementRequestCount(clientIp: string) {
    const requestCount = this.requests.get(clientIp) || 0;
    this.requests.set(clientIp, requestCount + 1);
  }

  private decrementRequestCount(clientIp: string) {
    const requestCount = this.requests.get(clientIp) || 0;
    if (requestCount > 0) {
      this.requests.set(clientIp, requestCount - 1);
    }
  }
}
