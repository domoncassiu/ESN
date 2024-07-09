import mongoose from 'mongoose';
import IncidentStatusEnum from '../models/IncidentStatusEnum.js';

const IncidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: 'text',
    },
    event: {
      type: String,
      required: true,
      index: 'text',
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    moderatorUserId: {
      type: String,
      required: true,
      default: IncidentStatusEnum.ARCHIVED,
    },
    incidentStatus: {
      type: String,
      enum: Object.values(IncidentStatusEnum),
      default: IncidentStatusEnum.ACTIVE,
    },
    membersList: {
      type: [String],
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default IncidentSchema;
