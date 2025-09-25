import { Router } from 'express';
import { ApiService } from '../services/api';
import { cacheService } from '../services/cache';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const cacheKey = 'baidu_hot';
    
    // Try to get from cache first
    let data = cacheService.get(cacheKey);
    
    if (!data) {
      // Fetch from API if not in cache
      data = await ApiService.getBaiduHot();
      // Cache for 30 minutes
      cacheService.set(cacheKey, data, 30 * 60 * 1000);
    }
    
    res.json(data);
  } catch (error) {
    console.error('Baidu API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Baidu hot topics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as baiduRouter };
