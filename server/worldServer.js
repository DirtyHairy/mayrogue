// vim:softtabstop=4:shiftwidth=4

"use strict";

var Util = require('./client/util'),
    Change = require('./client/change'),
    WorldBase  = require('./client/worldBase'),
    Geometry = require('./client/geometry'),
    _ = require('underscore');

var World = Util.extend(WorldBase, {

    _changeset: null,

    create: function() {
        var me = this;

        WorldBase.prototype.create.apply(me, arguments);
        me._changeset = [];
    },

    _onEntityChange: function(entity) {
        var me = this;

        WorldBase.prototype._onEntityChange.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.Movement({
            id: entity.getId(),
            x: entity.getX(),
            y: entity.getY(),
            heading: entity.getHeading()
        }));
    },

    _onEntityAttack: function(attacker)
    {
        var me = this;
        var attackTarget = attacker.getAttackTarget();
        var rect = new Geometry.Rectangle({x: attackTarget.x, y: attackTarget.y, width: 1, height: 1});
        _.each(me._entities, function(entity) {
            if (rect.intersect(entity.getBoundingBox())) {
                me.removeEntity(entity);
            }
        });
    },

    addEntity: function(entity) {
        var me = this;

        WorldBase.prototype.addEntity.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.AddEntity({entity: entity}));
    },

    removeEntity: function(entity) {
        var me = this;

        WorldBase.prototype.removeEntity.apply(me, arguments);

        if (!me._changeset) return;
        me._changeset.push(new Change.RemoveEntity({entity: entity}));
    },

    pickupChangeset: function() {
        var me = this;

        var changeset = me._changeset;
        me._changeset = [];
        return changeset;
    }

});

module.exports = World;