import InternalServerError from '../exceptions/InternalServerError.js';
import Comment from '../models/Comment.js';
import { uuid } from 'uuidv4';
import SafetyStatus from '../models/SafetyStatus.js';
import State from '../bin/State.js';
import WebsocketSubsystemError from '../exceptions/WebsocketSubsystemError.js';
import Image from '../models/Image.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';

class CommentController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchAllCommentsForImage(page, pageSize, ascending, imageId) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = { imageId: imageId };
        let comments = await Comment.fetchAllCommentsForImage(
          this.dbClient,
          page,
          pageSize,
          ascending,
          condition,
        );
        let mappedComments = await Promise.all(
          comments.map(async (result) => {
            let comment = new Comment(
              this.dbClient,
              result.commentId,
              result.posterId,
              result.imageId,
              result.safetyStatus,
              result.comment,
              result.albumName,
              result.timestamp,
            );
            delete comment.commentDAO;
            delete comment.dbClient;
            let poster = await AuthenticatedUser.getUserById(
              this.dbClient,
              comment.posterId,
            );
            comment.poster = poster.username;
            return comment;
          }),
        );
        resolve(mappedComments);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async addNewComment(imageId, posterId, poster, comment, albumName) {
    return new Promise(async (resolve, reject) => {
      try {
        let newComment = new Comment(
          this.dbClient,
          uuid(),
          posterId,
          imageId,
          await SafetyStatus.fetchMostRecentSafetyStatus(
            this.dbClient,
            posterId,
          ),
          comment,
          albumName,
          Date.now(),
        );
        newComment.poster = poster;
        const image = await Image.fetchOneImage(
          this.dbClient,
          albumName,
          imageId,
        );
        if (image) {
          await newComment.insertThisComment();
          await State.getInstance().websocketSubsystem.sendNewComment(
            imageId,
            newComment,
          );
          resolve(newComment);
        } else {
          reject(new NotFoundError());
        }
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async subscribeToCommentUpdate(imageId, poster) {
    return new Promise(async (resolve, reject) => {
      try {
        await State.getInstance().websocketSubsystem.joinImageRoom(
          imageId,
          poster,
        );
        resolve();
      } catch (err) {
        reject(new WebsocketSubsystemError());
      }
    });
  }

  async deleteAllCommentsFor(imageId) {
    return new Promise(async (resolve, reject) => {
      try {
        let deleteResult = await Comment.deleteAllCommentsFor(
          this.dbClient,
          imageId,
        );
        resolve(deleteResult);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default CommentController;
