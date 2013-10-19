define(['underscore', 'util/class', 'util/support'],
    function (_, Class, Support) {
        "use strict";

        /**
         * Generic base class, poll for nice-to-have helpers.
         */
        var Base = Class.define({
            /**
             * Process constructor parameters: for each 'name' in properties,
             * we try to set '_name' on the object from an initial value
             * provided as 'config[name]'.
             */
            getConfig: function (config, properties) {
                var me = this;

                if (config) {
                    _.each(properties, function (property) {
                        if (config[property] !== undefined) {
                            var setter = me['set' + Support.ucFirst(property)];
    
                            if (_.isFunction(setter)) {
                                setter.call(me, config[property]);
                            } else {
                                me['_' + property] = config[property];
                            }
                        }
                    });
                }

                return me;
            },

            /**
             * Stub constructor.
             */
            create: function () {
            },

            /**
             * Stub destructor
             */
            destroy: function () {
            }
        });

        return Base;
    });