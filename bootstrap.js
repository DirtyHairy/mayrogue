"use strict";

var requirejs = require('requirejs');

exports.bootstrap = function(root) {
    requirejs.config({
        baseUrl: root + '/shared'
    });
}