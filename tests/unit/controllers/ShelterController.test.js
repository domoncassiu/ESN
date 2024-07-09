import { describe, expect, jest, test } from '@jest/globals';
import ShelterController from '../../../controllers/ShelterController';
import TestDBClient from '../../../clients/TestDBClient';
import Shelter from '../../../models/Shelter';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import DatabaseError from '../../../exceptions/DatabaseError';
import InternalServerError from '../../../exceptions/InternalServerError';

const dbClientMock = TestDBClient.getInstance();

let shelterController = new ShelterController(dbClientMock);

State.getInstance().mode = ModeEnum.PRODUCTION;
State.getInstance().websocketSubsystem = new WebsocketSubsystem();

jest.spyOn(Shelter.prototype, 'createShelter').mockReturnValue(undefined);
let deleteShelter = jest
  .spyOn(Shelter.prototype, 'deleteShelter')
  .mockReturnValue(undefined);
jest.spyOn(Shelter.prototype, 'updateShelter').mockReturnValue(undefined);
jest.spyOn(Shelter, 'fetchAllShelters').mockReturnValue([
  {
    _id: '65fe4b669ca0b2fd72ccf8fb',
    name: 'test',
    address: 'test address',
    capacity: 5,
    longitude: 5,
    latitude: 5,
  },
]);

describe('Testing controller: ShelterController', () => {
  test('Fetch all shelters: should fetch all shelters successfully', async () => {
    const mockShelters = [
      {
        id: '1',
        name: 'Shelter 1',
        address: 'test address',
        capacity: 5,
        longitude: 5,
        latitude: 5,
      },
      {
        id: '2',
        name: 'Shelter 2',
        address: 'test address2',
        capacity: 6,
        longitude: 5,
        latitude: 5,
      },
    ];
    Shelter.fetchAllShelters.mockResolvedValue(mockShelters);

    const page = 1;
    const pageSize = 10;
    const ascending = true;
    const sheltername = 'Shelter';

    const result = await shelterController.fetchAllShelters(
      page,
      pageSize,
      ascending,
      sheltername,
    );

    expect(Shelter.fetchAllShelters).toHaveBeenCalledWith(
      dbClientMock,
      page,
      pageSize,
      ascending,
      { name: sheltername },
    );
    expect(result).toEqual(mockShelters);
  });

  test('Fetch all shelters: should handle errors', async () => {
    Shelter.fetchAllShelters.mockRejectedValue(new Error('mock error'));

    const page = 1;
    const pageSize = 10;
    const ascending = true;
    const sheltername = 'Shelter';

    await expect(
      shelterController.fetchAllShelters(
        page,
        pageSize,
        ascending,
        sheltername,
      ),
    ).rejects.toThrow(InternalServerError);
  });
});

describe('Testing controller: ShelterController', () => {
  test('create one shelters: should create a shelter successfully', async () => {
    const name = 'test123';
    const address = 'testaddress';
    const capacity = 5;
    const longitude = 5;
    const latitude = 5;

    let result = await shelterController.createShelter(
      name,
      address,
      capacity,
      longitude,
      latitude,
    );

    expect(result).toBeDefined();
    expect(Shelter.prototype.createShelter).toHaveBeenCalledTimes(1);
  });

  test('should handle errors', async () => {
    Shelter.prototype.createShelter.mockRejectedValue(new Error('mock error'));

    const name = 'test';
    const address = 'test address';
    const capacity = 5;
    const longitude = 5;
    const latitude = 5;

    await expect(
      shelterController.createShelter(
        name,
        address,
        capacity,
        longitude,
        latitude,
      ),
    ).rejects.toThrow(InternalServerError);
  });
});

describe('Testing controller: ShelterController', () => {
  test('Delete one shelter: deleteShelterEntryFromDb_MatchingPoster_DeleteOK', async () => {
    const mockShelters = [
      {
        id: '1',
        name: 'Shelter 1',
        address: 'test address',
        capacity: 5,
        longitude: 5,
        latitude: 5,
      },
      {
        id: '2',
        name: 'Shelter 2',
        address: 'test address2',
        capacity: 6,
        longitude: 5,
        latitude: 5,
      },
    ];
    Shelter.fetchAllShelters.mockResolvedValue(mockShelters);

    let result = await shelterController.deleteShelter('Shelter 1');
    expect(result).toEqual(undefined);
    expect(Shelter.prototype.deleteShelter).toBeCalledTimes(1);
  });
});
