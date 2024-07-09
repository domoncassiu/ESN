import express from 'express';
import Auth from '../middleware/auth.js';
import State from '../bin/State.js';
import ShelterReviewController from '../controllers/ShelterReviewController.js';
import Utils from '../utils/Utils.js';

const router = express.Router();

router.get('/messages', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { location } = req.query;
    let shelterReviewController = new ShelterReviewController(
      State.getInstance().dbClient,
    );
    const reviews =
      await shelterReviewController.fetchAllReviewsForLocation(location);
    res.status(200).json(reviews);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/ratings', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { location } = req.query;
    let shelterReviewController = new ShelterReviewController(
      State.getInstance().dbClient,
    );
    const reviews =
      await shelterReviewController.fetchRatingsForLocation(location);
    res.status(200).json(reviews[0]);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.get('/shelters', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const { filterName, min, max, sortBy, ascending } = req.query;
    let shelterReviewController = new ShelterReviewController(
      State.getInstance().dbClient,
    );
    const filter = {
      filterName: filterName,
      min: min,
      max: max,
    };
    const shelters = await shelterReviewController.fetchAllSheltersWithReviews(
      filter,
      sortBy,
      ascending,
    );
    res.status(200).json(shelters);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.post('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let reviewer = req.decodedToken.username;
    const { message, ratings, location } = req.body;
    let shelterReviewController = new ShelterReviewController(
      State.getInstance().dbClient,
    );
    const newReview = await shelterReviewController.addNewReview(
      reviewer,
      ratings,
      message,
      location,
    );
    res.status(201).json(newReview);
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.put('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let username = req.decodedToken.username;
    const { message, id } = req.body;
    let shelterReviewController = new ShelterReviewController(
      State.getInstance().dbClient,
    );
    const updatedReview = await shelterReviewController.updateReview(
      username,
      id,
      message,
    );
    if (!updatedReview) {
      res.status(401).json('cannot update');
    } else {
      res.status(200).json(updatedReview);
    }
  } catch (error) {
    Utils.handleError(error, res);
  }
});

router.delete('/', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let username = req.decodedToken.username;
    const { reviewer, id } = req.body;
    let shelterReviewController = new ShelterReviewController(
      State.getInstance().dbClient,
    );
    if (username !== reviewer) {
      res.status(401).json('cannot delete');
    } else {
      const updatedReview = await shelterReviewController.deleteReview(id);
      res.status(200).json(updatedReview);
    }
  } catch (error) {
    Utils.handleError(error, res);
  }
});

export default router;
