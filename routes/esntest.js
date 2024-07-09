import express from 'express';
import Auth from '../middleware/auth.js';
import EsnTestController from '../controllers/EsnTestController.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import HandledError from '../exceptions/HandledError.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import ErrorResponse from '../models/ErrorResponse.js';
import EsnTest from '../middleware/esntest.js';
const router = express.Router();
const esnTetController = new EsnTestController();

router.post(
  '/',
  EsnTest.sessionHandler,
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      if (req.body.test === 'START') {
        await esnTetController.activateTest();
        req.session._id = req.decodedToken._id;
        req.session.user = req.decodedToken.username;
        req.session.testing = true;
        res.status(200).send({ success: true });
      } else if (req.body.test === 'STOP') {
        await esnTetController.deactivateTest();

        // destroy session
        await req.session.destroy();
        res.status(200).send({ success: true });
      } else {
        throw new InvalidEntryError();
      }
    } catch (error) {
      if (error instanceof HandledError) {
        res.status(error.code).send(new ErrorResponse(error));
      } else {
        console.trace(error);
        res.status(500).send(new ErrorResponse(new InternalServerError()));
      }
    }
  },
);

export default router;
