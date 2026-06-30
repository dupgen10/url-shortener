import { Request, Response, NextFunction } from 'express';
import * as urlService from '../services/urlService';
import * as analyticsService from '../services/analyticsService';

export const createShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { url } = req.body;
    const urlDoc = await urlService.createShortUrl(url);
    res.status(201).json({
      id: urlDoc._id,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      accessCount: urlDoc.accessCount,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getUrlDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shortCode = req.params.shortCode as string;
    const urlDoc = await urlService.getUrlByShortCode(shortCode);
    res.status(200).json({
      id: urlDoc._id,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      accessCount: urlDoc.accessCount,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shortCode = req.params.shortCode as string;
    const { url } = req.body;
    const urlDoc = await urlService.updateUrl(shortCode, url);
    res.status(200).json({
      id: urlDoc._id,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      accessCount: urlDoc.accessCount,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shortCode = req.params.shortCode as string;
    await urlService.deleteUrl(shortCode);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shortCode = req.params.shortCode as string;
    const stats = await analyticsService.getStats(shortCode);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
