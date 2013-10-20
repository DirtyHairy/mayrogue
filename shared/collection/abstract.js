define(['underscore', 'util'],
    function(_, Util)
{
    'use strict';
    
    var _parent = Util.Base.prototype;
    
    var AbstractCollection = Util.extend(Util.Base, {
        
        mixins: [
            Util.Observable
        ],
        
        properties: [
            {field: '_relayEvents', getter: true}
        ],
        
        _relayEvents: null,
        
        create: function(config) {
            var me = this;
            
            _parent.create.apply(me, arguments);
            Util.Observable.prototype.create.apply(me, arguments);
            
            me.getConfig(config, ['relayEvents']);
            
            if (_.isArray(me._relayEvents)) {
                var compiled = {};
                _.each(me._relayEvents, function(event) {
                    compiled[event] = true;
                });
                
                me._relayEvents = compiled;
            }
        },
        
        destroy: function() {
            var me = this;
            
            _parent.destroy.apply(me, arguments);
            Util.Observable.prototype.destroy.apply(me, arguments);
        },
        
        add: function(item) {
            var me = this;
            
            if (item && me.getRelayEvents() && item.attachRelay) {
                item.attachRelay(me._relay, item);
            }
            
            me.fireEvent('added', item);
        },
        
        remove: function(item) {
            var me = this;
            
            if (item && me.getRelayEvents() && item.detachRelay) {
                item.detachRelay(me._relay, me);
            }
            
            me.fireEvent('removed', item);
        },
        
        each: function() {},
        
        some: function() {},
        
        count: function() {},
        
        findAll: function(predicate) {
            var me = this,
                result = [];
                
            me.each(function(item) {
                if (predicate(item)) {
                    result.push(item);
                }
            });
            
            return result;
        },
        
        findOne: function(predicate) {
            var me = this,
                found = false,
                result;
                
            me.some(function(item) {
                if (predicate(item)) {
                    result = predicate;
                    found = true;
                }
                
                return found;
            });
            
            return found ? result : undefined;
        },
        
        getAll: function() {
            return this.findAll(function() {return true;});
        },
        
        contains: function(item) {
            var me = this,
                found = me.findOne(function(candidate) {
                    return item === candidate;
                });
            
            return !!found;
        },
        
        _relay: function(event) {
            var me = this,
                _relayEvents = me.getRelayEvents();
            
            if (_relayEvents && (_relayEvents === true || _relayEvents[event])) {
                me._relayEvent.apply(me, arguments);
            }
        },
        
        _relayEvent: function() {
            this.fireEvent.apply(this, arguments);
        }
    });
    
    return AbstractCollection;
});