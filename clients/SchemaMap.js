// Import necessary modules and schemas
import mongoose from 'mongoose';
import SchemaEnum from './SchemaEnum.js';
import UserSchema from '../schemas/UserSchema.js';
import PublicMessageSchema from '../schemas/PublicMessageSchema.js';
import OnlineStatusSchema from '../schemas/OnlineStatusSchema.js';
import PrivateMessageSchema from '../schemas/PrivateMessageSchema.js';
import UserSocketSchema from '../schemas/UserSocketSchema.js';
import SafetyStatusSchema from '../schemas/SafetyStatusSchema.js';
import ResourceHelpSchema from '../schemas/ResourceHelpSchema.js';
import ResourceSchema from '../schemas/ResourceSchema.js';
import AnnouncementSchema from '../schemas/AnnouncementSchema.js';
import GroupMessageSchema from '../schemas/GroupMessageSchema.js';
import IncidentSchema from '../schemas/IncidentSchema.js';
import ShelterSchema from '../schemas/ShelterSchema.js';
import ShelterReviewSchema from '../schemas/ShelterReviewSchema.js';
import ImageSchema from '../schemas/ImageSchema.js';
import CommentSchema from '../schemas/CommentSchema.js';

// Define a function or an object to map enum values to Mongoose models
const schemaMap = {
  [SchemaEnum.USER]: mongoose.model('users', UserSchema),
  [SchemaEnum.RESOURCEHELPSCHEMA]: mongoose.model(
    'resourceHelp',
    ResourceHelpSchema,
  ),
  [SchemaEnum.RESOURCE]: mongoose.model('resource', ResourceSchema),
  [SchemaEnum.ONLINESTATUS]: mongoose.model(
    'onlineStatuses',
    OnlineStatusSchema,
  ),
  [SchemaEnum.PUBLICMESSAGE]: mongoose.model(
    'publicMessages',
    PublicMessageSchema,
  ),
  [SchemaEnum.PRIVATEMESSAGE]: mongoose.model(
    'privateMessages',
    PrivateMessageSchema,
  ),
  [SchemaEnum.GROUPMESSAGE]: mongoose.model(
    'groupmessages',
    GroupMessageSchema,
  ),
  [SchemaEnum.INCIDENT]: mongoose.model('incidents', IncidentSchema),
  [SchemaEnum.USERSOCKET]: mongoose.model('usersockets', UserSocketSchema),
  [SchemaEnum.SAFETYSTATUS]: mongoose.model(
    'safetyStatuses',
    SafetyStatusSchema,
  ),
  [SchemaEnum.ANNOUNCEMENT]: mongoose.model(
    'announcements',
    AnnouncementSchema,
  ),
  [SchemaEnum.SHELTER]: mongoose.model('shelters', ShelterSchema),
  [SchemaEnum.SHELTERREVIEW]: mongoose.model(
    'shelterReviews',
    ShelterReviewSchema,
  ),
  [SchemaEnum.IMAGE]: mongoose.model('images', ImageSchema),
  [SchemaEnum.COMMENT]: mongoose.model('comments', CommentSchema),
};

function getSchemaForType(type) {
  const schema = schemaMap[type];
  if (!schema) {
    throw new Error('No schema specified.');
  }
  return schema;
}

export { getSchemaForType };
