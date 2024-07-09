import { expect, jest, test } from '@jest/globals';
import SafetyStatus from '../../../models/SafetyStatus';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import ImageController from '../../../controllers/ImageController';
import TestDBClient from '../../../clients/TestDBClient';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import Image from '../../../models/Image';
import NotFoundError from '../../../exceptions/NotFoundError';
import InternalServerError from '../../../exceptions/InternalServerError';
import DatabaseError from '../../../exceptions/DatabaseError';
import ImageDeleteError from '../../../exceptions/ImageDeleteError';
import InvalidAlbumError from '../../../exceptions/InvalidAlbumError';
import AuthenticatedUser from '../../../models/AuthenticatedUser';

let imageController = new ImageController(TestDBClient.getInstance());

// Mock functions
let insertThisImage = jest
  .spyOn(Image.prototype, 'insertThisImage')
  .mockReturnValue(undefined);

let onNewImage = jest
  .spyOn(WebsocketSubsystem.prototype, 'onNewImage')
  .mockImplementation(() => {
    console.log('mocked function');
  });

let fetchAllImagesInAlbum = jest
  .spyOn(Image, 'fetchAllImagesInAlbum')
  .mockImplementation(() => [
    {
      imageId: 'image1.png',
      poster: 'user1',
      imageUrl: 'https://someurl.com',
      album: 'Community',
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

// let deleteThisImage = jest
//   .spyOn(Image, 'deleteThisImage')
//   .mockResolvedValue();

State.getInstance().mode = ModeEnum.PRODUCTION;
State.getInstance().websocketSubsystem = new WebsocketSubsystem();

describe('Testing controller: ImageController', () => {
  test('Add new Image: addImageToAlbum Nominal Scenario', async () => {
    // const mockFetchOneImage = jest.fn().mockReturnValue({imageId: 'image1.png'});
    // Image.fetchOneImage = mockFetchOneImage;
    let newImage = await imageController.addImageToAlbum(
      'image1.png',
      'user1',
      'someurl.com',
      'Community',
    );

    expect(onNewImage).toBeCalledTimes(1);
    expect(insertThisImage).toBeCalledTimes(1);
    expect(newImage.posterId).toStrictEqual('user1');
    expect(newImage.imageId).toStrictEqual('image1.png');
  });
  test('addImageToAlbum: someDBError_ExpectInternalServerError', async () => {
    let insertThisImage = jest
      .spyOn(Image.prototype, 'insertThisImage')
      .mockRejectedValue(DatabaseError);
    expect(insertThisImage).toBeCalledTimes(1);
    await expect(() =>
      imageController.addImageToAlbum(
        'image1.png',
        'user1',
        'someurl.com',
        'Community',
      ),
    ).rejects.toThrow(InternalServerError);
  });
});

describe('Testing controller: ImageController', () => {
  test('Fetch all images for album: fetchAllImagesInAlbum', async () => {
    let images = await imageController.fetchAllImagesInAlbum(
      1,
      500,
      true,
      'Community',
    );
    expect(fetchAllImagesInAlbum).toBeCalledTimes(1);
    expect(images).toStrictEqual([
      {
        imageId: 'image1.png',
        poster: 'user1',
        imageUrl: 'https://someurl.com',
        album: 'Community',
        timestamp: 1711164262197,
      },
    ]);
  });
  test('Fetch all comments for image: someDbError_ExpectInternalServerError', async () => {
    let fetchAllImagesInAlbum = jest
      .spyOn(Image, 'fetchAllImagesInAlbum')
      .mockRejectedValueOnce(new DatabaseError());
    expect(fetchAllImagesInAlbum).toBeCalledTimes(1);
    await expect(() =>
      imageController.fetchAllImagesInAlbum(1, 500, true, 'Community'),
    ).rejects.toThrow(InternalServerError);
  });
});
describe('Testing controller: ImageController', () => {
  test('Fetch one image: fetchSingleImage', async () => {
    const mockFetchOneImage = jest.fn().mockReturnValue([
      {
        imageId: 'image1.png',
        posterId: 'user1',
        imageUrl: 'https://someurl.com',
        album: 'Community',
        timestamp: 1711164262197,
      },
    ]);
    Image.fetchOneImage = mockFetchOneImage;
    let image = await imageController.fetchSingleImage(
      'Community',
      'image1.png',
    );
    expect(Image.fetchOneImage).toBeCalledTimes(1);
    expect(image.poster).toStrictEqual(undefined);
  });
  test('Fetch one image: DNE_ExpectNotFound', async () => {
    const mockFetchOneImage = jest.fn().mockReturnValue(null);
    Image.fetchOneImage = mockFetchOneImage;
    await expect(() =>
      imageController.fetchSingleImage('Community', 'image1.png'),
    ).rejects.toThrow(NotFoundError);
    expect(Image.fetchOneImage).toBeCalledTimes(1);
  });
  test('Fetch one image: someDBError_ExpectInternalServerError', async () => {
    const mockFetchOneImage = jest.fn().mockRejectedValue(DatabaseError);
    Image.fetchOneImage = mockFetchOneImage;
    await expect(() =>
      imageController.fetchSingleImage('Community', 'image1.png'),
    ).rejects.toThrow(InternalServerError);
    expect(Image.fetchOneImage).toBeCalledTimes(1);
  });
});
describe('Testing controller: ImageController', () => {
  test('Delete one image: deleteImageEntryFromDb_MatchingPoster_DeleteOK', async () => {
    const mockFetchOneImage = jest.fn().mockReturnValue({ posterId: 'user1' });
    Image.fetchOneImage = mockFetchOneImage;
    let deleteThisImage = jest
      .spyOn(Image.prototype, 'deleteThisImage')
      .mockResolvedValueOnce();
    await imageController.deleteImageEntryFromDb(
      'user1',
      'Community',
      'image1.png',
    );
    expect(Image.fetchOneImage).toBeCalledTimes(1);
    expect(deleteThisImage).toBeCalledTimes(1);
  });
  test('Delete one imag: UserDoesntMatch_ExpectImageDeleteError', async () => {
    const mockFetchOneImage = jest
      .fn()
      .mockReturnValue({ poster: 'incorrectUser' });
    Image.fetchOneImage = mockFetchOneImage;
    let deleteThisImage = jest
      .spyOn(Image.prototype, 'deleteThisImage')
      .mockResolvedValue();
    await expect(() =>
      imageController.deleteImageEntryFromDb(
        'user1',
        'Community',
        'image1.png',
      ),
    ).rejects.toThrow(ImageDeleteError);
    expect(Image.fetchOneImage).toBeCalledTimes(1);
  });
  test('Delete one imag: someDBError_ExpectInternalServerError', async () => {
    const mockFetchOneImage = jest.fn().mockReturnValue({ posterId: 'user1' });
    Image.fetchOneImage = mockFetchOneImage;
    let deleteThisImage = jest
      .spyOn(Image.prototype, 'deleteThisImage')
      .mockRejectedValue(DatabaseError);
    await expect(() =>
      imageController.deleteImageEntryFromDb(
        'user1',
        'Community',
        'image1.png',
      ),
    ).rejects.toThrow(InternalServerError);
    expect(Image.fetchOneImage).toBeCalledTimes(1);
  });
});
