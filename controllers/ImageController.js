import ESNAlbumEnum from '../models/ESNAlbumEnum.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import Image from '../models/Image.js';
import WebsocketSubsystemError from '../exceptions/WebsocketSubsystemError.js';
import State from '../bin/State.js';
import ImageDeleteError from '../exceptions/ImageDeleteError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import InvalidAlbumError from '../exceptions/InvalidAlbumError.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';

class ImageController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchAllImagesInAlbum(page, pageSize, ascending, albumName) {
    return new Promise(async (resolve, reject) => {
      try {
        let images = await Image.fetchAllImagesInAlbum(
          this.dbClient,
          page,
          pageSize,
          ascending,
          { album: albumName },
        );
        resolve(images);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchSingleImage(albumName, imageId) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('cornhole', albumName, imageId);
        let image = await Image.fetchOneImage(
          this.dbClient,
          albumName,
          imageId,
        );
        if (!image || image == [] || image === null) {
          reject(new NotFoundError());
        }
        console.log(image);

        if (image) {
          let imageReturn = new Image(
            this.dbClient,
            image.imageId,
            image.posterId,
            image.imageUrl,
            image.album,
            image.timestamp,
          );
          delete imageReturn.dbClient;
          delete imageReturn.imageDAO;
          let poster = await AuthenticatedUser.getUserById(
            this.dbClient,
            image.posterId,
          );
          imageReturn.poster = poster.username;
          resolve(imageReturn);
        }
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async addImageToAlbum(imageId, posterId, imageUrl, albumName) {
    return new Promise(async (resolve, reject) => {
      try {
        // if (!Object.values(ESNAlbumEnum).includes(albumName)) {
        //   reject(new InvalidAlbumError());
        // }
        let image = new Image(
          this.dbClient,
          imageId,
          posterId,
          imageUrl,
          albumName,
          Date.now(),
        );
        await State.getInstance().websocketSubsystem.onNewImage(albumName);
        await image.insertThisImage();
        resolve(image);
      } catch (err) {
        console.log(err);
        reject(new InternalServerError());
      }
    });
  }

  async subscribeToUploadUpdate(albumName, poster) {
    return new Promise(async (resolve, reject) => {
      try {
        await State.getInstance().websocketSubsystem.joinAlbumRoom(
          albumName,
          poster,
        );
        resolve();
      } catch (err) {
        reject(new WebsocketSubsystemError());
      }
    });
  }

  async deleteImageEntryFromDb(posterId, albumName, imageId) {
    return new Promise(async (resolve, reject) => {
      try {
        let image = new Image(
          this.dbClient,
          imageId,
          'unused',
          'unused',
          'unused',
          Date.now(),
        );
        const imgToDelete = await Image.fetchOneImage(
          this.dbClient,
          albumName,
          imageId,
        );
        if (imgToDelete && imgToDelete.posterId === posterId) {
          await image.deleteThisImage();
          await State.getInstance().websocketSubsystem.onDeleteImage(albumName);
          resolve(image);
        } else {
          reject(new ImageDeleteError());
        }
      } catch (err) {
        console.log(err);
        reject(new InternalServerError());
      }
    });
  }
  async deleteAlbumFromDb(albumName) {
    return new Promise(async (resolve, reject) => {
      try {
        await Image.deleteAlbum(this.dbClient, albumName);
        //await State.getInstance().websocketSubsystem.onDeleteImage(albumName);
        resolve();
      } catch (err) {
        console.log(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default ImageController;
