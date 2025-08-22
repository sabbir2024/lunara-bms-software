const express = require('express');
const router = express.Router();
const Collection = require('../../engine/collection');
const dueDetails = Collection('dueDetails');


router.post('/', (req, res) => {
  console.log('Incoming body:', req.body);
  try {
    const customers = dueDetails.find({});

    const { customer, details } = req.body;

    if (!customer || !customer._id) {
      return res.status(400).json({ success: false, message: "Missing customer info" });
    }

    let updated = null;
    const existingIndex = customers.findIndex(c => c._id === customer._id);

    if (existingIndex !== -1) {
      customers[existingIndex].entries.push(details);
      dueDetails.update({ _id: customer._id }, customers[existingIndex]);
      updated = customers[existingIndex];
    } else {
      const newDoc = {
        ...customer,
        entries: [details]
      };

      dueDetails.insert(newDoc);
      updated = newDoc;
    }

    res.status(201).json({ success: true, data: updated });
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
    const results = dueDetails.find(filter);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid filter format' });
  }
});

router.get('/:id', async(req, res) => {
  const customerId = req.params.id;
const filterId = await dueDetails.find({_id:customerId})
res.json({ success: true, data: filterId });
  
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const update = req.body;

  if (!update || typeof update !== 'object') {
    return res.status(400).json({ success: false, message: 'Missing update data' });
  }

  const result = dueDetails.update({ _id: id }, update);
  res.json({ success: true, updated: result.matched });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const result = dueDetails.delete({ _id: id });
  res.json({ success: true, deleted: result.deleted });
});

router.post('/aggregate', (req, res) => {
  const pipeline = req.body;
  if (!Array.isArray(pipeline)) {
    return res.status(400).json({ success: false, message: 'Pipeline must be an array' });
  }
  const result = dueDetails.aggregate(pipeline);
  res.json({ success: true, data: result });
});

module.exports = router;



