import mongoose from 'mongoose';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';

const SafetyStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    safetyStatus: {
      type: String,
      enum: Object.values(SafetyStatusEnum),
      default: SafetyStatusEnum.UNDEFINED,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default SafetyStatusSchema;
