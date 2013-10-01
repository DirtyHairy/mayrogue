define([],
    function () {
        "use strict";

        var Support = {};

        /**
         * Uppercase the first character of a string.
         */
        Support.ucFirst = function (val) {
            var res = '';
            if (val.length > 0) res += val.substr(0, 1).toUpperCase();
            if (val.length > 1) res += val.substr(1);

            return res;
        };

        /**
         * Create a new object with a given prototype.
         */
        Support.objectCreate = function (proto) {
            if (Object.create) {
                return Object.create(proto);
            } else {
                var Ctor = function () {
                    return this;
                };
                Ctor.prototype = proto;
                return new Ctor();
            }
        };


        /**
         * Make sure that a value lies in a certain interval.
         */
        Support.boundValue = function (value, min, max) {
            if (value < min) {
                value = min;
            } else if (value > max) {
                value = max;
            }

            return value;
        };

        return Support;
    });