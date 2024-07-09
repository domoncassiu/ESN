import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    additionalInfo: String,
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default ResourceSchema;
