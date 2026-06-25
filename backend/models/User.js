const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 role: { type: String, enum: ['org_admin', 'end_user'], required: true },
 organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
 createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);