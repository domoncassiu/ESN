import mongoose from 'mongoose';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';

const PublicMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    safetyStatus: {
      type: String,
      enum: Object.values(SafetyStatusEnum),
      default: SafetyStatusEnum.UNDEFINED,
    },
    message: {
      type: String,
      required: true,
      index: 'text',
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default PublicMessageSchema;
