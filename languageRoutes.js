import express from 'express';

import {
  getSupportedLanguages,
  getTranslations,
  translate,
  isSupportedLanguage
} from '../services/languageService.js';

const router = express.Router();

router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: getSupportedLanguages()
  });
});

router.get('/:language', (req, res) => {
  const language = req.params.language;

  if (!isSupportedLanguage(language)) {
    return res.status(400).json({
      success: false,
      message: 'Unsupported language.'
    });
  }

  res.json({
    success: true,
    language,
    translations: getTranslations(language)
  });
});

router.get(
  '/:language/:key',
  (req, res) => {
    const {
      language,
      key
    } = req.params;

    if (!isSupportedLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported language.'
      });
    }

    res.json({
      success: true,
      language,
      key,
      value: translate(
        key,
        language
      )
    });
  }
);

export default router;