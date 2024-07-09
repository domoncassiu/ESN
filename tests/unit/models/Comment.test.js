import { expect, jest, test } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDbClient from '../../../bin/State';
import CommentDAO from '../../../dao/CommentDAO';
import Comment from '../../../models/Comment';

let readAllWithPagination = jest
  .spyOn(CommentDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        commentId: '1',
        poster: 'user1',
        imageId: 'image1.png',
        safetyStatus: 'OK',
        comment: 'somecomment',
        timestamp: 1711164262197,
      },
    ];
  });

let create = jest.spyOn(CommentDAO.prototype, 'create').mockResolvedValue();

let deleteMany = jest
  .spyOn(CommentDAO.prototype, 'deleteMany')
  .mockResolvedValue();

describe('Fetch All Comments For Image', () => {
  test('Return all comments for image: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Comment.fetchAllCommentsForImage(
      dbClient,
      1,
      500,
      true,
      { imageId: 'image1.png' },
    );
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        commentId: '1',
        poster: 'user1',
        imageId: 'image1.png',
        safetyStatus: 'OK',
        comment: 'somecomment',
        timestamp: 1711164262197,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let readAllWithPagination = jest
      .spyOn(CommentDAO.prototype, 'readAllWithPagination')
      .mockRejectedValueOnce(new DatabaseError());
    expect(readAllWithPagination).toBeCalledTimes(1);
    await expect(() =>
      Comment.fetchAllCommentsForImage(dbClient, 1, 500, true, {
        imageId: 'image1.png',
      }),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Insert New Comment', () => {
  test('Insert single Comment: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testComment = new Comment(
      dbClient,
      '1',
      'poster1',
      'image1.png',
      'OK',
      'somecomment',
      Date.now(),
    );
    await testComment.insertThisComment();

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith(testComment);
  });

  test('DAO object ran into database related error on creation', async () => {
    const dbClient = TestDbClient.getInstance();
    const testComment = new Comment(
      dbClient,
      '1',
      'poster1',
      'image1.png',
      'OK',
      'somecomment',
      Date.now(),
    );
    let create = jest
      .spyOn(CommentDAO.prototype, 'create')
      .mockRejectedValueOnce(new DatabaseError());
    expect(create).toBeCalledTimes(1);
    await expect(() => testComment.insertThisComment()).rejects.toThrow(
      DatabaseError,
    );
  });
});

describe('Delete All Comments For Image', () => {
  test('Delete all comments: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();

    await Comment.deleteAllCommentsFor(dbClient, 'image1.png');
    expect(deleteMany).toBeCalledTimes(1);
    expect(deleteMany).toBeCalledWith('image1.png');
  });

  test('DAO ran into some db error duing deletion', async () => {
    const dbClient = TestDbClient.getInstance();
    let deleteMany = jest
      .spyOn(CommentDAO.prototype, 'deleteMany')
      .mockRejectedValueOnce(new DatabaseError());
    expect(deleteMany).toBeCalledTimes(1);
    await expect(() =>
      Comment.deleteAllCommentsFor(dbClient, 'image1.png'),
    ).rejects.toThrow(DatabaseError);
  });
});
