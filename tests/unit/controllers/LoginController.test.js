import { expect, jest, test } from '@jest/globals';
import UnauthenticatedUser from '../../../models/UnauthenticatedUser';
import LoginController from '../../../controllers/LoginController';
import TestDBClient from '../../../clients/TestDBClient';
import UserDAO from '../../../dao/UserDAO';
import AuthenticatedUser from '../../../models/AuthenticatedUser';
import UserType from '../../../models/UserType';
import UserAlreadyExistsError from '../../../exceptions/UserAlreadyExistsError';
import InvalidEntryError from '../../../exceptions/InvalidEntryError';

let loginController = new LoginController(TestDBClient.getInstance());

// Mock functions
let insertThisUser = jest
  .spyOn(AuthenticatedUser.prototype, 'insertThisUser')
  .mockImplementation(() => {});

let updateAcknowledgeTermsStatus = jest
  .spyOn(AuthenticatedUser.prototype, 'updateAcknowledgeTermsStatus')
  .mockImplementation(() => true);

let authenticatedMary = new AuthenticatedUser(
  TestDBClient.getInstance(),
  'mary',
  '$2a$10$289FUpNF3M8LDzV2fl4ZtuEb2axpzYJUAPX8xQOBKLxGVWMjn/QoO',
  'Citizen',
  true,
  true,
  [],
);

describe('Test Controller: LoginController', () => {
  test('Authenticate User: authenticateUser', async () => {
    let getThisUsersData = jest
      .spyOn(UnauthenticatedUser.prototype, 'getThisUsersData')
      .mockImplementation(() => {
        return authenticatedMary;
      });
    let unauthenticatedUser = new UnauthenticatedUser(
      TestDBClient.getInstance(),
      'mary',
      'myAmazingPassword',
    );
    let authenticatedUser =
      await loginController.authenticateUser(unauthenticatedUser);
    expect(getThisUsersData).toBeCalledTimes(1);
    expect(authenticatedUser).toStrictEqual(authenticatedMary);
  });

  test('Add a user to the database: addUser', async () => {
    let getThisUsersData = jest
      .spyOn(UnauthenticatedUser.prototype, 'getThisUsersData')
      .mockImplementation(() => {
        throw new InvalidEntryError();
      });

    let unauthenticatedUser2 = new UnauthenticatedUser(
      TestDBClient.getInstance(),
      'bob',
      'myAmazingPassword',
    );
    let newUser = await loginController.addUser(unauthenticatedUser2);
    expect(insertThisUser).toBeCalledTimes(1);
    expect(getThisUsersData).toBeCalledTimes(2);
  });

  test('Update acknowledge terms status: updateAcknowledgeTermsStatus', async () => {
    let getThisUsersData = jest
      .spyOn(UnauthenticatedUser.prototype, 'getThisUsersData')
      .mockImplementation(() => {
        return authenticatedMary;
      });

    let isUpdated = await loginController.updateAcknowledgeTermsStatus(
      'mary',
      true,
    );
    expect(updateAcknowledgeTermsStatus).toBeCalledTimes(1);
    expect(isUpdated).toStrictEqual(true);
    expect(getThisUsersData).toBeCalledTimes(3);
  });

  test('Retrieve user acknowledged: retrieveUserAcknowledgesd', async () => {
    let getThisUsersData = jest
      .spyOn(UnauthenticatedUser.prototype, 'getThisUsersData')
      .mockImplementation(() => {
        return authenticatedMary;
      });

    let userAcknowledged =
      await loginController.retrieveUserAcknowledged('mary');
    expect(getThisUsersData).toBeCalledTimes(4);
    expect(userAcknowledged).toStrictEqual(true);
  });
});
