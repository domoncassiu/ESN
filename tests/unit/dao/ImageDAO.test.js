import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import ImageDAO from '../../../dao/ImageDAO';
import SchemaEnum from '../../../clients/SchemaEnum';

let imageDao = new ImageDAO(TestDBClient.getInstance());
const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return {
      imageId: 'imgid-1',
      posterId: 'id-1',
      imageUrl: 'someurl',
      albumName: 'album1',
    };
  });
describe('single read', () => {
  test('single image return: Nominal Scenario', async () => {
    let result = await imageDao.read({});

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readMock).toBeCalledTimes(1);
    expect(result.imageUrl).toStrictEqual('someurl');
  });
});

describe('Fetch Many images with pagination', () => {
  test('Return all images in album: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [
          {
            imageId: 'imgid-1',
            posterId: 'id-1',
            imageUrl: 'someurl',
            albumName: 'album1',
          },
        ];
      });
    let result = await imageDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].albumName).toStrictEqual('album1');
  });
});

describe('Create Single image entry', () => {
  test('Return created entry: Nominal Scenario', async () => {
    let expectedEntry = {
      imageId: 'imgid-1',
      posterId: 'id-1',
      imageUrl: 'someurl',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedEntry;
      });
    let result = await imageDao.create(expectedEntry);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result.posterId).toStrictEqual('id-1');
  });
});

describe('Delete singular image', () => {
  test('delete single iamge return delete count: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 1 };
      });
    let deleteResult = await imageDao.delete('imgid-1');

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(1);
  });
});

describe('Delete many images (for testing)', () => {
  test('delete many images return count delete: Nominal Scenario', async () => {
    const deleteManyMock = jest
      .spyOn(TestDBClient.prototype, 'deleteMany')
      .mockImplementation(() => {
        return { deletedCount: 100 };
      });

    let deleteResult = await imageDao.deleteMany('album1');
    expect(deleteManyMock).toBeCalledTimes(1);
  });
});
