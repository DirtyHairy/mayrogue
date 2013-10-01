define(['underscore', 'util/support'],
    function (_, Support) {
        "use strict";

        /**
         * Process a class definition by applying properties and mixins.
         *
         * @private
         */
        var _processClassDefinition = function (def, ctor) {
            var proto = _.omit(def, 'properties', 'mixins');

            proto = _processClassProperties(def, proto, ctor);
            proto = _processClassMixins(def, proto, ctor);

            return proto;
        };

        /**
         * Process class mixings by copying all properties (with the exception of
         * create) over to the prototype. Mixins are specified in the the array
         * 'mixins' in the class definition and may be either plain javascript
         * objects or classes.
         *
         * NOTE that inheritance between is currently NOT honoured, only the
         * prototype's own properties are copied.
         *
         * @private
         */
        var _processClassMixins = function (def, proto, ctor) {
            ctor.mixins = [];
            if (!_.isArray(def.mixins)) return proto;

            _.each(def.mixins, function (mixin) {
                if (!_.isObject(mixin)) return;

                if (_.isObject(mixin.prototype)) {

                    _.defaults(proto, _.omit(mixin.prototype, 'create'));
                    ctor.mixins.push(mixin.prototype);
                } else {

                    _.defaults(proto, _.omit(mixin, 'create'));
                    ctor.mixins.push(mixin);
                }
            });

            return proto;
        };

        /**
         * Process class properties. Properties are defined with the 'properties'
         * array of the class definition and may be either a string or an object
         * with the entries 'field', 'getter' and 'setter'.
         *
         * In the first case, a private property '_name' and a getter / setter pair
         * 'getName' / 'setName' is generated. In the second form, 'field' specifies
         * the property name, and 'getter' / 'setter' specify getter and setter
         * names. Placing 'true' instead of a name automatically infers the
         * generated name from 'field' by stripping a possible leading underscore
         * and camelizing, eg '_name' -> 'getName'. Leaving out 'getter' / 'setter'
         * will skip.
         */
        var _processClassProperties = function (def, proto) {
            if (!_.isArray(def.properties)) return proto;

            // First step: compile the properties into an associative array
            var properties = {};
            _.each(def.properties, function (val) {
                if (_.isString(val)) {

                    properties['_' + val] = {
                        getter: 'get' + Support.ucFirst(val),
                        setter: 'set' + Support.ucFirst(val)
                    };
                } else if (_.isObject(val) && val.field !== undefined) {

                    // Generate names if neccessary
                    if (val.getter !== undefined && !_.isString(val.getter) && val.getter)
                        val.getter = 'get' + Support.ucFirst(val.field.replace(/^_/, ''));
                    if (val.setter !== undefined && !_.isString(val.setter) && val.setter)
                        val.setter = 'set' + Support.ucFirst(val.field.replace(/^_/, ''));

                    properties[val.field] = _.pick(val, 'getter', 'setter');
                }
            });

            // Tag field and getter / setter onto the prototype
            _.each(properties, function (config, field) {
                if (proto[field] === undefined) proto[field] = null;

                if (config.getter !== undefined && !proto[config.getter])
                    proto[config.getter] = function () {
                        return this[field];
                    };
                if (config.setter !== undefined && !proto[config.setter])
                    proto[config.setter] = function (val) {
                        this[field] = val;
                        return this;
                    };
            });

            return proto;
        };

        /**
         * Generic constructor. Calls 'create' if applicable.
         *
         * @private
         */
        var _ctor = function () {
            var me = this;

            if (me.create) me.create.apply(me, arguments);

            return me;
        };

        var Class = {};

        /**
         * Define a new class.
         */
        Class.define = function (def) {
            var ctor = function () {
                return _ctor.apply(this, arguments);
            };

            _.extend(ctor.prototype, _processClassDefinition(def, ctor));
            return ctor;
        };

        /**
         * Extend an existing clas..
         */
        Class.extend = function (base, def) {
            var ctor = function () {
                return _ctor.apply(this, arguments);
            };

            ctor.prototype = _.extend(Support.objectCreate(base.prototype),
                _processClassDefinition(def, ctor),
                {
                    constructor: ctor
                }
            );
            return ctor;
        };

        return Class;
    });
