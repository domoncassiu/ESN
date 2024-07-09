import { expect, jest, test } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDbClient from '../../../bin/State';
import ImageDAO from '../../../dao/ImageDAO';
import Image from '../../../models/Image';

let readAllWithPagination = jest
  .spyOn(ImageDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        imageId: 'image1.png',
        poster: 'user1',
        imageUrl: 'https://someurl.com',
        album: 'Community',
        timestamp: 1711164262197,
      },
    ];
  });

let create = jest.spyOn(ImageDAO.prototype, 'create').mockResolvedValue();

let delete1 = jest.spyOn(ImageDAO.prototype, 'delete').mockResolvedValue();

let read = jest.spyOn(ImageDAO.prototype, 'read').mockImplementation(() => {
  return [
    {
      imageId: 'image1.png',
      poster: 'user1',
      imageUrl: 'https://someurl.com',
      album: 'Community',
      timestamp: 1711164262197,
    },
  ];
});

describe('Fetch All Image For Album', () => {
  test('Return all images for album: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Image.fetchAllImagesInAlbum(dbClient, 1, 500, true, {
      albumName: 'Community',
    });
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        imageId: 'image1.png',
        poster: 'user1',
        imageUrl: 'https://someurl.com',
        album: 'Community',
        timestamp: 1711164262197,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let readAllWithPagination = jest
      .spyOn(ImageDAO.prototype, 'readAllWithPagination')
      .mockRejectedValueOnce(new DatabaseError());
    expect(readAllWithPagination).toBeCalledTimes(1);
    await expect(() =>
      Image.fetchAllImagesInAlbum(dbClient, 1, 500, true, {
        albumName: 'Community',
      }),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Insert Image', () => {
  test('Insert single image: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testImage = new Image(
      dbClient,
      'image1.png',
      'poster1',
      'someurl.com',
      'Community',
      Date.now(),
    );
    await testImage.insertThisImage();

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith(testImage);
  });

  test('DAO object ran into database related error: timestamp is not a number', async () => {
    const dbClient = TestDbClient.getInstance();
    const testImage = new Image(
      dbClient,
      'image1.png',
      'poster1',
      'someurl.com',
      'Community',
      'stringtimestamp',
    );
    let create = jest
      .spyOn(ImageDAO.prototype, 'create')
      .mockRejectedValueOnce(new DatabaseError());
    expect(create).toBeCalledTimes(1);
    await expect(() => testImage.insertThisImage()).rejects.toThrow(
      DatabaseError,
    );
  });
});

describe('Fetch One Single Image', () => {
  test('Return 1 image: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Image.fetchOneImage(
      dbClient,
      'Community',
      'image1.png',
    );
    expect(read).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        imageId: 'image1.png',
        poster: 'user1',
        imageUrl: 'https://someurl.com',
        album: 'Community',
        timestamp: 1711164262197,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let read = jest
      .spyOn(ImageDAO.prototype, 'read')
      .mockRejectedValueOnce(new DatabaseError());
    expect(read).toBeCalledTimes(1);
    await expect(() =>
      Image.fetchOneImage(dbClient, 'Community', 'nothere.png'),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Delete One Single Image', () => {
  test('Delete 1 image: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testImage = new Image(
      dbClient,
      'image1.png',
      'poster1',
      'someurl.com',
      'Community',
      Date.now(),
    );
    await testImage.deleteThisImage();
    expect(delete1).toBeCalledTimes(1);
    expect(delete1).toBeCalledWith('image1.png');
  });

  test('DAO object ran into database related error on deletion', async () => {
    const dbClient = TestDbClient.getInstance();
    const testImage = new Image(
      dbClient,
      'image1.png',
      'poster1',
      'someurl.com',
      'Community',
      Date.now(),
    );
    let delete1 = jest
      .spyOn(ImageDAO.prototype, 'delete')
      .mockRejectedValueOnce(new DatabaseError());
    expect(delete1).toBeCalledTimes(1);
    await expect(() => testImage.deleteThisImage()).rejects.toThrow(
      DatabaseError,
    );
  });
});
