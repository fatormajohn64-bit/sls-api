import { Router } from 'express';
import { login, setupAdmin } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/setup', setupAdmin);
router.post('/login', login);
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
});

export default router;
