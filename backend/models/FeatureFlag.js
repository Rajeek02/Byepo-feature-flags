const mongoose = require('mongoose');
const flagSchema = new mongoose.Schema({
 feature_key: { type: String, required: true },
 enabled: { type: Boolean, default: false },
 organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
 createdAt: { type: Date, default: Date.now }
});
// Unique per organization
flagSchema.index({ feature_key: 1, organization: 1 }, { unique: true });
module.exports = mongoose.model('FeatureFlag', flagSchema);
