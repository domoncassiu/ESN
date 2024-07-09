import secrets from '../secrets.js';
import mongoose from 'mongoose';
import DatabaseError from '../exceptions/DatabaseError.js';
import AbstractDBClient from './AbstractDBClient.js';
import { getSchemaForType } from './SchemaMap.js';
import UserSchema from '../schemas/UserSchema.js';
import OnlineStatusSchema from '../schemas/OnlineStatusSchema.js';
import SafetyStatusSchema from '../schemas/SafetyStatusSchema.js';
import PublicMessageSchema from '../schemas/PublicMessageSchema.js';
import PrivateMessageSchema from '../schemas/PrivateMessageSchema.js';
import UserSocketSchema from '../schemas/UserSocketSchema.js';
import AnnouncementSchema from '../schemas/AnnouncementSchema.js';
import GroupMessageSchema from '../schemas/GroupMessageSchema.js';
import IncidentSchema from '../schemas/IncidentSchema.js';
import ResourceHelpSchema from '../schemas/ResourceHelpSchema.js';
import ResourceSchemaSchema from '../schemas/ResourceSchema.js';
import ShelterSchema from '../schemas/ShelterSchema.js';
import ShelterReviewSchema from '../schemas/ShelterReviewSchema.js';
import ImageSchema from '../schemas/ImageSchema.js';
import CommentSchema from '../schemas/CommentSchema.js';

class MongooseDBClient extends AbstractDBClient {
  static connectionString =
    'mongodb+srv://<username>:<password>@<uri>/<dbname>?retryWrites=true&w=majority';
  static client = null;
  static instance = null;
  static schemaDict = {
    User: UserSchema,
    OnlineStatus: OnlineStatusSchema,
    SafetyStatus: SafetyStatusSchema,
    PublicMessage: PublicMessageSchema,
    PrivateMessage: PrivateMessageSchema,
    UserSocket: UserSocketSchema,
    Announcement: AnnouncementSchema,
    GroupMessage: GroupMessageSchema,
    Incident: IncidentSchema,
    ResourceHelp: ResourceHelpSchema,
    Resource: ResourceSchemaSchema,
    Shelter: ShelterSchema,
    ShelterReview: ShelterReviewSchema,
    Image: ImageSchema,
    Comment: CommentSchema,
  };
  constructor() {
    super();
  }

  async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true,
        dbName: secrets.mongodbDbname,
      };
      MongooseDBClient.connectionString = MongooseDBClient.connectionString
        .replace('<username>', secrets.mongodbUsername)
        .replace('<password>', secrets.mongodbPassword)
        .replace('<uri>', secrets.mongodbConnectionUrl)
        .replace('<dbname>', secrets.mongodbDbname);
      const conn = mongoose
        .createConnection(MongooseDBClient.connectionString)
        .useDb(secrets.mongodbDbname);
      MongooseDBClient.client = conn;
      console.log(MongooseDBClient.connectionString);
      console.log('Mongo database connected.');
    } catch (err) {
      console.error(err.message);
      throw new DatabaseError();
    }
  }

  async close() {
    try {
      await MongooseDBClient.client.disconnect();
    } catch (err) {
      // Do nothing
    }
  }

  async create(type, data) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.create(data);
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  async update(type, filter, update, options) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.findOneAndUpdate(filter, update, options);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async updateMany(type, filter, update, options) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.updateMany(filter, update, options);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async read(type, filter, options = {}) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.findOne(filter, null, options);
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }
  async readByOuter(type, filter, options = {}) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );

      let query = model.findOne(filter);
      if (options.populate) {
        if (Array.isArray(options.populate)) {
          options.populate.forEach((populateOption) => {
            query = query.populate(populateOption);
          });
        } else {
          query = query.populate(options.populate);
        }
      }

      // 执行查询
      return await query;
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  async readAll(type, condition = {}, sort = {}) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.find(condition).sort(sort);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async readAllWithAggregate(type, aggregation) {
    let model = MongooseDBClient.client.model(
      type,
      MongooseDBClient.schemaDict[type],
    );
    const schema = getSchemaForType(type);
    return await model.aggregate(aggregation);
  }

  async readAllWithPagination(type, condition = {}, sort = {}, pageSize, page) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model
        .find(condition)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    } catch (error) {
      console.log(error);
      console.log(type);
      throw new DatabaseError();
    }
  }

  async delete(type, key, value) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      const deletedItem = await model.findOneAndDelete({ [key]: value });
      return deletedItem;
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async deleteMany(type, key, value) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      console.log(key, value);
      const schema = getSchemaForType(type);
      return await model.deleteMany({ [key]: value });
    } catch (error) {
      throw new DatabaseError();
    }
  }

  static getInstance() {
    if (MongooseDBClient.instance === null) {
      MongooseDBClient.instance = new MongooseDBClient();
    }
    return MongooseDBClient.instance;
  }

  async deleteAllTables() {
    throw new TypeError(
      'Cannot call method deleteAllTables() on production database.',
    );
  }

  async aggregate(type, pipeline) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      return await model.aggregate(pipeline);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async distinct(type, field) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      console.log(field);
      return await model.distinct(field);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async findField(type, field) {
    try {
      let model = MongooseDBClient.client.model(
        type,
        MongooseDBClient.schemaDict[type],
      );
      console.log(field);
      return await model.find({}, field);
    } catch (error) {
      throw new DatabaseError();
    }
  }
}

export default MongooseDBClient;
