var server = require('./server/server');

server.configure('development');
server.run(__dirname);