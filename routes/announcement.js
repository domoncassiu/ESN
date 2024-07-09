import express from 'express';
import Auth from '../middleware/auth.js';
import State from '../bin/State.js';
import AnnouncementController from '../controllers/AnnouncementController.js';
import Utils from '../utils/Utils.js';

const router = express.Router();

router.get('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, pageSize, ascending, sender } = Utils.extractParameters(req);
    let announcementController = new AnnouncementController(
      State.getInstance().dbClient,
    );

    const messages = await announcementController.fetchAllAnnouncements(
      page,
      pageSize,
      ascending,
    );
    res.status(200).json(messages);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post('/', Auth.getInstance().verifyCoord, async (req, res) => {
  try {
    let sender = req.decodedToken.username;
    let senderId = req.decodedToken._id;
    const { message } = req.body;
    let announcementController = new AnnouncementController(
      State.getInstance().dbClient,
    );
    let newAnnouncement = await announcementController.addNewAnnouncement(
      senderId,
      message,
    );
    res.status(201).json(newAnnouncement);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

export default router;
