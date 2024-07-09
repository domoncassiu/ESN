import aws from 'aws-sdk';
import multer from 'multer';
import express from 'express';
import Auth from '../middleware/auth.js';
import ImageController from '../controllers/ImageController.js';
import State from '../bin/State.js';
import Utils from '../utils/Utils.js';
import secrets from '../secrets.js';
import dotenv from 'dotenv';
import Image from '../models/Image.js';
dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/allalbums', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    // let uniqueAlbumNames = await Image.findDistinceAlbum(
    //   State.getInstance().dbClient,
    // );
    // let filteredAlbums = uniqueAlbumNames.filter(
    //   (album) =>
    //     !['Community', 'Incident', 'Evacuation', 'Supply', 'Safety'].includes(
    //       album,
    //     ),
    // );
    // let toReturn = new Set(filteredAlbums);
    const params = {
      Bucket: secrets.awsBucketName,
      Delimiter: '/',
    };

    s3.listObjectsV2(params, function (err, data) {
      if (err) {
        throw new Error('S3 ListObject Error');
      } else {
        let folders = data.CommonPrefixes.map((prefix) => prefix.Prefix);
        console.log('Folders in S3 bucket:', folders);
        folders = folders.filter(
          (name) =>
            ![
              'Community/',
              'Incident/',
              'Evacuation/',
              'Supply/',
              'Shelter/',
              'test/',
            ].includes(name),
        );
        res.status(200).json({ folders });
      }
    });
  } catch (err) {
    Utils.handleError(err, res);
  }
});

router.post(
  '/:albumName',
  Auth.getInstance().verifyToken,
  upload.array('images', 5),
  async (req, res) => {
    try {
      const poster = req.decodedToken.username;
      const posterId = req.decodedToken._id;
      // upload to s3 first
      const albumName = req.params.albumName;
      const uploadPromises = req.files.map((file) =>
        createUploadPromises(file, albumName),
      );
      console.log(process.env.AWS_BUCKET_REGION);
      const uploadFiles = await Promise.all(uploadPromises);
      // upload to mongoDB
      console.log('post amazon');
      const imageController = new ImageController(State.getInstance().dbClient);
      //   let imgIdArr = [];
      let imgIdArr = await Promise.all(
        uploadFiles.map(async (file) => {
          const imageUrl = file.Location;
          const imageId = file.Key.split('/').pop();
          const indivUpload = await imageController.addImageToAlbum(
            imageId,
            posterId,
            imageUrl,
            albumName,
          );
          return indivUpload.imageId;
        }),
      );
      // Respond with a success message
      res.status(201).send({ imageIdArr: imgIdArr });
    } catch (err) {
      console.log(err);
      Utils.handleError(err, res);
    }
  },
);

router.get('/:albumName', Auth.getInstance().verifyToken, async (req, res) => {
  try {
    let albumName = req.params.albumName;
    const { page, pageSize, ascending, sender } = Utils.extractParameters(req);
    const imageController = new ImageController(State.getInstance().dbClient);
    const images = await imageController.fetchAllImagesInAlbum(
      page,
      pageSize,
      ascending,
      albumName,
    );
    res.status(200).json(images);
  } catch (err) {
    Utils.handleError(err, res);
  }
});

router.get(
  '/:albumName/:imageId',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      let { albumName, imageId } = req.params;
      const imageController = new ImageController(State.getInstance().dbClient);
      const image = await imageController.fetchSingleImage(albumName, imageId);
      res.status(200).json(image);
    } catch (err) {
      Utils.handleError(err, res);
    }
  },
);

router.put(
  '/:albumName/live',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const poster = req.decodedToken.username;
      let albumName = req.params.albumName;
      const imageController = new ImageController(State.getInstance().dbClient);
      await imageController.subscribeToUploadUpdate(albumName, poster);
      res.sendStatus(204);
    } catch (err) {
      Utils.handleError(err, res);
    }
  },
);

router.delete(
  '/:albumName/:imageId',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const posterId = req.decodedToken._id;
      const { imageId, albumName } = req.params;
      const deleteResult = await deleteImageFromS3Promise(
        secrets.awsBucketName,
        `${albumName}/${imageId}`,
      );
      // delete entries from database
      const imageController = new ImageController(State.getInstance().dbClient);
      const dbDeleteResult = await imageController.deleteImageEntryFromDb(
        posterId,
        albumName,
        imageId,
      );
      // Respond with a success message
      res.sendStatus(204);
    } catch (err) {
      Utils.handleError(err, res);
    }
  },
);

router.delete(
  '/:albumName',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      const posterId = req.decodedToken._id;
      const { albumName } = req.params;
      const deleteResult = await emptyS3Directory(
        secrets.awsBucketName,
        `${albumName}/`,
      );
      // delete entries from database
      const imageController = new ImageController(State.getInstance().dbClient);
      const dbDeleteResult = await imageController.deleteAlbumFromDb(albumName);
      // Respond with a success message
      res.sendStatus(204);
    } catch (err) {
      Utils.handleError(err, res);
    }
  },
);

router.post(
  '/new/:albumName',
  Auth.getInstance().verifyToken,
  async (req, res) => {
    try {
      let { albumName } = req.params;
      s3.putObject(
        {
          Bucket: secrets.awsBucketName,
          Key: (albumName += '/'),
        },
        function (err, data) {
          if (err) {
            throw new Error('S3 Album Creation Error');
          }
        },
      );
      // Respond with a success message
      res.status(201).send({ albumName: albumName });
    } catch (err) {
      Utils.handleError(err, res);
    }
  },
);

async function createUploadPromises(file, albumName) {
  // Get the current date and time
  const currentDate = Date.now();

  // Get the original filename and extension
  const originalFilename = file.originalname;
  const fileExtension = originalFilename.split('.').pop();

  // Generate the new filename with the desired format
  const newFilename = `${albumName}_${currentDate}.${fileExtension}`;
  const params = {
    Bucket: secrets.awsBucketName,
    Key: `${albumName}/${newFilename}`,
    Body: file.buffer,
    Metadata: {
      'Content-Type': `image/${fileExtension}`,
    },
  };

  return new Promise(async (resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function deleteImageFromS3Promise(bucket, key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    // Delete the object
    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function emptyS3Directory(bucket, dir) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir,
  };

  return new Promise((resolve, reject) => {
    console.log('iamge it here');
    console.log(listParams);
    s3.listObjects(listParams, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (data.Contents.length === 0) {
        resolve();
        return;
      }
      console.log('igot thsiomke');
      const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] },
      };

      data.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      s3.deleteObjects(deleteParams, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        if (data.Errors && data.Errors.length > 0) {
          reject(new Error('Failed to delete one or more objects.'));
          return;
        }

        resolve();
      });
    });
  });
}

export default router;
