import mongoose from 'mongoose';

const ShelterReviewSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    ratings: {
      overall: { type: Number, required: true, min: 0, max: 5 },
      cleanliness: { type: Number, required: true, min: 0, max: 5 },
      amenities: { type: Number, required: true, min: 0, max: 5 },
      capacity: { type: Number, required: true, min: 0, max: 5 },
      communication: { type: Number, required: true, min: 0, max: 5 },
    },
    reviewer: {
      type: String,
      required: true,
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
  {
    timestamps: true,
  },
);

export default ShelterReviewSchema;
