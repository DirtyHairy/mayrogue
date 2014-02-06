"use strict";

var Util = require('./shared/util'),
    express = require('express'),
    server = require('http'),
    io = require('socket.io'),
    _ = require('underscore'),
    RandomWorld = require('./randomWorld'),
    Change = require('./shared/change'),
    Tiles = require('./shared/tiles'),
    PlayerContext = require('./playerContext'),
    Stats = require('./shared/stats'),
    Entity = require('./shared/entity'),
    Action = require('./action');

var Server = Util.extend(Util.Base, {
    _app: null,
    _server: null,
    _io: null,
    _port: 3000,
    
    _useBuild: true,
    
    properties: ['root', 'port',
        {field: '_useBuild', getter: true},
        {field: '_world', getter: true},
        {field: '_players', getter: true}
    ],
    
    create: function() {
        var me = this;
        
        me._app = express();
        
        me._server = server.createServer(me._app);
        me._io = io.listen(me._server);
    },
    
    setEnvironment: function(environment) {
        var me = this;
        
        // setup environments
        var configuration = {
            'development': function() {
                me._app.use(express.logger('dev'));
            },
            'production': function() {
                me._io.set('log level', 1); // set log level to error and warn
                me._useBuild = true;
                me._app.use(express.compress());
            },
            'heroku': function() {
                this.production(); // apply production settings
    
                // disable websockets on heroku ceder stack
                me._io.set("transports", ["xhr-polling"]);
                me._.set("polling duration", 10);
            }
        }
    
        if (environment && configuration[environment]) {
            configuration[environment]();
        }
        else {
            _.each(configuration, function(func, env, obj) {
                me._app.configure(env, _.bind(func, obj));
            });
        }
    },
    
    _initServer: function() {
        var me = this,
            root = me.getRoot();

        me._app.get('/', function(req, res) {
            res.sendfile(root + '/frontend/index.html');
        });
        me._app.get('/index.html', function(req, res) {
            res.sendfile(root + '/frontend/index.html');
        });

        // If we use the build, override /frontend/application.js with the built module
        if (me._useBuild) {
            me._app.get('/frontend/application.js', function(req, res) {
                res.sendfile(root + '/frontend/application.build.js');
            });
        }

        // Statically serve all other required directories
        me._app.use('/frontend/', express.static(root + '/frontend/'));
        me._app.use('/shared/', express.static(root + '/shared/'));
        me._app.use('/bower_components/', express.static(root + '/bower_components/'));
    },
    
    _serve: function() {
        var me = this;
        
        console.log("Server start on port " + me._port);
        me._server.listen(me._port);
    },
    
    _createWorld : function() {
        var me = this;
        
        me._world = new RandomWorld({
            width: 35,
            height: 40
        });
    },
    
    _initPlayer: function(socket, username) {
        var me = this;
        
        var shapes = {
            0: Tiles.HUNTER,
            1: Tiles.WARRIOR,
            2: Tiles.MAGE
        };
    
        var player = me._world.addNewRandomEntity({
            shape: shapes[_.random(2)],
            stats: new Stats({
                hp: 20,
                maxHp: 20,
                name: username
            }),
            role: Entity.Role.PLAYER
        });
    
        var playerContext = new PlayerContext({
            entity: player,
            connection: socket
        });
    
        return playerContext;        
    },
    
    // TODO: this should be refactored into a playerConnection class
    _bindConnectionHandlers: function() {
        var me = this;
        
        me._io.sockets.on('connection', function(socket) {
            var playerContext = null,
                player = null;
    
            socket.on('login', function(data) {
                playerContext = me._initPlayer(socket, data.username);
                player = playerContext.getEntity();
                me._players.push(playerContext);
    
                // We only push the player himself during init, the remaining
                // entities will be part of the first update
                socket.emit('welcome', {
                    map: me._world.getMap().serialize(),
                    entities: [player.serialize()],
                    playerId: player.getId()
                });
            });
    
            socket.on('action', function(data) {
                if (!playerContext) return;
    
                var action = Action.unserialize(data.action);
                playerContext.getEntity().fireEvent('action', action);
    
                playerContext.setGeneration(data.generation);
            });
    
            socket.on('disconnect', function() {
                if (player) {
                    me._world.removeEntity(player);
                }
                me._players = _.without(me._players, playerContext);
            });
        });
    },
    
    _processCycle: function() {
        var me = this;
        
        _.each(me._world.getEntities(), function(entity) {
            entity.fireEvent('tick');
        });
    
        _.each(me._players, function(player) {
            var changeset = me._world.pickupChangeset(player);
    
            if (changeset.length > 0) {
                player.getConnection().volatile.emit('update', {
                    generation: player.getGeneration(),
                    changeset: _.map(changeset, Change.serialize)
                });
            }
        });
    
        me._world.clearChanges();
    },
    
    _startHartbeat: function() {
        var me = this;
        
        setInterval(function() {
            me._processCycle();
        }, 200);
    },
    
    dispatch: function(root) {
        var me = this;
        
        me._initServer();
        
        me._createWorld();
        me._players = [];
        
        me._bindConnectionHandlers();
        
        me._startHartbeat();
        me._serve();
    }
});

var serverInstance = new Server();

module.exports = serverInstance;