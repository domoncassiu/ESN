import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    announcementId: {
      type: String,
      required: true,
    },
    userId: {
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
  { timestamps: true },
);

export default AnnouncementSchema;
