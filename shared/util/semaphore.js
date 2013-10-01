define(['underscore', 'util/class'],
    function (_, Class) {
        "use strict";

        /**
         * Semaphore. A semaphore is a counter which can be lowered and raised;
         * callbacks can be registered which are fired whenever the semaphore
         * aquires a certain value (trippoint).
         */
        var Semaphore = Class.define({
            _trippoints: null,
            _value: 0,

            create: function (initial) {
                var me = this;
                me._value = initial;
                me._trippoints = [];
            },

            /**
             * Register a handler for a specific trippoint.
             */
            when: function (value, handler) {
                var me = this;

                if (!me._trippoints[value]) me._trippoints[value] = [];
                me._trippoints[value].push(handler);
            },

            _handle: function () {
                var me = this;

                if (!me._trippoints[me._value]) return;
                _.each(me._trippoints[me._value], function (handler) {
                    handler();
                });
            },

            raise: function () {
                var me = this;

                me._value++;
                me._handle();
            },

            lower: function () {
                var me = this;

                me._value--;
                me._handle();
            }
        });

        return Semaphore;
    });
