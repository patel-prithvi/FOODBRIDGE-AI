import mongoose from 'mongoose';

const foodRequestSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    dietaryInformation: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'FULFILLED', 'CANCELLED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

const FoodRequest = mongoose.model('FoodRequest', foodRequestSchema);

export default FoodRequest;
