// vim:softtabstop=4:shiftwidth=4

define(['underscore', 'util/support', 'util/class', 'util/base', 'util/observable',
        'util/semaphore', 'util/promise'],
    function(_, Support, Class, Base, Observable, Semaphore, Promise)
{
    "use strict";

    var Util = {};

    // Support and Class are mixed in for compatibility
    _.extend(Util, Support, Class, {
        Class: Class,
        Support: Support,
        Base: Base,
        Observable: Observable,
        Semaphore: Semaphore,
        Promise: Promise
    });

    return Util;
});
