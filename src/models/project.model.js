// project.model.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    domain: { type: String, required: true },
    fileUrl: { type: String }, // Uploaded file URL
    projectLinks: { type: [String], default: [] }, // Array of project link URLs
    teamMembers: { type: [String], default: [] },  // Array of team member names
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);