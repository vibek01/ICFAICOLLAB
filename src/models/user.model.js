// user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,  // ensure consistency
      trim: true
    },
    email: {
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    domains: { 
      type: [String]  
    },
    skills: {
      type: [String]  
    },
    profilePic: { 
      type: String    
    },
    bio: {
      type: String
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user'
    }
  }, 
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);