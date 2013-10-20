define(['underscore', 'util', 'collection/abstract'],
    function(_, Util, AbstractCollection)
{
    'use strict';
    
    var _parent = AbstractCollection.prototype;
    
    var ArrayCollection = Util.extend(AbstractCollection, {
        
        _registry: null,
        
        create: function() {
            var me = this;
            
            _parent.create.apply(me, arguments);
            
            me._registry = [];
        },
        
        add: function(item) {
            var me = this;
            
            if (arguments.length > 1) {
                _.each(arguments, function(arg) {
                    me.add(arg)
                });
                return;
            }
            
            if (!_.contains(me._registry, item)) {
                me._registry.push(item);
                
                _parent.add.apply(me, arguments);
            }
        },
        
        remove: function(item) {
            var me = this;
            
            if (arguments.length > 1) {
                _.each(arguments, function(arg) {
                    me.remove(arg);
                });
                return;
            }
                
            var index = _.indexOf(me._registry, item);
            
            if (index >= 0) {
                me._registry.splice(index, 1);
                
                _parent.remove.apply(me, arguments);
            }
        },
        
        each: function(iterator) {
            _.each(this._registry, iterator);
        },
        
        some: function(iterator) {
            return _.some(this._registry, iterator);
        },
        
        count: function() {
            return this._registry.length;
        },
        
        getAll: function() {
            return this._map.slice();
        }
    });
    
    return ArrayCollection;
});