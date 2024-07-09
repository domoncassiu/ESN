import { expect, jest, test } from '@jest/globals';
import SafetyStatus from '../../../models/SafetyStatus';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import CommentController from '../../../controllers/CommentController';
import TestDBClient from '../../../clients/TestDBClient';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import Comment from '../../../models/Comment';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import Image from '../../../models/Image';
import NotFoundError from '../../../exceptions/NotFoundError';
import InternalServerError from '../../../exceptions/InternalServerError';
import DatabaseError from '../../../exceptions/DatabaseError';
import AuthenticatedUser from '../../../models/AuthenticatedUser';

let commentController = new CommentController(TestDBClient.getInstance());

// Mock functions
let fetchMostRecentSafetyStatus = jest
  .spyOn(SafetyStatus, 'fetchMostRecentSafetyStatus')
  .mockReturnValue(SafetyStatusEnum.OK);

let insertThisComment = jest
  .spyOn(Comment.prototype, 'insertThisComment')
  .mockReturnValue(undefined);

let sendNewComment = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendNewComment')
  .mockImplementation(() => {
    console.log('mocked function');
  });

let fetchAllCommentsForImage = jest
  .spyOn(Comment, 'fetchAllCommentsForImage')
  .mockImplementation(() => [
    {
      commentId: '1',
      posterId: '123',
      poster: 'user1',
      imageId: 'image1.png',
      safetyStatus: 'OK',
      comment: 'somecomment',
      timestamp: 1711164262197,
    },
  ]);
let getUserById = jest
  .spyOn(AuthenticatedUser, 'getUserById')
  .mockImplementation(() => [
    {
      username: 'mary',
    },
  ]);

let deleteAllCommentsFor = jest
  .spyOn(Comment, 'deleteAllCommentsFor')
  .mockResolvedValue();

State.getInstance().mode = ModeEnum.PRODUCTION;
State.getInstance().websocketSubsystem = new WebsocketSubsystem();

describe('Testing controller: CommentController', () => {
  test('Add new comment: addNewComment Nominal Scenario', async () => {
    const mockFetchOneImage = jest
      .fn()
      .mockReturnValue({ imageId: 'image1.png' });
    Image.fetchOneImage = mockFetchOneImage;
    let newComment = await commentController.addNewComment(
      'image1.png',
      '123',
      'user1',
      'someguy',
      'Community',
    );

    expect(fetchMostRecentSafetyStatus).toBeCalledTimes(1);
    expect(sendNewComment).toBeCalledTimes(1);
    expect(Image.fetchOneImage).toBeCalledTimes(1);
    expect(insertThisComment).toBeCalledTimes(1);
    expect(newComment.posterId).toStrictEqual('123');
    expect(newComment.imageId).toStrictEqual('image1.png');
  });
  test('Add new comment: No such Image; return NotFound', async () => {
    const mockFetchOneImage = jest.fn().mockReturnValue(null);
    Image.fetchOneImage = mockFetchOneImage;
    expect(fetchMostRecentSafetyStatus).toBeCalledTimes(1);
    await expect(() =>
      commentController.addNewComment(
        'image1.png',
        'user1',
        'someguy',
        'Community',
      ),
    ).rejects.toThrow(NotFoundError);
    expect(Image.fetchOneImage).toBeCalledTimes(1);
  });
  test('Add new comment: someDBError_ExpectInternalServerError', async () => {
    const mockFetchOneImage = jest.fn().mockReturnValue([
      {
        commentId: '1',
        poster: 'user1',
        imageId: 'image1.png',
        safetyStatus: 'OK',
        comment: 'somecomment',
        timestamp: 1711164262197,
      },
    ]);
    Image.fetchOneImage = mockFetchOneImage;
    let insertThisComment = jest
      .spyOn(Comment.prototype, 'insertThisComment')
      .mockRejectedValueOnce(new DatabaseError());
    expect(insertThisComment).toBeCalledTimes(1);
    await expect(() =>
      commentController.addNewComment(
        'image1.png',
        'user1',
        'somecomment',
        'Community',
      ),
    ).rejects.toThrow(InternalServerError);
    expect(Image.fetchOneImage).toBeCalledTimes(1);
  });
});

describe('Testing controller: CommentController', () => {
  test('Fetch all comments for image: fetchAllCommentsForImage', async () => {
    let comments = await commentController.fetchAllCommentsForImage(
      1,
      500,
      true,
      'image1.png',
    );
    expect(fetchAllCommentsForImage).toBeCalledTimes(1);
    expect(comments[0].posterId).toStrictEqual('123');
    expect(comments[0].comment).toStrictEqual('somecomment');
  });
  test('Fetch all comments for image: someDbError_ExpectInternalServerError', async () => {
    let fetchAllCommentsForImage = jest
      .spyOn(Comment, 'fetchAllCommentsForImage')
      .mockRejectedValueOnce(new DatabaseError());
    expect(fetchAllCommentsForImage).toBeCalledTimes(1);
    await expect(() =>
      commentController.fetchAllCommentsForImage(1, 500, true, 'image1.png'),
    ).rejects.toThrow(InternalServerError);
  });
});
describe('Testing controller: CommentController', () => {
  test('Delete all comments for image: deleteAllCommentsForImage', async () => {
    await commentController.deleteAllCommentsFor('image1.png');
    expect(deleteAllCommentsFor).toBeCalledTimes(1);
    expect(deleteAllCommentsFor).toBeCalledWith({}, 'image1.png');
  });
  test('Delete all comments for image: someDBError_ExpectInternalServerError', async () => {
    let deleteAllCommentsFor = jest
      .spyOn(Comment, 'deleteAllCommentsFor')
      .mockRejectedValueOnce(new DatabaseError());
    expect(deleteAllCommentsFor).toBeCalledTimes(1);
    await expect(() =>
      commentController.deleteAllCommentsFor('image1.png'),
    ).rejects.toThrow(InternalServerError);
  });
});
