import { Router } from 'express';
import { z } from 'zod';
import * as shortenController from '../controllers/shortenController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

const createUrlSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

const updateUrlSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

// POST /api/shorten - Create a short URL
router.post('/', validateRequest(createUrlSchema), shortenController.createShortUrl);

// GET /api/shorten/:shortCode - Get URL details
router.get('/:shortCode', shortenController.getUrlDetails);

// PUT /api/shorten/:shortCode - Update destination URL
router.put('/:shortCode', validateRequest(updateUrlSchema), shortenController.updateUrl);

// DELETE /api/shorten/:shortCode - Delete short URL
router.delete('/:shortCode', shortenController.deleteUrl);

// GET /api/shorten/:shortCode/stats - Get analytics
router.get('/:shortCode/stats', shortenController.getStats);

export default router;
