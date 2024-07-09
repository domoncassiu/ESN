import UnauthenticatedUser from '../models/UnauthenticatedUser.js';
import LoginController from '../controllers/LoginController.js';
import RegisterResponse from '../models/RegisterResponse.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import express from 'express';
import Auth from '../middleware/auth.js';
import Utils from '../utils/Utils.js';
import UserAlreadyExistsError from '../exceptions/UserAlreadyExistsError.js';
import MongooseDBClient from '../clients/MongooseDBClient.js';
import State from '../bin/State.js';

const router = express.Router();

// POST Register new user
router.post('/registration', async function (req, res) {
  let { username, password } = req.body;
  try {
    username = username.toLowerCase();

    // do username and password validation
    Utils.validateUsernamePassword(username, password);

    let unauthenticatedUser = new UnauthenticatedUser(
      new MongooseDBClient(),
      username,
      password,
    );
    const loginController = new LoginController(State.getInstance().dbClient);
    let authenticatedUser = await loginController.addUser(unauthenticatedUser);
    let responseBody = new RegisterResponse(
      await authenticatedUser.getNewToken(),
    );
    res.status(200).json(responseBody);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post('/validation', async function (req, res) {
  let { username, password } = req.body;
  try {
    username = username.toLowerCase();
    // do username and password validation
    Utils.validateUsernamePassword(username, password);

    // Check if user already exists
    let unauthenticatedUser = new UnauthenticatedUser(
      new MongooseDBClient(),
      username,
      password,
    );
    let foundUser = null;
    try {
      const loginController = new LoginController(State.getInstance().dbClient);
      foundUser = await loginController.findUser(unauthenticatedUser);
      if (foundUser.isActive === false) {
        return res.status(401).json({ message: 'Account is Inactive' });
      }
    } catch (err) {
      // Do nothing: User does not already exist
    }
    console.log('foundUser', foundUser);
    if (foundUser !== null) {
      throw new UserAlreadyExistsError();
    }

    return res.status(200).send({ status: 'success' });
  } catch (error) {
    Utils.handleError(error, res);
  }
});
// POST Login user
router.post('/token', async function (req, res) {
  let { username, password } = req.body;
  try {
    username = username.toLowerCase();
    let unauthenticatedUser = new UnauthenticatedUser(
      new MongooseDBClient(),
      username,
      password,
    );
    const loginController = new LoginController(State.getInstance().dbClient);
    let authenticatedUser =
      await loginController.authenticateUser(unauthenticatedUser);
    let responseBody = new RegisterResponse(
      await authenticatedUser.getNewToken(),
      username,
    );
    res.status(200).json(responseBody);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

// PUT user acknowledgement
router.put(
  '/acknowledgement',
  Auth.getInstance().verifyToken,
  async function (req, res) {
    try {
      let username = req.decodedToken.username;
      let isAcknowledged = req.body.acknowledged;
      const loginController = new LoginController(State.getInstance().dbClient);
      let updateUserAcknowledged =
        await loginController.updateAcknowledgeTermsStatus(
          username,
          isAcknowledged,
        );
      if (updateUserAcknowledged) {
        res.status(204).send({ status: 'success' });
      } else {
        throw new InternalServerError();
      }
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

// GET user acknowledgement
router.get(
  '/acknowledgement',
  Auth.getInstance().verifyToken,
  async function (req, res) {
    try {
      let username = req.decodedToken.username;
      const loginController = new LoginController(State.getInstance().dbClient);
      let userAcknowledged =
        await loginController.retrieveUserAcknowledged(username);
      res.status(200).send({ acknowledged: userAcknowledged });
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

// POST Logout user
router.post('/logout', async function (req, res) {
  res.status(200).send({ status: 'success' });
});

export default router;
