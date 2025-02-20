// ad.model.js
const mongoose = require('mongoose');

const JoinRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { _id: false });

const AdSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    domain: String,
    title: String,
    description: String,
    // Store join requests as an array of objects with a user and status.
    joinRequests: { type: [JoinRequestSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ad', AdSchema);