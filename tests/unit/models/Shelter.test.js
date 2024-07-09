import { expect, jest, test } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDbClient from '../../../bin/State';
import ShelterDAO from '../../../dao/ShelterDAO';
import Shelter from '../../../models/Shelter';

let readAllWithPagination = jest
  .spyOn(ShelterDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        _id: '65fe4b669ca0b2fd72ccf8fb',
        name: 'test',
        address: 'test address',
        capacity: 5,
        longitude: 5,
        latitude: 5,
      },
    ];
  });

let create = jest.spyOn(ShelterDAO.prototype, 'create').mockResolvedValue();

let delete1 = jest.spyOn(ShelterDAO.prototype, 'delete').mockResolvedValue({
  _id: '65fe4b669ca0b2fd72ccf8fb',
  name: 'test',
  address: 'test address',
  capacity: 5,
  longitude: 5,
  latitude: 5,
});

let read = jest.spyOn(ShelterDAO.prototype, 'read').mockImplementation(() => {
  return [
    {
      _id: '65fe4b669ca0b2fd72ccf8fb',
      name: 'test',
      address: 'test address',
      capacity: 5,
      longitude: 5,
      latitude: 5,
    },
  ];
});

describe('Fetch all shelters', () => {
  test('fetech all shelters: should fetch successfully', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Shelter.fetchAllShelters(dbClient, 1, 500, true, {});
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        _id: '65fe4b669ca0b2fd72ccf8fb',
        name: 'test',
        address: 'test address',
        capacity: 5,
        longitude: 5,
        latitude: 5,
      },
    ]);
  });

  test('fetech all shelters: should filter successfully', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Shelter.fetchAllShelters(dbClient, 1, 500, true, {
      name: 'test',
    });
    expect(readAllWithPagination).toBeCalledTimes(2);
    expect(result).toEqual([
      {
        _id: '65fe4b669ca0b2fd72ccf8fb',
        address: 'test address',
        capacity: 5,
        latitude: 5,
        longitude: 5,
        name: 'test',
      },
    ]);
  });
});

describe('Insert Shelter', () => {
  test('Insert Shelter: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testShelter = new Shelter(
      dbClient,
      'adadasdas',
      'demo',
      '123123',
      20,
      5,
      5,
    );
    const result = await testShelter.createShelter();
    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith(testShelter);
  });

  test('Insert Shelter: should reject the creation', async () => {
    const dbClient = TestDbClient.getInstance();
    const testShelter = new Shelter(
      dbClient,
      'adadasdas',
      'demo2',
      '123123',
      'asasda',
      5,
      5,
    );
    await testShelter.createShelter();

    expect(create).toBeCalledTimes(2);
  });
});

describe('Fetch One Shelter', () => {
  test('fetech one shelters: should fetch successfully', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Shelter.fetchAllShelters(dbClient, 1, 500, true, {
      name: 'test',
    });
    expect(result).toEqual([
      {
        _id: '65fe4b669ca0b2fd72ccf8fb',
        name: 'test',
        address: 'test address',
        capacity: 5,
        longitude: 5,
        latitude: 5,
      },
    ]);
  });

  test('fetech one shelters: should not fetch successfull', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await Shelter.fetchAllShelters(dbClient, 1, 500, true, {
      name: 'test',
    });
    expect(result).toEqual([
      {
        _id: '65fe4b669ca0b2fd72ccf8fb',
        name: 'test',
        address: 'test address',
        capacity: 5,
        longitude: 5,
        latitude: 5,
      },
    ]);
  });
});

describe('Delete one shelter', () => {
  test('Delete one shelter: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testShelter = new Shelter(
      dbClient,
      'adadasdas',
      'demo2',
      '123123',
      'asasda',
      5,
      5,
    );
    await testShelter.deleteShelter();
    expect(delete1).toBeCalledTimes(1);
    expect(delete1).toBeCalledWith('demo2');
  });

  test('Delete one shelter: should not delete', async () => {
    const dbClient = TestDbClient.getInstance();
    const testShelter = new Shelter(
      dbClient,
      'adadasdas',
      'demo3',
      '123123',
      'asasda',
      5,
      5,
    );

    const result = await testShelter.deleteShelter();
    expect(result).toEqual(undefined);
    expect(delete1).toBeCalledTimes(2);
    expect(delete1).toBeCalledWith('demo2');
  });
});
