const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FeatureFlag = require('../models/FeatureFlag');
const Organization = require('../models/Organization');
const { auth } = require('../middleware/auth');
// POST /api/org-admin/signup
router.post('/signup', async (req, res) => {
 try {
 const { email, password, organizationId } = req.body;
 if (!email?.trim() || !password?.trim() || !organizationId) {
   return res.status(400).json({ message: 'Email, password and organization are required' });
 }
 if (!mongoose.Types.ObjectId.isValid(organizationId)) {
   return res.status(400).json({ message: 'Please select a valid organization' });
 }
 const org = await Organization.findById(organizationId);
 if (!org) return res.status(404).json({ message: 'Organization not found' });
 const existingAdmin = await User.findOne({ role: 'org_admin', organization: organizationId });
 if (existingAdmin) {
   return res.status(400).json({ message: 'Organization already has an admin' });
 }
 const hashed = await bcrypt.hash(password, 10);
 const user = new User({ email, password: hashed, role: 'org_admin', organization: organizationId });
 await user.save();
 res.status(201).json({ message: 'Signup successful' });
 } catch (err) {
   if (err.code === 11000) {
     return res.status(400).json({ message: 'Email is already registered' });
   }
   res.status(400).json({ message: err.message });
 }
});
// GET /api/org-admin/organizations
router.get('/organizations', async (req, res) => {
 try {
   const allOrgs = await Organization.find({}, 'name _id');
   const occupiedOrgIds = await User.find({ role: 'org_admin' }, 'organization').then(users =>
     users.map(u => u.organization.toString())
   );
   const availableOrgs = allOrgs.filter(org => !occupiedOrgIds.includes(org._id.toString()));
   res.json(availableOrgs);
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
});
// POST /api/org-admin/login
router.post('/login', async (req, res) => {
 try {
 const { email, password } = req.body;
 const user = await User.findOne({ email, role: 'org_admin' });
 if (!user) return res.status(401).json({ message: 'Invalid credentials' });
 const valid = await bcrypt.compare(password, user.password);
 if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
 const token = jwt.sign(
 { id: user._id, role: 'org_admin', orgId: user.organization },
 process.env.JWT_SECRET, { expiresIn: '8h' }
 );
 res.json({ token });
 } catch (err) { res.status(400).json({ message: err.message }); }
});
// GET /api/org-admin/flags
router.get('/flags', auth(['org_admin']), async (req, res) => {
 const flags = await FeatureFlag.find({ organization: req.user.orgId });
 res.json(flags);
});
// POST /api/org-admin/flags
router.post('/flags', auth(['org_admin']), async (req, res) => {
 try {
 const flag = new FeatureFlag({
 feature_key: req.body.feature_key,
 enabled: req.body.enabled ?? false,
 organization: req.user.orgId
 });
 await flag.save();
 res.status(201).json(flag);
 } catch (err) {
   if (err.code === 11000) {
     return res.status(400).json({ message: 'Feature key already exists for this organization' });
   }
   res.status(400).json({ message: err.message });
 }
});
// PUT /api/org-admin/flags/:id
router.put('/flags/:id', auth(['org_admin']), async (req, res) => {
  try {
 const flag = await FeatureFlag.findOneAndUpdate(
 { _id: req.params.id, organization: req.user.orgId },
 { enabled: req.body.enabled },
 { new: true }
 );
 if (!flag) return res.status(404).json({ message: 'Flag not found' });
 res.json(flag);
 } catch (err) { res.status(400).json({ message: err.message }); }
});
// DELETE /api/org-admin/flags/:id
router.delete('/flags/:id', auth(['org_admin']), async (req, res) => {
 try {
 await FeatureFlag.findOneAndDelete({ _id: req.params.id, organization: req.user.orgId });
 res.json({ message: 'Deleted' });
 } catch (err) { res.status(400).json({ message: err.message }); }
});
module.exports = router;
