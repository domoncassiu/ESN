import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';
import mongoose from 'mongoose';

class ResourceDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.RESOURCE,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  async create(resource) {
    return this.dbClient.create(SchemaEnum.RESOURCE, resource);
  }

  async delete(resource, resourceId) {
    return this.dbClient.delete(SchemaEnum.RESOURCE, resource, resourceId);
  }

  // async readById(resourceId) {
  //     return this.dbClient.aggregate(SchemaEnum.RESOURCE, { _id: resourceId } , {
  //         populate: 'relatedFieldName'
  //     });
  // }

  async readById(resourceId) {
    const aggregationPipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(resourceId), // 确保正确匹配 _id 字段
        },
      },
      {
        $lookup: {
          from: 'resourcehelps',
          localField: '_id',
          foreignField: 'resource',
          as: 'resourceHelps',
        },
      },
    ];

    return this.dbClient.aggregate(SchemaEnum.RESOURCE, aggregationPipeline);
  }
}
export default ResourceDAO;
