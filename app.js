import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import chatRoomsRouter from './routes/chatRooms.js';
import esntestRouter from './routes/esntest.js';
import announcementsRouter from './routes/announcement.js';
import resourceRouter from './routes/resource.js';
import resourceHelpRouter from './routes/resourceHelp.js';
import searchRouter from './routes/search.js';
import incidentsRouter from './routes/incidents.js';

import shelterReviewRouter from './routes/shelterReviews.js';
import shelterRouter from './routes/shelter.js';
import imageRouter from './routes/image.js';
import commentRouter from './routes/comment.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import EsnTest from './middleware/esntest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/speedtests', esntestRouter);

// session middleware ONLY for TEST mode
app.use(EsnTest.testMode(EsnTest.sessionHandler));

app.use('/static', express.static('views'));
app.use('/auth', authRouter);
app.use('/chatRooms', chatRoomsRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/announcements', announcementsRouter);
app.use('/incidents', incidentsRouter);
app.use('/resource', resourceRouter);
app.use('/resourceHelp', resourceHelpRouter);
app.use('/shelterReviews', shelterReviewRouter);
app.use('/shelters', shelterRouter);
app.use('/galleries', imageRouter);
app.use('/comments', commentRouter);
app.get('/', (req, res) => {
  res.redirect(301, '/static/html/register_page.html');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
