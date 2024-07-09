import mongoose from 'mongoose';

const ResourceHelpSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'resource',
      required: true,
    },
    helper: {
      type: String,
      required: true,
    },
    quantityOffered: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default ResourceHelpSchema;
