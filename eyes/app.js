/*jslint node: true */
/* eslint-env node */
'use strict';

// Require express, socket.io, and vue
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
 
// Pick arbitrary port for server
var port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));
// Serve vue from node_modules as vue/
app.use('/vue', express.static(path.join(__dirname, '/node_modules/vue/dist/')));
// Serve index.html directly as root page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/mover', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/mover.html'));
});



io.on('connection', function (socket) {

/********************
HERE YOU CAN ADD COMMAND MESSAGES.
These are not associated with any logical operations
*********************/
  socket.on('move:eyes', function (eyes) {
    io.emit('move:eyes', eyes);
  });
  socket.on('move:motors', function (motors) {
    io.emit('move:motors', motors);
  });
  // Just to confirm...
  socket.on('moved:motors', function (motors) {
    io.emit('moved:motors', motors);
  });
});

var server = http.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});