import { Request, Response, NextFunction } from 'express';
import * as urlService from '../services/urlService';
import * as analyticsService from '../services/analyticsService';

export const redirectToUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shortCode = req.params.shortCode as string;

    // Increment access count
    const urlDoc = await urlService.incrementAccessCount(shortCode);

    // Record click analytics (fire-and-forget)
    const ip = typeof req.ip === 'string' ? req.ip : (req.socket.remoteAddress || 'unknown');
    const userAgent = req.get('User-Agent') || 'unknown';
    const referrer = req.get('Referrer') || req.get('Referer') || undefined;

    analyticsService
      .recordClick({
        shortCode,
        ip,
        userAgent,
        referrer,
      })
      .catch((err) => console.error('Failed to record click:', err));

    // 302 redirect to original URL
    res.redirect(302, urlDoc.url);
  } catch (error) {
    next(error);
  }
};
