import { Server } from 'socket.io';
import Auth from '../middleware/auth.js';
import WebsocketSubsystemError from '../exceptions/WebsocketSubsystemError.js';
import OnlineStatus from '../models/OnlineStatus.js';
import OnlineStatusEnum from '../models/OnlineStatusEnum.js';
import UserSocket from '../models/UserSocket.js';
import SafetyStatus from '../models/SafetyStatus.js';
import State from '../bin/State.js';
import ModeEnum from '../bin/ModeEnum.js';
import UnauthenticatedUser from '../models/UnauthenticatedUser.js';

export default class WebsocketSubsystem {
  io = null;
  dbClient = null;

  async close() {
    await this.io.close();
  }

  async sendPublicMessage(publicMessage) {
    if (State.getInstance().mode !== ModeEnum.TEST) {
      await this.io.to('public').emit('chat message', publicMessage);
    }
  }

  async onServerConnection(socket) {
    // join public and personal room
    socket.join('public');
    socket.join('announcement');

    // Join userId room
    socket.join(socket.decodedToken._id);

    await this.onSocketConnected(socket, 'public');

    socket.on(
      'disconnect',
      async () => await this.onSocketDisconnected(socket, 'public'),
    );
  }

  async onSocketConnected(socket, room) {
    let isLogout = false;
    let onlineStatus = new OnlineStatus(
      this.dbClient,
      socket.decodedToken._id,
      OnlineStatusEnum.ONLINE,
      Date.now(),
      Date.now(),
    );
    let usersocket = new UserSocket(
      this.dbClient,
      socket.decodedToken.username,
      socket.id,
    );
    await this.io.to(room).emit('online status', onlineStatus);

    // Join incident rooms
    let unauthenticatedUser = new UnauthenticatedUser(
      this.dbClient,
      socket.decodedToken.username,
      '',
    );
    console.log(unauthenticatedUser);
    let authenticatedUser = await unauthenticatedUser.getThisUsersData();
    if (authenticatedUser.memberOfIncidentIds !== undefined) {
      for (let incident of authenticatedUser.memberOfIncidentIds) {
        socket.join(incident);
        console.log('socket incidentId: ', incident);
      }
    }

    await onlineStatus.setUserOnlineStatus(isLogout);
    await usersocket.updateThisUserSocketId();
  }

  async onSocketDisconnected(socket, room) {
    console.log(this.dbClient);
    let isLogout = true;
    let lastOnline = Date.now();
    let onlineStatus = new OnlineStatus(
      this.dbClient,
      socket.decodedToken._id,
      OnlineStatusEnum.OFFLINE,
      lastOnline,
      Date.now(),
    );
    let usersocket = new UserSocket(
      this.dbClient,
      socket.decodedToken.username,
      socket.id,
    );
    await this.io.to(room).emit('online status', onlineStatus);
    await onlineStatus.setUserOnlineStatus(isLogout);
    await usersocket.deleteThisUserSocketId();
  }

  async onSafetyStatusChange(status, username) {
    let safetyStatus = new SafetyStatus(
      this.dbClient,
      'unused',
      status,
      Date.now(),
    );
    safetyStatus.username = username;
    if (State.getInstance().mode !== ModeEnum.TEST) {
      await this.io.emit('safety status', safetyStatus);
    }
  }

  async initialize() {
    try {
      console.log('Setting up websockets server...');

      // register auth middleware
      await this.io.use(Auth.getInstance().verifySocketToken);

      // register connection handler
      await this.io.on(
        'connection',
        async (socket) => await this.onServerConnection(socket),
      );
    } catch (err) {
      console.error(err);
      throw new WebsocketSubsystemError();
    }
  }

  async sendPrivateMessage(privateMessage) {
    if (State.getInstance().mode !== ModeEnum.TEST) {
      try {
        console.log('Private message needs to be sent: ', privateMessage);
        await this.io
          .to(privateMessage.senderId)
          .to(privateMessage.receiverId)
          .emit('private', privateMessage);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async sendReadMessage(senderId, receiverId) {
    if (State.getInstance().mode !== ModeEnum.TEST) {
      try {
        console.log('Read receipt emit to: ', senderId);
        await this.io.to(senderId).to(receiverId).emit('read', `${senderId}`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async sendTestingStoppedAlert() {
    try {
      await this.io.to('public').emit('testing', 'Test Stop');
    } catch (error) {
      throw new WebsocketSubsystemError();
    }
  }

  async sendTestingAlert() {
    try {
      await this.io.to('public').emit('testing', 'Test Start');
    } catch (error) {
      throw new WebsocketSubsystemError();
    }
  }
  async sendResourceRequest() {
    if (State.getInstance().mode !== ModeEnum.TEST) {
      await this.io.emit('new resource request', 'new data enter');
    }
  }
  async sendPublicAnnouncement(announcement) {
    try {
      await this.io.to('announcement').emit('announcement', {
        sender: announcement.sender,
        message: announcement.message,
        timestamp: announcement.timestamp,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendGroupMessage(groupMessage) {
    if (State.getInstance().mode !== ModeEnum.TEST) {
      try {
        console.log('Group message needs to be sent: ', groupMessage);
        await this.io.to(groupMessage.incidentId).emit('group', groupMessage);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async sendSheterUpdateAlert(shelter) {
    try {
      await this.io.to('public').emit('shelter', {
        name: shelter.name,
        address: shelter.address,
        capacity: shelter.capacity,
        longitude: shelter.longitude,
        latitude: shelter.latitude,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async joinAlbumRoom(albumName, username) {
    try {
      let userSocket = await UserSocket.getSocketIdForUser(
        this.dbClient,
        username,
      );
      console.log('inhere', username, userSocket);
      const currSocket = await this.io.in(userSocket.socketid).fetchSockets();
      for (const socket of currSocket) {
        await socket.join(albumName);
      }

      await this.io.to(albumName).emit('joinedAlbumRoom', 'success');
    } catch (err) {
      console.log(err);
    }
  }

  async onNewImage(albumName) {
    try {
      await this.io.to(albumName).emit('newImage', 'success Image');
    } catch (err) {
      console.log(err);
    }
  }

  async onDeleteImage(albumName) {
    try {
      await this.io.to(albumName).emit('deleteImage', 'success Image');
    } catch (err) {
      console.log(err);
    }
  }

  async joinImageRoom(imageId, username) {
    try {
      let userSocket = await UserSocket.getSocketIdForUser(
        this.dbClient,
        username,
      );
      console.log('inhere', username, userSocket);
      const currSocket = await this.io.in(userSocket.socketid).fetchSockets();
      for (const socket of currSocket) {
        await socket.join(imageId);
      }

      await this.io.to(imageId).emit('joinedImageRoom', 'success');
    } catch (err) {
      console.log(err);
    }
  }

  async sendNewComment(imageId, comment) {
    try {
      await this.io.to(imageId).emit('comment', {
        username: comment.poster,
        message: comment.comment,
        safetyStatus: comment.safetyStatus,
        timestamp: comment.timestamp,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onUserInfoUpdate(updateId, isActive, token) {
    try {
      await this.io.to('public').emit('infochange', {
        userId: updateId,
        isActive: isActive,
        newToken: token,
      });
    } catch (error) {
      console.log(error);
    }
  }

  constructor(dbClient, server, options) {
    this.dbClient = dbClient;
    this.io = new Server(server, options);
  }
}
