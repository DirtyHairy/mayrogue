/* global describe, it, expect, beforeEach, spyOn */

require('../bootstrap').bootstrap(__dirname + '/..');

var _ = require('underscore');

var requirejs = require('requirejs'),
    Collection = requirejs('collection');

describe('The Array collection', function() {
    var collection;
    
    beforeEach(function() {
        collection = new Collection.Array();
    });
    
    it('allows items to be added and removed', function() {
        collection.add('foo', 'bar', 1, 2, false, null);
        expect(collection.count()).toBe(6);
    });
    
    
});
