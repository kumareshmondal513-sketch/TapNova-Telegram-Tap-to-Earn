import express from 'express';

import {
  getFeatureFlags,
  getFeatureFlag,
  setFeatureFlag
} from '../services/featureFlagService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const flags = await getFeatureFlags();

    res.json({
      success: true,
      flags
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:flagName', async (req, res, next) => {
  try {
    const enabled = await getFeatureFlag(
      req.params.flagName
    );

    res.json({
      success: true,
      flagName: req.params.flagName,
      enabled
    });
  } catch (error) {
    if (
      error.message ===
      'Feature flag name is required.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.put('/:flagName', async (req, res, next) => {
  try {
    const result = await setFeatureFlag(
      req.params.flagName,
      req.body.enabled
    );

    res.json(result);
  } catch (error) {
    const clientErrors = [
      'Feature flag name is required.',
      'Feature flag value must be true or false.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

export default router;