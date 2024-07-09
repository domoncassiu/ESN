import express from 'express';
import Auth from '../middleware/auth.js';
import EsnTest from '../middleware/esntest.js';
import State from '../bin/State.js';
import ShelterController from '../controllers/ShelterController.js';
import Utils from '../utils/Utils.js';

const router = express.Router();

router.get('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { name } = req.query;
    let page = 1;
    let pageSize = 500;
    let ascending = false;
    let shelterController = new ShelterController(State.getInstance().dbClient);
    const messages = await shelterController.fetchAllShelters(
      page,
      pageSize,
      ascending,
      name,
    );
    res.status(200).json(messages);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { name, address, capacity, longitude, latitude } = req.body;
    let shelterController = new ShelterController(State.getInstance().dbClient);
    const newShelter = await shelterController.createShelter(
      name,
      address,
      capacity,
      longitude,
      latitude,
    );
    res.status(201).json(newShelter);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.delete('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    let shelterController = new ShelterController(State.getInstance().dbClient);
    await shelterController.deleteShelter(name);
    res.status(204).send();
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.put('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { name, address, capacity, longitude, latitude } = req.body;
    let shelterController = new ShelterController(State.getInstance().dbClient);
    const newShelter = await shelterController.updateShelter(
      name,
      address,
      capacity,
      longitude,
      latitude,
    );
    res.status(204).json(newShelter);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

export default router;
