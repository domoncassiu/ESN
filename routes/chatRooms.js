import express from 'express';
import Auth from '../middleware/auth.js';
import PublicChatController from '../controllers/PublicChatController.js';
import PrivateChatController from '../controllers/PrivateChatController.js';
import State from '../bin/State.js';
import Utils from '../utils/Utils.js';
import groupsRouter from './groups.js';

const router = express.Router();
router.use('/groups', groupsRouter);

const privateChatController = new PrivateChatController(
  State.getInstance().dbClient,
);
router.get('/public', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, pageSize, ascending, senderId } =
      Utils.extractParameters(req);
    let publicChatController = new PublicChatController(
      State.getInstance().dbClient,
    );

    const messages = await publicChatController.fetchAllPublicMessages(
      page,
      pageSize,
      ascending,
    );
    res.status(200).json(messages);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post('/public', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let senderId = req.decodedToken._id;
    let username = req.decodedToken.username;
    const { message } = req.body;
    let publicChatController = new PublicChatController(
      State.getInstance().dbClient,
    );
    const newMessage = await publicChatController.addPublicMessage(
      senderId,
      username,
      message,
    );
    res.status(201).json(newMessage);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post('/private', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let senderId = req.decodedToken._id;
    const { message, receiverId } = req.body;
    console.log('HELLO', req.body);
    console.log(receiverId);
    const newMessage = await privateChatController.addPrivateMessage(
      senderId,
      message,
      receiverId,
    );
    res.status(201).json(newMessage);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/private', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, pageSize, ascending, senderId } =
      Utils.extractParameters(req);
    const userIdSender = req.decodedToken._id;
    const participantId = req.query.participantId;
    const messages =
      await privateChatController.fetchAllPrivateMessagesBetween2Users(
        page,
        pageSize,
        true,
        userIdSender,
        participantId,
      );
    res.status(200).json(messages);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get(
  '/private/participants',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const { page, pageSize, ascending, senderId } =
        Utils.extractParameters(req);
      const userId = req.decodedToken._id;
      const participants =
        await privateChatController.fetchAllPrivateMessagesParticipants(
          page,
          pageSize,
          ascending,
          userId,
        );
      console.log(participants);
      res.status(200).json(participants);
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);
// test
router.get(
  '/private/newMessages',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const { page, pageSize, ascending, senderId } =
        Utils.extractParameters(req);
      const newMessageParticipants =
        await privateChatController.fetchAllPrivateMessagesSinceLastOnline(
          page,
          pageSize,
          ascending,
          senderId,
        );

      res.status(200).json(newMessageParticipants);
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

router.put(
  '/private/readStatus',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      console.log('in route read');
      let senderId = req.decodedToken._id;
      let { participantId } = req.body;
      const updateReadStatus = await privateChatController.updateReadStatus(
        senderId,
        participantId,
      );
      console.log('in route read');
      if (updateReadStatus) {
        res.sendStatus(200);
      } else {
        console.log('in route 400');
        res.status(400).send('Not able to update');
      }
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

export default router;
