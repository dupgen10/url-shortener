import UAParser from 'ua-parser-js';
import Click, { IClick } from '../models/Click';
import Url from '../models/Url';
import { AppError } from '../middleware/errorHandler';

interface ClickData {
  shortCode: string;
  ip: string;
  userAgent: string;
  referrer?: string;
}

export const recordClick = async (data: ClickData): Promise<IClick> => {
  const parser = new UAParser(data.userAgent);
  const result = parser.getResult();

  const click = await Click.create({
    shortCode: data.shortCode,
    ip: data.ip,
    userAgent: data.userAgent,
    referrer: data.referrer || undefined,
    device: result.device.type || 'desktop',
    browser: result.browser.name || 'unknown',
  });

  return click;
};

export interface ClickRecord {
  shortCode: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  referrer?: string;
  device: string;
  browser: string;
}

export interface UrlStats {
  shortCode: string;
  url: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
  clicks: ClickRecord[];
}

export const getStats = async (shortCode: string): Promise<UrlStats> => {
  const urlDoc = await Url.findOne({ shortCode });
  if (!urlDoc) {
    throw new AppError('Short URL not found', 404);
  }

  const clicks = await Click.find({ shortCode })
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

  return {
    shortCode: urlDoc.shortCode,
    url: urlDoc.url,
    accessCount: urlDoc.accessCount,
    createdAt: urlDoc.createdAt,
    updatedAt: urlDoc.updatedAt,
    clicks: clicks as unknown as ClickRecord[],
  };
};
