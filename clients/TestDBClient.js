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
import ImageSchema from '../schemas/ImageSchema.js';
import CommentSchema from '../schemas/CommentSchema.js';
import ShelterSchema from '../schemas/ShelterSchema.js';
import ShelterReviewSchema from '../schemas/ShelterReviewSchema.js';
import GroupMessageSchema from '../schemas/GroupMessageSchema.js';
import IncidentSchema from '../schemas/IncidentSchema.js';

class TestDBClient extends AbstractDBClient {
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
    Image: ImageSchema,
    Comment: CommentSchema,
    Shelter: ShelterSchema,
    ShelterReview: ShelterReviewSchema,
  };
  constructor() {
    super();
  }

  async connect() {
    try {
      TestDBClient.connectionString = TestDBClient.connectionString
        .replace('<username>', secrets.mongodbUsername)
        .replace('<password>', secrets.mongodbPassword)
        .replace('<uri>', secrets.mongodbConnectionUrl)
        .replace('<dbname>', secrets.testDbname);
      const conn = mongoose
        .createConnection(TestDBClient.connectionString)
        .useDb(secrets.testDbname);
      TestDBClient.client = conn;
      console.log(TestDBClient.connectionString);
      console.log('Test database connected.');
    } catch (err) {
      console.error(err.message);
      throw new DatabaseError();
    }
  }

  async close() {
    try {
      await mongoose.disconnect();
      console.log('Test database disconnected.');
    } catch (err) {
      // Do nothing
    }
  }

  async create(type, data) {
    try {
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.create(data);
    } catch (err) {
      console.log('Test DB Client: ', err);
      throw new DatabaseError();
    }
  }

  async update(type, filter, update, options) {
    try {
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.findOneAndUpdate(filter, update, options);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async updateMany(type, filter, update, options) {
    try {
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.updateMany(filter, update, options);
    } catch (error) {
      console.error(error);
      throw new DatabaseError();
    }
  }

  async read(type, filter, options = {}) {
    try {
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.findOne(filter, null, options);
    } catch (error) {
      console.log('what??', error);
      throw new DatabaseError();
    }
  }

  async readAll(type, condition = {}, sort = {}) {
    try {
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.find(condition).sort(sort);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async readAllWithAggregate(type, aggregation) {
    let model = TestDBClient.client.model(type, TestDBClient.schemaDict[type]);
    const schema = getSchemaForType(type);
    return await model.aggregate(aggregation);
  }

  async readAllWithPagination(type, condition = {}, sort = {}, pageSize, page) {
    try {
      console.log('weeee', type);
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model
        .find(condition)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    } catch (error) {
      console.error(error);
      throw new DatabaseError();
    }
  }

  async delete(type, key, value) {
    try {
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      console.log(key, value);
      const schema = getSchemaForType(type);
      const deletedItem = await model.findOneAndDelete({ [key]: value });
      return deletedItem;
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }

  async deleteAll(type) {
    try {
      let model = TestDBClient.client.model(
        type,
        TestDBClient.schemaDict[type],
      );
      const schema = getSchemaForType(type);
      return await model.deleteMany({});
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

  static getInstance() {
    if (TestDBClient.instance === null) {
      TestDBClient.instance = new TestDBClient();
    }
    return TestDBClient.instance;
  }
}

export default TestDBClient;
