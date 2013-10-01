define(['underscore', 'util/class'],
    function (_, Class) {
        "use strict";

        /**
         * Observable. Usually used as a mixin -> take care to call our
         * constructor in the target class constructor.
         */
        var Observable = Class.define({
            _listeners: null,

            create: function () {
                var me = this;

                me._listeners = {};
            },

            /**
             * Attach event listeners. Arguments are an associative array of event
             * <-> handler pairs, scope is the execution scope if the handlers.
             */
            attachListeners: function (listeners, scope) {
                var me = this;

                _.each(listeners, function (handler, evt) {
                    if (!me._listeners[evt]) me._listeners[evt] = [];

                    me._listeners[evt].push({
                        callback: handler,
                        scope: scope
                    });
                });
            },

            /**
             * Detach event handlers. Signature is identical to attachListeners.
             * IMPORTANT: Both scope and handler must match those passed during
             * registration.
             */
            detachListeners: function (listeners, scope) {
                var me = this;

                _.each(listeners, function (handler, evt) {
                    if (!me._listeners[evt]) return;

                    me._listeners[evt] = _.reject(me._listeners[evt],
                        function (listener) {
                            return listener.callback === handler && listener.scope === scope;
                        }
                    );
                });
            },

            /**
             * Detach all handlers registered with a given scope.
             */
            detachAllListeners: function (scope) {
                var me = this;

                _.each(me._listeners, function (listeners, evt) {
                    me._listeners[evt] = _.reject(me._listeners[evt],
                        function (listener) {
                            return listener.scope === scope;
                        }
                    );
                });
            },

            /**
             * Trigger an event. First argument is the event name, all other
             * arguments are directly passed to the handler. The sender is available as last argument.
             */
            fireEvent: function () {
                var me = this;
                var args = _.values(arguments);
                args.push(me);
                var evt = args.shift();

                if (!me._listeners[evt]) return;
                _.each(me._listeners[evt], function (handler) {
                    handler.callback.apply(handler.scope, args);
                });
            },

            /**
             * Destructor: detach all listeners
             */
            destroy: function () {
                var me = this;

                me.listeners = {};
            }
        });

        return Observable;
    });