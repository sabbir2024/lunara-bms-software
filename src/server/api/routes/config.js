const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const configPath = path.join(__dirname, '..', '..', 'config.json');

// GET config
router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: '❌ Failed to read config file' });
  }
});

// PUT config
router.put('/', (req, res) => {
  const newConfig = req.body;

  if (!newConfig.dataDirectory || typeof newConfig.dataDirectory !== 'string') {
    return res.status(400).json({ success: false, message: '❌ Invalid dataDirectory value' });
  }

  try {
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
    res.json({ success: true, message: '✅ Config updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: '❌ Failed to write config file' });
  }
});

module.exports = router;
