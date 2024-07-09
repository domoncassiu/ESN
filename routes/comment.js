import express from 'express';
import Auth from '../middleware/auth.js';
import State from '../bin/State.js';
import Utils from '../utils/Utils.js';
import CommentController from '../controllers/CommentController.js';

const router = express.Router();

router.get('/:imageId', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const { page, pageSize, ascending, sender } = Utils.extractParameters(req);
    const commentController = new CommentController(
      State.getInstance().dbClient,
    );
    const comments = await commentController.fetchAllCommentsForImage(
      page,
      pageSize,
      ascending,
      imageId,
    );

    res.status(200).json(comments);
  } catch (err) {
    Utils.handleError(err, res);
  }
});

router.post(
  '/:albumName/:imageId',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const poster = req.decodedToken.username;
      const { imageId, albumName } = req.params;
      const { comment } = req.body;
      const posterId = req.decodedToken._id;
      const commentController = new CommentController(
        State.getInstance().dbClient,
      );
      const newComment = await commentController.addNewComment(
        imageId,
        posterId,
        poster,
        comment,
        albumName,
      );
      res.status(201).json(newComment);
    } catch (err) {
      console.log(err);
      Utils.handleError(err, res);
    }
  },
);

router.put(
  '/:imageId/live',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const poster = req.decodedToken.username;
      let imageId = req.params.imageId;
      const commentController = new CommentController(
        State.getInstance().dbClient,
      );
      await commentController.subscribeToCommentUpdate(imageId, poster);
      res.sendStatus(204);
    } catch (err) {
      Utils.handleError(err, res);
    }
  },
);

router.delete('/:imageId', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    const poster = req.decodedToken.username;
    const { imageId } = req.params;
    const commentController = new CommentController(
      State.getInstance().dbClient,
    );
    // delete entries from database
    const dbDeleteResult =
      await commentController.deleteAllCommentsFor(imageId);
    // Respond with a success message
    res.sendStatus(204);
  } catch (err) {
    Utils.handleError(err, res);
  }
});

export default router;
