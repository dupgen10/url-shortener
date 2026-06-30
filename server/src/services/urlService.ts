import Url, { IUrl } from '../models/Url';
import { generateShortCode } from '../utils/generateCode';
import { AppError } from '../middleware/errorHandler';

export const createShortUrl = async (originalUrl: string): Promise<IUrl> => {
  let shortCode = generateShortCode();

  // Ensure uniqueness (extremely unlikely collision with nanoid, but safety first)
  let existing = await Url.findOne({ shortCode });
  while (existing) {
    shortCode = generateShortCode();
    existing = await Url.findOne({ shortCode });
  }

  const urlDoc = await Url.create({
    url: originalUrl,
    shortCode,
  });

  return urlDoc;
};

export const getUrlByShortCode = async (shortCode: string): Promise<IUrl> => {
  const urlDoc = await Url.findOne({ shortCode });
  if (!urlDoc) {
    throw new AppError('Short URL not found', 404);
  }
  return urlDoc;
};

export const updateUrl = async (
  shortCode: string,
  newUrl: string
): Promise<IUrl> => {
  const urlDoc = await Url.findOneAndUpdate(
    { shortCode },
    { url: newUrl },
    { new: true, runValidators: true }
  );
  if (!urlDoc) {
    throw new AppError('Short URL not found', 404);
  }
  return urlDoc;
};

export const deleteUrl = async (shortCode: string): Promise<void> => {
  const result = await Url.findOneAndDelete({ shortCode });
  if (!result) {
    throw new AppError('Short URL not found', 404);
  }
};

export const incrementAccessCount = async (shortCode: string): Promise<IUrl> => {
  const urlDoc = await Url.findOneAndUpdate(
    { shortCode },
    { $inc: { accessCount: 1 } },
    { new: true }
  );
  if (!urlDoc) {
    throw new AppError('Short URL not found', 404);
  }
  return urlDoc;
};
