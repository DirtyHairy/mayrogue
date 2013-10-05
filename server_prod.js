var server = require('./server/server');

server.configure('production');
server.run(__dirname);