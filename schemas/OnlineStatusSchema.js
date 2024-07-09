import mongoose from 'mongoose';
import OnlineStatusEnum from '../models/OnlineStatusEnum.js';

const OnlineStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    onlineStatus: {
      type: String,
      enum: Object.values(OnlineStatusEnum),
      required: true,
    },
    lastOnline: {
      type: Date,
      default: Date.now,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default OnlineStatusSchema;
