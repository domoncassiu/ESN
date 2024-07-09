import express from 'express';
import Auth from '../middleware/auth.js';
import State from '../bin/State.js';
import ResourceHelpController from '../controllers/ResourceHelpController.js';
import Utils from '../utils/Utils.js';

const router = express.Router();

router.post('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { resource, quantityOffered, address } = req.body;

    let resourceHelpController = new ResourceHelpController(
      State.getInstance().dbClient,
    );
    const newResourceHelp = await resourceHelpController.addNewResourceHelp(
      resource,
      req.decodedToken.username,
      quantityOffered,
      address,
    );
    res.status(201).json(newResourceHelp);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

export default router;
