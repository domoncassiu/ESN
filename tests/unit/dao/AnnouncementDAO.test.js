import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import AnnouncementDAO from '../../../dao/AnnouncementDAO';
import SchemaEnum from '../../../clients/SchemaEnum';

describe('Fetch Announcements', () => {
  test('Return all Announcements: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [
          { announcementId: 'anmt1', message: 'announce', userId: 'id1' },
        ];
      });

    let announcementDAO = new AnnouncementDAO(TestDBClient.getInstance());
    // Call the function
    let result = await announcementDAO.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0]).toStrictEqual({
      announcementId: 'anmt1',
      message: 'announce',
      userId: 'id1',
    });
  });
});

describe('Create Single Announcement', () => {
  test('Return created Announcement: Nominal Scenario', async () => {
    let expectedAnnouncement = {
      announcementId: 'anmt1',
      message: 'announce',
      userId: 'id1',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedAnnouncement;
      });
    let announcementDAO = new AnnouncementDAO(TestDBClient.getInstance());
    // Call the function
    let result = await announcementDAO.create(expectedAnnouncement);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedAnnouncement);
  });
});
