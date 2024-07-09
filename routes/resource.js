import express from 'express';
import Auth from '../middleware/auth.js';
import State from '../bin/State.js';
import ResourceController from '../controllers/ResourceController.js';
import Utils from '../utils/Utils.js';

const router = express.Router();

router.get('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, pageSize, ascending } = Utils.extractParameters(req);
    let resourceController = new ResourceController(
      State.getInstance().dbClient,
    );
    let userId = req.query.userId === 'ok' ? req.decodedToken.username : null;
    const resources = await resourceController.fetchAllResources(
      page,
      pageSize,
      ascending,
      userId,
    );
    res.status(200).json(resources);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { name, quantity, location, additionalInfo } = req.body;
    let resourceController = new ResourceController(
      State.getInstance().dbClient,
    );
    console.log('req.decodedToken.username', req.decodedToken.username);
    const newResource = await resourceController.addNewResource(
      name,
      quantity,
      location,
      additionalInfo,
      req.decodedToken.username,
    );
    res.status(201).json(newResource);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/del/:id', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ididididididididid', id);
    let resourceController = new ResourceController(
      State.getInstance().dbClient,
    );

    await resourceController.deleteResourceById('_id', id);
    res.status(200).json({ message: 'Resource successfully deleted.' });
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/:id', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let resourceController = new ResourceController(
      State.getInstance().dbClient,
    );

    const resourceDetails = await resourceController.fetchResourceById(id);
    res.status(200).json(resourceDetails);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

export default router;
