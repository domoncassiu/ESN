import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import Incident from '../models/Incident.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import GroupMessage from '../models/GroupMessage.js';
import State from '../bin/State.js';
import IncidentStatusEnum from '../models/IncidentStatusEnum.js';
import { uuid } from 'uuidv4';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';
import Sentiment from '../models/Sentiment.js';
import NaturalLanguageClient from '../clients/NaturalLanguageClient.js';
import DatabaseError from '../exceptions/DatabaseError.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';

export default class IncidentController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async createNewIncident(userId, name, event, longitude, latitude) {
    if (!name || !event || !longitude || !latitude) {
      throw new InvalidEntryError();
    }
    try {
      let incident = new Incident(
        this.dbClient,
        uuid(),
        name,
        event,
        longitude,
        latitude,
        IncidentStatusEnum.ACTIVE,
        userId,
        [userId],
        Date.now(),
      );
      let result = await AuthenticatedUser.getUserById(this.dbClient, userId);

      let authenticatedUser = new AuthenticatedUser(
        this.dbClient,
        result.username,
        result.password,
        result.type,
        result.acknowledged,
        result.isActive,
        result.memberOfIncidentIds,
        result._id,
      );

      await authenticatedUser.becomeMemberOfIncident(incident.incidentId);

      return await incident.insertThisIncident();
    } catch (err) {
      console.error(err);
      throw new InvalidEntryError();
    }
  }

  async joinIncident(incidentId, userId) {
    try {
      let result = await AuthenticatedUser.getUserById(this.dbClient, userId);
      if (result === null) {
        throw new InvalidEntryError();
      }
      let authenticatedUser = new AuthenticatedUser(
        this.dbClient,
        result.username,
        result.password,
        result.type,
        result.acknowledged,
        result.isActive,
        result.memberOfIncidentIds,
        result._id,
      );

      await authenticatedUser.becomeMemberOfIncident(incidentId);
      return await Incident.addMemberToIncident(
        this.dbClient,
        incidentId,
        userId,
      );
    } catch (e) {
      // TODO: ensure that there is consistency in case of an exception
      console.error(e);
      throw new InvalidEntryError();
    }
  }

  async fetchAllIncidents(page, pageSize, ascending, incidentId = null) {
    try {
      let condition = {};
      if (incidentId !== null && incidentId !== undefined) {
        condition = {
          incidentId: incidentId,
        };
      }

      let results = await Incident.fetchAllIncidents(
        this.dbClient,
        page,
        pageSize,
        ascending,
        condition,
      );
      return results;
    } catch (err) {
      console.error(err);
      throw new InternalServerError();
    }
  }

  async fetchIncident(userId, incidentId) {
    let incident = null;
    try {
      console.log(incidentId);
      let incidentResult = await Incident.fetchIncident(
        this.dbClient,
        incidentId,
      );
      incident = JSON.parse(JSON.stringify(incidentResult));
    } catch (err) {
      console.error(err);
      throw new InvalidEntryError();
    }
    try {
      let membersListData = [];
      let userIdArray = incident.membersList;
      const condition = {
        _id: { $in: userIdArray },
      };

      const users = await AuthenticatedUser.findAllUsers(
        this.dbClient,
        condition,
      );

      users.map((user) => {
        if (user._id.toString() === incident.moderatorUserId) {
          incident.moderator = user;
        }
        membersListData.push(user);
      });
      incident.membersListData = membersListData;
      let isMember = false;
      if (incident.membersList.includes(userId)) {
        isMember = true;
      }
      incident['isMember'] = isMember;

      return incident;
    } catch (err) {
      console.error(err);
      console.error(err);
      throw new InvalidEntryError();
    }
  }

  async fetchAllMessages(incidentId, page, pageSize, ascending) {
    try {
      let results = await GroupMessage.fetchAllGroupMessages(
        this.dbClient,
        page,
        pageSize,
        ascending,
        { incidentId: incidentId },
      );
      let parsedData = JSON.parse(JSON.stringify(results));
      let userMap = {};
      const userSet = new Set();
      parsedData.map((entry) => userSet.add(entry.senderId));
      let userIdArray = Array.from(userSet);
      const condition = {
        _id: { $in: userIdArray },
      };
      console.log(condition);
      const users = await AuthenticatedUser.findAllUsers(
        this.dbClient,
        condition,
      );
      users.map((user) => (userMap[user._id] = user));
      let response = parsedData.map((entry) => {
        return {
          ...entry,
          username: userMap[entry.senderId].username,
        };
      });
      return response;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async fetchMessage(incidentId, messageId) {
    let message = await GroupMessage.fetchOneGroupMessage(
      this.dbClient,
      incidentId,
      messageId,
    );
    return message;
  }

  async storeNewMessage(senderId, username, message, incidentId) {
    let sentiment =
      await NaturalLanguageClient.getInstance().getSentiment(message);
    let groupMessage = new GroupMessage(
      this.dbClient,
      uuid(),
      senderId,
      message,
      SafetyStatusEnum.OK,
      Date.now(),
      incidentId,
      sentiment,
    );
    await groupMessage.insertThisMessage();
    let newMessage = JSON.parse(JSON.stringify(groupMessage));
    newMessage['username'] = username;
    await State.getInstance().websocketSubsystem.sendGroupMessage(newMessage);

    // // Contact sentiment analysis API
    // await this.performSentimentAnalysis(groupMessage);

    return groupMessage;
  }

  // async performSentimentAnalysis(groupMessage) {
  //   let sentiment = await NaturalLanguageClient.getInstance().getSentiment(
  //     groupMessage.message,
  //   );
  //   // Update sentiment in group message and store it
  //   await GroupMessage.updateMessageSentiment(
  //     this.dbClient,
  //     groupMessage.messageId,
  //     sentiment,
  //   );
  // }

  async leaveIncident(userId, incidentId) {
    // Remove userId from incident
    await Incident.removeMemberFromIncident(this.dbClient, incidentId, userId);

    // Update memberOfIncidentIds after removing userId
    try {
      let result = await AuthenticatedUser.getUserById(this.dbClient, userId);
      console.log('RESULT IS: ', result);
      let authenticatedUser = new AuthenticatedUser(
        this.dbClient,
        result.username,
        result.password,
        result.type,
        result.acknowledged,
        result.isActive,
        result.memberOfIncidentIds,
        result._id,
      );
      return await authenticatedUser.removeSelfFromIncident(incidentId);
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  async updateSentiment(sentiment, messageId, incidentId) {
    console.log(
      'Moderator wants to update sentiment of groupMessage ',
      messageId,
      ' to ',
      sentiment,
    );
    return await GroupMessage.updateMessageSentiment(
      this.dbClient,
      messageId,
      sentiment,
    );
  }
}
