// project.model.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  domain: String,
  fileUrl: String,  // Uploaded file URL
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);