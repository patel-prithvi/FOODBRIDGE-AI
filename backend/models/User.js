import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const locationSchema = new mongoose.Schema(
  {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['DONOR', 'RECEIVER'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password field by default in queries
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    location: {
      type: locationSchema,
      required: [true, 'Location is required']
    },

    // DONOR Specific Fields
    name: {
      type: String,
      required: function () {
        return this.role === 'DONOR';
      },
      trim: true
    },

    // Common Organization Name (Required for both or DONOR/RECEIVER)
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true
    },

    // RECEIVER Specific Fields
    contactPerson: {
      type: String,
      required: function () {
        return this.role === 'RECEIVER';
      },
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    capacity: {
      type: Number,
      default: 150
    },
    dietaryNeeds: {
      type: [String],
      default: ['Vegetarian', 'Vegan']
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
