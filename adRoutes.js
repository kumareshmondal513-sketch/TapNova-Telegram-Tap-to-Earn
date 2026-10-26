import express from 'express';
import {
  createAd,
  getAd,
  getActiveAd,
  updateAd,
  deleteAd
} from '../services/adService.js';

const router = express.Router();

router.get('/:adId', async (req, res) => {
  try {
    const ad = await getActiveAd(req.params.adId);

    return res.json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Get ad error:', error);

    return res.status(404).json({
      success: false,
      message: error.message || 'Ad not found.'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const ad = await createAd(req.body);

    return res.status(201).json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Create ad error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create ad.'
    });
  }
});

router.patch('/:adId', async (req, res) => {
  try {
    const ad = await updateAd(
      req.params.adId,
      req.body
    );

    return res.json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Update ad error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update ad.'
    });
  }
});

router.delete('/:adId', async (req, res) => {
  try {
    const result = await deleteAd(req.params.adId);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Delete ad error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete ad.'
    });
  }
});

export default router;