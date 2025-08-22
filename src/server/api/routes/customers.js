const express = require('express');
const router = express.Router();
const Collection = require('../../engine/collection');
const customer = Collection('customers');

router.post('/', (req, res) => {
  try {
    const newProduct = { 
      ...req.body, 
      _id: Date.now().toString() + Math.floor(Math.random() * 1000).toString() 
    };

    const result = customer.insert(newProduct);

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', (req, res) => {
  try {
    let filter = {};
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
    }
    const results = customer.find(filter);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid filter format' });
  }
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const update = req.body;

  if (!update || typeof update !== 'object') {
    return res.status(400).json({ success: false, message: 'Missing update data' });
  }

  const result = customer.update({ _id: id }, update);
  res.json({ success: true, updated: result.matched });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const result = customer.delete({ _id: id });
  res.json({ success: true, deleted: result.deleted });
});

router.post('/aggregate', (req, res) => {
  const pipeline = req.body;
  if (!Array.isArray(pipeline)) {
    return res.status(400).json({ success: false, message: 'Pipeline must be an array' });
  }
  const result = customer.aggregate(pipeline);
  res.json({ success: true, data: result });
});

module.exports = router;
