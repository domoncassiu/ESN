import mongoose from 'mongoose';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';

const CommentSchema = new mongoose.Schema(
  {
    commentId: {
      type: String,
      required: true,
      unique: true,
    },
    posterId: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    safetyStatus: {
      type: String,
      enum: Object.values(SafetyStatusEnum),
      default: SafetyStatusEnum.UNDEFINED,
    },
    comment: {
      type: String,
      required: true,
    },
    albumName: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default CommentSchema;
