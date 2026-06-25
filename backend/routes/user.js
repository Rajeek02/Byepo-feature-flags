const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const FeatureFlag = require('../models/FeatureFlag');
const Organization = require('../models/Organization');
const User = require('../models/User');
// POST /api/user/check-feature
router.post('/check-feature', async (req, res) => {
 try {
 const { organizationId, feature_key } = req.body;
 if (!organizationId || !feature_key)
 return res.status(400).json({ message: 'organizationId and feature_key required' });
 const flag = await FeatureFlag.findOne({ organization: organizationId, feature_key });
 if (!flag) return res.json({ enabled: false, message: 'Feature not found' });
 res.json({ enabled: flag.enabled, feature_key: flag.feature_key });
 } catch (err) { res.status(500).json({ message: err.message }); }
});
// GET /api/user/organizations - returns all organizations
router.get('/organizations', async (req, res) => {
 try {
   const allOrgs = await Organization.find({}, 'name _id');
   res.json(allOrgs);
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
});
// GET /api/user/organizations/:id/flags
router.get('/organizations/:id/flags', async (req, res) => {
 try {
   const { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(400).json({ message: 'Invalid organization id' });
   }
   const org = await Organization.findById(id);
   if (!org) return res.status(404).json({ message: 'Organization not found' });
   const flags = await FeatureFlag.find({ organization: id }, 'feature_key enabled');
   res.json(flags);
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
});
module.exports = router;