#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import debug from 'debug';
import http from 'http';
import WebsocketSubsystem from '../subsystems/WebsocketSubsystem.js';
import MongooseDBClient from '../clients/MongooseDBClient.js';
import TestDBClient from '../clients/TestDBClient.js';
import State from './State.js';
import UserController from '../controllers/UserController.js';
import User from '../models/User.js';

/**
 * Get port from environment and store in Express.
 */

let port = parseInt(normalizePort(process.env.PORT || '3000'));
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

// add costant host ip for phone debugging
// http://10.21.153.207:3000/static/html/index.html
// const host = '192.168.68.74';
// server.listen(port, host);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {
  // Display app status
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  // connect to db
  MongooseDBClient.getInstance().connect();

  // connect to testdb
  TestDBClient.getInstance().connect();

  State.getInstance()
    .setServer(server)
    .then((r) => debug('Websocket server initialized.'));

  console.log('initializing admin');
  const userController = new UserController(State.getInstance().dbClient);
  await userController.initializeAdmin();
  debug('Listening on ' + bind);
}
