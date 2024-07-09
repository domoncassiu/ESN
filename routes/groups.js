import express from 'express';
import Auth from '../middleware/auth.js';
import Utils from '../utils/Utils.js';
import IncidentController from '../controllers/IncidentController.js';
import State from '../bin/State.js';
const router = express.Router();

router.post(
  '/:incidentId',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.params);
      let { incidentId } = req.params;
      let senderId = req.decodedToken._id;
      let username = req.decodedToken.username;
      const { message } = req.body;

      let incidentController = new IncidentController(
        State.getInstance().dbClient,
      );
      const newMessage = await incidentController.storeNewMessage(
        senderId,
        username,
        message,
        incidentId,
      );
      res.status(200).json(newMessage);
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

router.get('/:incidentId', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let { page, pageSize, ascending } = Utils.extractParameters(req);
    let { incidentId } = req.params;
    let incidentController = new IncidentController(
      State.getInstance().dbClient,
    );

    if (page === null || page === undefined) {
      page = 1;
    }
    if (pageSize === null || pageSize === undefined) {
      pageSize = 50;
    }
    if (ascending === null || ascending === undefined) {
      ascending = false;
    }

    console.log('incidentId: ', incidentId);

    const messages = await incidentController.fetchAllMessages(
      incidentId,
      page,
      pageSize,
      ascending,
    );
    console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get(
  '/:incidentId/messages/:messageId',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      let { incidentId, messageId } = req.params;
      let incidentController = new IncidentController(
        State.getInstance().dbClient,
      );

      console.log('incidentId: ', incidentId);

      const message = await incidentController.fetchMessage(
        incidentId,
        messageId,
      );
      console.log(message);
      res.status(200).json(message);
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

router.put(
  '/:incidentId/messages/:messageId',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      let { incidentId, messageId } = req.params;
      let senderId = req.decodedToken._id;
      const { sentiment } = req.body;

      let incidentController = new IncidentController(
        State.getInstance().dbClient,
      );
      const newMessage = await incidentController.updateSentiment(
        sentiment,
        messageId,
        incidentId,
      );
      res.status(200).json(newMessage);
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

export default router;
