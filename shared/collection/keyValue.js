define(['underscore', 'util', 'collection/abstract'],
    function(_, Util, AbstractCollection)
{
    'use strict';
    
    var _parent = AbstractCollection.prototye;
    
    var KeyValueCollection = Util.extend(AbstractCollection, {
        
        _map: null,
        _size: 0,
        
        create: function() {
            var me = this;
            
            _parent.create.apply(me, arguments);
            
            me._map = {};
        },
        
        add: function(item, key) {
            var me = this;
            
            if (arguments.length === 1) {
                _.each(item, me.add, me);
            }
            
            if (!me._map.hasOwnProperty(key)) {
                me._map[key] = item;
                me._size++;
                
                _parent.add.apply(me, arguments);
            }
        },
        
        removeAt: function(key) {
            var me = this;
            
            if (me._map.hasOwnProperty(key)) {
                var item = me._map[key];
                
                delete me._map[key];
                me.size--;
                
                _parent.remove.call(me, item);
                
                return key;
            }
            
            return undefined;
        },
        
        each: function(iterator) {
            _.each(this._map, iterator);
        },
        
        some: function(iterator) {
            return _.some(this._map, iterator);
        },
        
        findKey: function(item) {
            var me = this,
                found = false,
                foundKey;
            
            me.some(function(value, key) {
                if (value === item) {
                    foundKey = key;
                    found = true;
                }
                
                return found;
            });
            
            return found ? foundKey : undefined;
        },
        
        remove: function(item) {
            var me = this,
                key = me.findKey(item);
            
            if (typeof(key) !== 'undefined') {
                me.removeAt(key);
            }
        },
        
        getAt: function(key) {
            return this._map[key];
        }
    });
    
    return KeyValueCollection;
});