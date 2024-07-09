import UnauthorizedError from '../exceptions/UnauthorizedError.js';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../secrets.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import LoggedInUser from '../models/LoggedInUser.js';
import ErrorResponse from '../models/ErrorResponse.js';
import State from '../bin/State.js';
import ModeEnum from '../bin/ModeEnum.js';
import NonTestUserDuringTest from '../exceptions/NonTestUserDuringTest.js';
import UserType from '../models/UserType.js';

class Auth {
  async verifyToken(
    req,
    res,
    next,
    allowedRoles = [UserType.CITIZEN, UserType.COORDINATOR, UserType.ADMIN],
  ) {
    console.log('req.session: ', req.session);
    // Middleware function to verify REST API request tokens
    if (
      State.getInstance().mode === ModeEnum.TEST &&
      (req.session === null ||
        req.session === undefined ||
        req.session.testing === null ||
        req.session.testing === undefined ||
        req.session.testing !== true)
    ) {
      // During a test, only allow the admin who started the test to proceed
      return res
        .status(503)
        .send(new ErrorResponse(new NonTestUserDuringTest()));
    }
    try {
      let headerParts = req.headers['authorization'].split(' ');

      // If it is not a bearer token
      if (headerParts.length !== 2 || headerParts[0] !== 'Bearer') {
        // return http unauthorized error
        return res
          .status(401)
          .send(
            new ErrorResponse(new UnauthorizedError('Invalid token format')),
          );
      }
      let token = headerParts[1];
      let decoded = null;

      try {
        decoded = await jsonwebtoken.verify(token, secrets.tokenSigningSecret, {
          expiresIn: secrets.jwtExpiry,
        });
        console.log(decoded);
        req.decodedToken = decoded;
        if (!allowedRoles.includes(decoded.type)) {
          throw new ForbiddenError();
        }
        next();
      } catch (err) {
        console.log(err);
        res.status(403).send(new ErrorResponse(new ForbiddenError()));
      }
    } catch (err) {
      res.status(401).send(new ErrorResponse(new UnauthorizedError()));
    }
  }

  async verifySocketToken(socket, next) {
    try {
      let token = socket.handshake.auth.token;

      socket.decodedToken = await jsonwebtoken.verify(
        token,
        secrets.tokenSigningSecret,
        {
          expiresIn: secrets.jwtExpiry,
        },
      );
      next();
    } catch (err) {
      next(err);
    }
  }

  async getUsernameFromToken(token) {
    try {
      let decoded = await jsonwebtoken.verify(
        token,
        secrets.tokenSigningSecret,
      );
      if (
        decoded === null ||
        decoded === undefined ||
        decoded.username === null ||
        decoded.username === undefined
      ) {
        throw new ForbiddenError();
      }
      return decoded.username;
    } catch (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          new UnauthorizedError();
        case 'JsonWebTokenError':
          throw new ForbiddenError();
        default:
          throw new InternalServerError();
      }
    }
  }

  async generateToken(user) {
    let loggedInUser = new LoggedInUser(user.username, user._id, user.type);
    if (!loggedInUser.isValid()) {
      throw new ForbiddenError();
    }
    try {
      return await jsonwebtoken.sign(
        JSON.parse(JSON.stringify(loggedInUser)),
        secrets.tokenSigningSecret,
        {
          expiresIn: secrets.jwtExpiry,
        },
      );
    } catch (err) {
      console.error(err);
      console.trace();
      throw new InternalServerError();
    }
  }

  static instance = null;
  static getInstance() {
    if (Auth.instance === null || Auth.instance === undefined) {
      console.log('in here');
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  verifyAdmin = (req, res, next) => {
    this.verifyToken(req, res, next, [UserType.ADMIN]);
  };
  verifyCoord = (req, res, next) => {
    this.verifyToken(req, res, next, [UserType.COORDINATOR, UserType.ADMIN]);
  };
}

export default Auth;
