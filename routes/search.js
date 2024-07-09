import express from 'express';
import SearchController from '../controllers/SearchController.js';
import Auth from '../middleware/auth.js';
import HandledError from '../exceptions/HandledError.js';
import ErrorResponse from '../models/ErrorResponse.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import State from '../bin/State.js';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';

const router = express.Router();

router.get('/citizens', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, keyword } = req.query;
    let searchController = new SearchController(State.getInstance().dbClient);
    const citizens = await searchController.searchCitizens(page, keyword);
    res.status(200).json(citizens);
  } catch (error) {
    if (error instanceof HandledError) {
      res.status(error.code).send(new ErrorResponse(error));
    } else {
      console.trace(error);
      res.status(500).send(new ErrorResponse(new InternalServerError()));
    }
  }
});

router.get('/statuses', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!Object.values(SafetyStatusEnum).includes(keyword)) {
      throw new InvalidEntryError();
    }
    let searchController = new SearchController(State.getInstance().dbClient);
    const citizens = await searchController.searchStatuses(keyword);
    res.status(200).json(citizens);
  } catch (error) {
    console.log('errrrrr', error);
    if (error instanceof HandledError) {
      res.status(error.code).send(new ErrorResponse(error));
    } else {
      console.trace(error);
      res.status(500).send(new ErrorResponse(new InternalServerError()));
    }
  }
});

router.get('/public', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, keyword } = req.query;
    let searchController = new SearchController(State.getInstance().dbClient);
    const messages = await searchController.searchPublicMessage(page, keyword);
    res.status(200).json(messages);
  } catch (error) {
    if (error instanceof HandledError) {
      res.status(error.code).send(new ErrorResponse(error));
    } else {
      console.trace(error);
      res.status(500).send(new ErrorResponse(new InternalServerError()));
    }
  }
});

router.get('/private', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, keyword, receiverId } = req.query;
    const senderId = req.decodedToken._id;
    let searchController = new SearchController(State.getInstance().dbClient);
    if (keyword === 'status') {
      const statuses = await searchController.searchUsersStatuses(
        page,
        receiverId,
      );
      res.status(200).json(statuses);
    } else {
      const messages = await searchController.searchPrivateMessage(
        page,
        keyword,
        senderId,
        receiverId,
      );
      res.status(200).json(messages);
    }
  } catch (error) {
    if (error instanceof HandledError) {
      res.status(error.code).send(new ErrorResponse(error));
    } else {
      console.trace(error);
      res.status(500).send(new ErrorResponse(new InternalServerError()));
    }
  }
});

router.get(
  '/announcements',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const { page, keyword } = req.query;
      let searchController = new SearchController(State.getInstance().dbClient);
      const messages = await searchController.searchPublicAnnouncements(
        page,
        keyword,
      );
      res.status(200).json(messages);
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

router.get('/incidents', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, keyword } = req.query;
    let searchController = new SearchController(State.getInstance().dbClient);
    const messages = await searchController.searchIncidents(page, keyword);
    res.status(200).json(messages);
  } catch (error) {
    if (error instanceof HandledError) {
      res.status(error.code).send(new ErrorResponse(error));
    } else {
      console.trace(error);
      res.status(500).send(new ErrorResponse(new InternalServerError()));
    }
  }
});

export default router;
