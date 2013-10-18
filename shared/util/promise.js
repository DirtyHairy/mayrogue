define(['underscore', 'util/class'],
    function (_, Class) {
        "use strict";

        /**
         * Promise. This is _NOT_ Promises/A , could be eventually replaced with _.deferred or such.
         */
        var Promise = Class.define({
            _stack: [],

            _resolved: false,
            _value: null,

            /**
             * Create a new promise.
             */
            create: function () {
                var me = this;

                me._stack = [];
                me._value = [];
            },

            _invoke: function (callback) {
                var me = this;
                callback.apply(null, me._value);
            },

            /**
             * Registers a callback. On resolving the promise, callbacks ara
             * called and provided with the promise status and any parameters
             * passed to resolve.
             */
            then: function (callback) {
                var me = this;

                if (me._resolved) {
                    me._invoke(callback);
                } else {
                    me._stack.push(callback);
                }
            },

            /**
             * Resolve the promise. Parameters are passed through to registered
             * callbacks.
             */
            resolve: function () {
                var me = this;
                if (me._resolved) return;

                me._value = Array.prototype.slice.call(arguments, 0);
                me._value.unshift(true);
                me._resolved = true;
                _.each(me._stack, me._invoke, me);
                me.stack = null;
            },

            /**
             * Cancels the promise.
             */
            cancel: function () {
                var me = this;
                if (me._resolved) return;

                me._value = [false];
                me._resolved = true;
                _.each(me._stack, me._invoke, me);
                me.stack = [];

            },

            /**
             * Chain two promises by creating a new one which resolves once
             * both parents are resolved. The new promise is cancelled if any
             * of its parents are cancelled. If it is resolved, all parameters
             * provided to the parent resolve calls are passed to the callbacks
             * as arguments (in the order in which they are chained).
             */
            and: function (other) {
                var me = this;

                var composite = new Promise();
                me.then(function (success) {
                    if (success) {
                        var values = Array.prototype.slice.call(arguments, 1);

                        other.then(function (success) {

                            if (success) {
                                var othervalues = Array.prototype.slice.call(arguments, 1);
                                composite.resolve.apply(composite, values.concat(othervalues));
                            }
                        });
                    } else {

                        composite.cancel();
                    }
                });

                other.then(function (success) {
                    if (!success) {
                        composite.cancel();
                    }
                });

                return composite;
            }
        });

        return Promise;
    });
