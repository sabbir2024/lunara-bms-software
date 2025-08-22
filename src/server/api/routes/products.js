const express = require('express');
const router = express.Router();
const Collection = require('../../engine/collection');
const products = Collection('products');

router.post('/', (req, res) => {
  try {
    const newProduct = { 
      ...req.body, 
      _id: Date.now().toString() + Math.floor(Math.random() * 1000).toString() 
    };

    const result = products.insert(newProduct);

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/bulk-update', (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    const updated = [];
    const inserted = [];

    updates.forEach((incoming) => {
      const existing = products.findOne({ _id: incoming._id });
      if (existing) {
        const currentQty = parseFloat(existing.qty);
        const sold = parseFloat(existing.sold) ;
        const outQty = parseFloat(incoming.qty) ;

        const newQty = currentQty - outQty;
        const newSold = sold + outQty;


        products.update({ _id: incoming._id }, {
          qty: newQty < 0 ? 0 : newQty,
          sold: newSold
        });

        updated.push({ _id: incoming._id, qty: newQty, sold: newSold });
      } else {
        const newProduct = {
          ...incoming,
          qty: parseFloat(incoming.qty),
          sold: parseFloat(incoming.sold)
        };

        products.insert(newProduct);
        inserted.push(newProduct);
      }
    });

    res.json({
      success: true,
      updated,
      inserted
    });
  } catch (err) {
    console.error('Bulk update error:', err); // ✅ log for debugging
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get('/', (req, res) => {
  try {
    let filter = {};
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
    }
    const results = products.find(filter);
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

  const result = products.update({ _id: id }, update);
  res.json({ success: true, updated: result.matched });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const result = products.delete({ _id: id });
  res.json({ success: true, deleted: result.deleted });
});

router.post('/aggregate', (req, res) => {
  const pipeline = req.body;
  if (!Array.isArray(pipeline)) {
    return res.status(400).json({ success: false, message: 'Pipeline must be an array' });
  }
  const result = products.aggregate(pipeline);
  res.json({ success: true, data: result });
});

module.exports = router;
