import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import CommentDAO from '../../../dao/CommentDAO';
import SchemaEnum from '../../../clients/SchemaEnum';

//const mockReadPagination = jest.fn().mockResolvedValue("a");
//jest.mock('../../../clients/TestDBClient');
const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return { comment: 'somecomment', posterId: 'mary' };
  });
// jest.mock('../../../clients/TestDBClient', () => {
//   return jest.fn().mockImplementation(() => {
//     return {readAllWithPagination: mockReadPagination};
//   });
// });
beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  //TestDBClient.mockClear();
});
describe('single read', () => {
  test('single comment: Nominal Scenario', async () => {
    // TestDBClient.readAllWithPagination.mockResolvedValue("a");
    let commentDao = new CommentDAO(TestDBClient.getInstance());
    // Call the function
    let comment = await commentDao.read({});

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readMock).toBeCalledTimes(1);
    expect(comment).toStrictEqual({ comment: 'somecomment', posterId: 'mary' });
  });
  test('Comments DB Error', async () => {
    const readMock = jest
      .spyOn(TestDBClient.prototype, 'read')
      .mockRejectedValueOnce(new DatabaseError());
    let commentDao = new CommentDAO(TestDBClient.getInstance());
    expect(readMock).toBeCalledTimes(1);
    await expect(() => commentDao.read({})).rejects.toThrow(DatabaseError);
  });
});

describe('Fetch Comments', () => {
  test('Return all comments: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ comment: 'somecomment', posterId: 'id1' }];
      });

    let commentDao = new CommentDAO(TestDBClient.getInstance());
    // Call the function
    let commentList = await commentDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(commentList[0]).toStrictEqual({
      comment: 'somecomment',
      posterId: 'id1',
    });
  });
});

describe('Create Single Comment', () => {
  test('Return created comment: Nominal Scenario', async () => {
    let expectedComment = {
      commentId: 'cm-1',
      posterId: 'id-1',
      imageId: 'imgid-1',
      comment: 'comment',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedComment;
      });
    let commentDao = new CommentDAO(TestDBClient.getInstance());
    // Call the function
    let createdComment = await commentDao.create(expectedComment);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(createdComment).toStrictEqual(expectedComment);
  });
});

describe('Delete many comments', () => {
  test('delete all comments on image: Nominal Scenario', async () => {
    const deleteManyMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 4 };
      });
    let commentDao = new CommentDAO(TestDBClient.getInstance());
    // Call the function
    let deleteResult = await commentDao.deleteMany('imgid-1');

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(deleteManyMock).toBeCalledTimes(1);
    expect(deleteResult).toStrictEqual({ deletedCount: 4 });
  });
});
