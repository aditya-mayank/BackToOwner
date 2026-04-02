import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    accountStatus: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active'
    },
    profilePicUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Explicitly creating an index on the email field
userSchema.index({ email: 1 });

// Pre-save hook: The instruction specified to NOT re-hash the password, 
// and only trim the name field.
userSchema.pre('save', function (next) {
  if (this.isModified('name') && this.name) {
    this.name = this.name.trim();
  }
  next();
});

// Instance method to safely return user document without the passwordHash
userSchema.methods.toSafeObject = function () {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

// Static method to easily find a user by email (case-insensitive)
userSchema.statics.findByEmail = function (email) {
  // Use a RegExp with 'i' flag to ensure case-insensitivity
  return this.findOne({ email: new RegExp(`^${email}$`, 'i') });
};

const User = mongoose.model('User', userSchema);

export default User;
