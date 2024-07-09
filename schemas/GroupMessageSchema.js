import mongoose from 'mongoose';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';
import SentimentSchema from './SentimentSchema.js';

const GroupMessageSchema = new mongoose.Schema(
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
    incidentId: {
      type: String,
      required: true,
    },
    sentiment: {
      type: SentimentSchema,
      required: true,
      default: {
        magnitude: 0.0,
        score: 0.0,
      },
    },
  },
  { timestamps: true },
);

export default GroupMessageSchema;
