import { jest } from '@jest/globals';
import Announcement from '../../../models/Announcement';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDbClient from '../../../bin/State';
import AnnouncementDAO from '../../../dao/AnnouncementDAO';

let readAllWithPagination = jest
  .spyOn(AnnouncementDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        announcementId: '4aa05683-d8b6-4d77-99a1-d613041af550',
        sender: 'user1',
        message: 'test',
        timestamp: 1711164262197,
      },
    ];
  });

let create = jest
  .spyOn(AnnouncementDAO.prototype, 'create')
  .mockResolvedValue();
// const unitDbClient = {
//   readAllWithPagination: jest.fn().mockResolvedValue([
//     {
//       _id: '65fe4b669ca0b2fd72ccf8fb',
//       announcementId: '4aa05683-d8b6-4d77-99a1-d613041af550',
//       sender: 'user1',
//       message: 'test',
//       timestamp: 1711164262197,
//       createdAt: '2024-03-23T03:24:22.218Z',
//       updatedAt: '2024-03-23T03:24:22.218Z',
//       __v: 0,
//     },
//   ]),
//   create: jest.fn().mockResolvedValue(),
// };
// jest.mock('../../../dao/AnnouncementDAO', () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       dbClient: unitDbClient,
//     };
//   });
// });
describe('Fetch All Announcement', () => {
  test('Return all announcements: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Announcement.fetchAllAnnouncements(dbClient);
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        announcementId: '4aa05683-d8b6-4d77-99a1-d613041af550',
        sender: 'user1',
        message: 'test',
        timestamp: 1711164262197,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let readAllWithPagination = jest
      .spyOn(AnnouncementDAO.prototype, 'readAllWithPagination')
      .mockRejectedValueOnce(new DatabaseError());
    // unitDbClient.readAllWithPagination.mockRejectedValueOnce(
    //   new DatabaseError(),
    // );
    expect(readAllWithPagination).toBeCalledTimes(1);
    await expect(() =>
      Announcement.fetchAllAnnouncements(dbClient),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Insert Announcement', () => {
  test('Insert single announcement: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testAnnouncement = new Announcement(
      dbClient,
      '1',
      'sender1',
      'somemessage',
      Date.now(),
    );
    await testAnnouncement.insertThisAnnoucement();

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith(testAnnouncement);
    // expect(unitDbClient.create).toHaveBeenCalledTimes(1);
    // // I was trying to use expect(unitDbClient.create).toHaveBeenCalledWith(testAnnouncement)
    // // For some reason, the Received is "Announcement", {testAnnouncement} and Expected is {testAnnouncement} so match fails
    // // Doing the line below allow me to just access the 2nd item in Received directly and match with testAnnouncement
    // // This is asserting that the dbClient's create method is called with testAnnouncement object
    // expect(unitDbClient.create.mock.calls[0][1]).toMatchObject(
    //   testAnnouncement,
    // );
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    const testAnnouncement = new Announcement(
      dbClient,
      '1',
      'sender1',
      'somemessage',
      'should not be string',
    );
    let create = jest
      .spyOn(AnnouncementDAO.prototype, 'create')
      .mockRejectedValueOnce(new DatabaseError());
    // unitDbClient.create.mockRejectedValueOnce(new DatabaseError());
    expect(create).toBeCalledTimes(1);
    await expect(() =>
      testAnnouncement.insertThisAnnoucement(),
    ).rejects.toThrow(DatabaseError);
  });
});
