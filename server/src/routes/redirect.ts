import { Router } from 'express';
import { redirectToUrl } from '../controllers/redirectController';

const router = Router();

// GET /:shortCode - Redirect to original URL
router.get('/:shortCode', redirectToUrl);

export default router;
