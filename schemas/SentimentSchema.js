import mongoose from 'mongoose';

const SentimentSchema = new mongoose.Schema({
  magnitude: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

export default SentimentSchema;
