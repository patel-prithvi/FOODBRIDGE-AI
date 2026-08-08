import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    foodType: {
      type: String,
      required: [true, 'Food type is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be greater than 0'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    dietaryInfo: {
      type: String,
      default: '',
      trim: true,
    },
    preparedAt: {
      type: Date,
    },
    pickupStart: {
      type: Date,
    },
    pickupEnd: {
      type: Date,
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'PENDING_ACCEPTANCE', 'MATCHED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'COMPLETED', 'EXPIRED'],
      default: 'AVAILABLE',
    },
    aiRisk: {
      type: Number,
      default: 50,
    },
    aiPriority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    aiScore: {
      type: Number,
      default: 80,
    },
    matchedReceiver: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
