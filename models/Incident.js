import IncidentDAO from '../dao/IncidentDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import IncidentStatusEnum from './IncidentStatusEnum.js';

export default class Incident {
  incidentDAO = null;

  constructor(
    dbClient,
    incidentId,
    name,
    event,
    longitude,
    latitude,
    incidentStatus,
    moderatorUserId,
    membersList,
    timestamp = Date.now(),
  ) {
    this.incidentId = incidentId;
    this.name = name;
    this.event = event;
    this.longitude = longitude;
    this.latitude = latitude;
    this.incidentStatus = incidentStatus;
    this.moderatorUserId = moderatorUserId;
    this.membersList = membersList;
    this.timestamp = timestamp;
    this.incidentDAO = new IncidentDAO(dbClient);
  }

  async insertThisIncident() {
    try {
      return await this.incidentDAO.create(this);
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  async updateIncident(updateObject) {
    try {
      const filter = { incidentId: this.incidentId };
      const update = updateObject;
      const options = {
        upsert: false,
        includeResultMetadata: true,
        new: true,
      };
      return await this.incidentDAO.update(filter, update, options);
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }

  static async fetchIncident(dbClient, incidentId) {
    try {
      let incidentDAO = new IncidentDAO(dbClient);
      console.log(incidentId);
      let result = await incidentDAO.read({ incidentId: incidentId });
      let incident = new Incident(
        dbClient,
        result.incidentId,
        result.name,
        result.event,
        result.longitude,
        result.latitude,
        result.incidentStatus,
        result.moderatorUserId,
        result.membersList,
        result.timestamp,
      );
      console.log('Incident: ', incident, ' and incidentId: ', incidentId);
      return incident;
    } catch (err) {
      console.error(err);
      throw new InvalidEntryError();
    }
  }

  static async addMemberToIncident(dbClient, incidentId, userId) {
    console.log('Incident ', incidentId, ' is adding ', userId);
    let incident = null;
    try {
      incident = await Incident.fetchIncident(dbClient, incidentId);
    } catch (err) {
      throw new InvalidEntryError();
    }
    console.log('Incident ', incident, ' had ', incident.membersList);
    try {
      if (incident.membersList.includes(userId)) {
        return;
      }
      let newMembersList = incident.membersList;
      newMembersList.push(userId);
      console.log('Incident ', incidentId, ' should have ', newMembersList);
      const filter = { incidentId: incidentId };
      const update = { membersList: newMembersList };
      const options = {
        upsert: false,
        includeResultMetadata: true,
        new: true,
      };
      return await new IncidentDAO(dbClient).update(filter, update, options);
    } catch (err) {
      throw new InvalidEntryError();
    }
  }

  static async removeMemberFromIncident(dbClient, incidentId, userId) {
    console.log('Incident ', incidentId, ' is removing ', userId);

    // Check if incident exists
    let incident = null;
    try {
      incident = await Incident.fetchIncident(dbClient, incidentId);
    } catch (err) {
      throw new InvalidEntryError();
    }

    // Incident should be active
    if (incident.incidentStatus === IncidentStatusEnum.ARCHIVED) {
      throw new InvalidEntryError();
    }

    // if last person, mark status as archived
    if (incident.membersList.length === 1) {
      let update = {
        incidentStatus: IncidentStatusEnum.ARCHIVED,
        membersList: [],
        moderatorUserId: '',
      };
      await incident.updateIncident(update);
    } else {
      // if not last person, update moderator
      let index = incident.membersList.indexOf(userId);
      incident.membersList.splice(index, 1);
      if (index >= 0) {
        let update = {
          membersList: incident.membersList,
          moderatorUserId: incident.membersList[0],
        };
        await incident.updateIncident(update);
      }
    }
  }

  static async fetchAllIncidents(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = false,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      const results = await new IncidentDAO(dbClient).readAllWithPagination(
        condition,
        { timestamp: order },
        pageSize,
        page,
      );
      return results;
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }
}
