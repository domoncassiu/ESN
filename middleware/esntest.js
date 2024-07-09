import State from '../bin/State.js';
import ModeEnum from '../bin/ModeEnum.js';
import session from 'express-session';
import secrets from '../secrets.js';
export default {
  testMode: function (middleware) {
    return function (req, res, next) {
      if (State.getInstance().mode === ModeEnum.TEST) {
        middleware(req, res, next);
      } else {
        next();
      }
    };
  },
  sessionHandler: session({
    secret: secrets.testSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
};
