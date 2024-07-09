import express from 'express';
import Auth from '../middleware/auth.js';
import State from '../bin/State.js';
import Utils from '../utils/Utils.js';
import IncidentController from '../controllers/IncidentController.js';

const router = express.Router();

router.post('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let moderator = req.decodedToken._id;
    const { name, event, longitude, latitude } = req.body;
    let incidentController = new IncidentController(
      State.getInstance().dbClient,
    );
    const newIncident = await incidentController.createNewIncident(
      moderator,
      name,
      event,
      longitude,
      latitude,
    );
    res.status(200).json(newIncident);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { page, pageSize, ascending, incidentId } =
      Utils.extractParameters(req);
    let incidentController = new IncidentController(
      State.getInstance().dbClient,
    );

    const incidents = await incidentController.fetchAllIncidents(
      page,
      pageSize,
      ascending,
      incidentId,
    );
    res.status(200).json(incidents);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/:incidentId', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { incidentId } = req.params;
    let userId = req.decodedToken._id;
    let incidentController = new IncidentController(
      State.getInstance().dbClient,
    );
    let incident = await incidentController.fetchIncident(userId, incidentId);
    res.status(200).json(incident);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.put('/:incidentId', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { incidentId } = req.params;
    let newUserId = req.decodedToken._id;
    let incidentController = new IncidentController(
      State.getInstance().dbClient,
    );

    const incident = await incidentController.joinIncident(
      incidentId,
      newUserId,
    );
    res.status(200).json(incident);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.delete(
  '/:incidentId',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      let userId = req.decodedToken._id;
      const { incidentId } = req.params;
      let incidentController = new IncidentController(
        State.getInstance().dbClient,
      );
      const result = await incidentController.leaveIncident(userId, incidentId);
      res.status(200).json(result);
    } catch (error) {
      Utils.handleError(error, res);
    }
  },
);

export default router;
