import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  {
    imageId: {
      type: String,
      required: true,
      unique: true,
    },
    posterId: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    album: {
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

export default ImageSchema;
