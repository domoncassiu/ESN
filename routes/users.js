import Auth from '../middleware/auth.js';
import express from 'express';
import UserController from '../controllers/UserController.js';
import State from '../bin/State.js';
import Utils from '../utils/Utils.js';
import UserType from '../models/UserType.js';
import UserAlreadyExistsError from '../exceptions/UserAlreadyExistsError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';

const router = express.Router();

router.get('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, pageSize, ascending, sender } = Utils.extractParameters(req);
    const userController = new UserController(State.getInstance().dbClient);
    let responseBody = await userController.getEsnDirectory(
      page,
      pageSize,
      ascending,
    );
    res.status(200).json(responseBody);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/status', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let username = req.decodedToken.username;
    let userId = req.decodedToken._id;
    const userController = new UserController(State.getInstance().dbClient);
    const safetyStatus = await userController.getUserSafetyStatus(userId);
    res.status(200).json(safetyStatus);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.put('/status', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let username = req.decodedToken.username;
    let userId = req.decodedToken._id;
    const { status } = req.body;
    const userController = new UserController(State.getInstance().dbClient);
    const newSafetyStatus = await userController.updateUserSafetyStatus(
      userId,
      username,
      status,
    );
    res.status(204).json(newSafetyStatus);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.put('/:id', Auth.getInstance().verifyAdmin, async (req, res) => {
  try {
    let _id = req.decodedToken._id;
    const { id } = req.params;
    const userController = new UserController(State.getInstance().dbClient);
    const result = await userController.updateUser(id, req.body);
    res.status(204).json(result);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post(
  '/changes/validation/:id',
  Auth.getInstance().verifyAdmin,
  async (req, res) => {
    try {
      const { username, password, type } = req.body;
      const { id } = req.params;
      // validate username and password against rules
      if (username) {
        Utils.validateUsernamePassword(username, 'sb5FSE');
      }
      if (password) {
        Utils.validateUsernamePassword('sb5fse', password);
      }
      const userController = new UserController(State.getInstance().dbClient);
      const userToUpdateCurType = await userController.getUserType(id);
      if (
        type &&
        userToUpdateCurType === UserType.ADMIN &&
        type !== UserType.ADMIN
      ) {
        // check how many admins are in the current system. if one, throw error
        const canChangeAdminToOtherType =
          await userController.hasMoreThanOneAdmin();
        console.log(canChangeAdminToOtherType);
        if (!canChangeAdminToOtherType) {
          throw new ForbiddenError(
            'The system needs to have at least one Admin.',
          );
        }
      }
      const prevUsername = (
        await AuthenticatedUser.getUserById(State.getInstance().dbClient, id)
      ).username;
      if (prevUsername !== username) {
        const existedUser = await userController.getUserByName(username);
        if (existedUser) {
          throw new UserAlreadyExistsError();
        }
      }
      res.status(200).json('Validation successful');
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

// async function verifyAdminRole(_id) {
//   const userController = new UserController(State.getInstance().dbClient);
//   if ((await userController.getUserType(_id)) !== UserType.ADMIN) {
//     throw new UnauthorizedError(
//       'You are not authorized to perform this action',
//     );
//   }
// }
export default router;
