import mongoose from 'mongoose';
import UserType from '../models/UserType.js';

const UserSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(UserType),
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    memberOfIncidentIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default UserSchema;
