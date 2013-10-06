"use strict";

require('./bootstrap.js').bootstrap(__dirname);

var server = require('./server/server');

server.setRoot(__dirname);
if (process.env.PORT) {
    server.setPort(process.env.PORT);
}

server.setEnvironment();
server.dispatch();