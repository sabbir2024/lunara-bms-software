const express = require('express');
const router = express.Router();
const Collection = require('../../engine/collection');
const users = Collection('users');

// ➕ Create
router.post('/', (req, res) => {
  try {
    const result = users.insert(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📥 Read (with optional filter)
router.get('/all', (req, res) => {
  try {
    let filter = {};
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
    }
    const results = users.find(filter);
    // res.send('Simple Mongo Engine API is running!');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid filter format' });
  }
});

// 📥 Read (with user filter)
router.get('/', async(req, res) => {
  const userInfo = req.body;
// console.log('userInfo',userInfo);

  try {
    const findCustomer =await users.find();
    const filterUserId = await findCustomer.find(user=>user?.userId === userInfo?.userId);
    const filterUserPass = await findCustomer.find(pass=>pass?.password === userInfo?.password);
    
    if (filterUserId === filterUserPass) {
      // res.send('Simple Mongo Engine API is running!');
      res.json({ success: true, data: filterUserId });
    }
    res.status(403).json({ success: false, message: 'Forbidden access' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid filter format' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await users.findOne({ userId, password });
    console.log(user);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // simple token (demo এর জন্য) 
    const token = `${userId}-${Date.now()}`;

    res.json({
      success: true,
      message: "Login successful",
      data: user,
      token
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // simple verify (JWT ব্যবহার করলে better)
  const token = authHeader.split(' ')[1];
  const userId = token.split('-')[0];

  const user = await users.findOne({ userId });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  res.json({ success: true, data: user });
});



// 🔁 Update
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const update = req.body;

  if (!update || typeof update !== 'object') {
    return res.status(400).json({ success: false, message: 'Missing update data' });
  }

  const result = users.update({ _id: id }, update);
  res.json({ success: true, updated: result.matched });
});


// ❌ Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const result = users.delete({ _id: id });
  res.json({ success: true, deleted: result.deleted });
});

// 📊 Aggregate
router.post('/aggregate', (req, res) => {
  const pipeline = req.body;
  if (!Array.isArray(pipeline)) {
    return res.status(400).json({ success: false, message: 'Pipeline must be an array' });
  }
  const result = users.aggregate(pipeline);
  res.json({ success: true, data: result });
});

module.exports = router;
