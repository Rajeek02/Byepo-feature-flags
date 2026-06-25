const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const { auth } = require('../middleware/auth');
// POST /api/super-admin/login
router.post('/login', (req, res) => {
 const { email, password } = req.body;
 if (email !== process.env.SUPER_ADMIN_EMAIL ||
 password !== process.env.SUPER_ADMIN_PASSWORD)
 return res.status(401).json({ message: 'Invalid credentials' });
 const token = jwt.sign({ role: 'super_admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
 res.json({ token });
});
// POST /api/super-admin/organizations
router.post('/organizations', auth(['super_admin']), async (req, res) => {
 try {
   const name = req.body.name?.trim();
   if (!name) {
     return res.status(400).json({ message: 'Organization name is required.' });
   }
   const existingOrg = await Organization.findOne({ name: name.toLowerCase() });
   if (existingOrg) {
     return res.status(400).json({ message: 'Organization name already exists.' });
   }
   const org = new Organization({ name });
   await org.save();
   res.status(201).json(org);
 } catch (err) {
   const isDuplicateName = err.code === 11000 && (err.keyPattern?.name || err.keyValue?.name || /name_1/.test(err.message));
   if (isDuplicateName) {
     return res.status(400).json({ message: 'Organization name already exists.' });
   }
   res.status(400).json({ message: err.message });
 }
});
// GET /api/super-admin/organizations
router.get('/organizations', auth(['super_admin']), async (req, res) => {
 const orgs = await Organization.find().sort({ createdAt: -1 });
 res.json(orgs);
});

// DELETE /api/super-admin/organizations/:id
router.delete('/organizations/:id', auth(['super_admin']), async (req, res) => {
 try {
   await Organization.findByIdAndDelete(req.params.id);
   res.json({ message: 'Deleted' });
 } catch (err) {
   res.status(400).json({ message: err.message });
 }
});
module.exports = router;
