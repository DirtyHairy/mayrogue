/* global describe, it, expect, beforeEach, spyOn */

require('../bootstrap').bootstrap(__dirname + '/..');

var _ = require('underscore');

var requirejs = require('requirejs'),
    Collection = requirejs('collection');

function commonTests(e) {
    it('allows items to be added and removed', function() {
        expect(e.collection.count()).toBe(6);
        
        expect(e.collection.contains('foo'))    .toBe(true);
        expect(e.collection.contains('bar'))    .toBe(true);
        expect(e.collection.contains(1))        .toBe(true);
        expect(e.collection.contains(2))        .toBe(true);
        expect(e.collection.contains(false))    .toBe(true);
        expect(e.collection.contains(null))     .toBe(true);
        
        e.collection.remove('foo', 1, null);
        expect(e.collection.count()).toBe(3);
        
        expect(e.collection.contains('foo'))    .toBe(false);
        expect(e.collection.contains('bar'))    .toBe(true);
        expect(e.collection.contains(1))        .toBe(false);
        expect(e.collection.contains(2))        .toBe(true);
        expect(e.collection.contains(false))    .toBe(true);
        expect(e.collection.contains(null))     .toBe(false);
    });
}

describe('The Array collection', function() {
    var e = {};
    
    beforeEach(function() {
        e.collection = new Collection.Array();
        e.collection.add('foo', 'bar', 1, 2, false, null);
    });
    
    commonTests(e);
});

describe('The KeyValue collection', function() {
    var e = {};
    
    beforeEach(function() {
        e.collection = new Collection.KeyValue();
        e.collection.add({
            foo: 'foo',
            bar: 'bar',
            one: 1,
            two: 2,
            nope: false,
            nada: null
        });
    });
    
    it('Key can be retrieved for items', function() {
        expect(e.collection.findKey('foo')).toBe('foo');
        expect(e.collection.findKey(null)).toBe('nada');
    });
    
    it('Items can be removed by key', function() {
        e.collection.removeAt('foo', 'nope', 'two');

        expect(e.collection.count()).toBe(3);
        
        expect(e.collection.getAt('foo')).toBeUndefined();
        expect(e.collection.getAt('bar')).toBeDefined();
        expect(e.collection.getAt('one')).toBeDefined();
        expect(e.collection.getAt('two')).toBeUndefined();
        expect(e.collection.getAt('nope')).toBeUndefined();
        expect(e.collection.getAt('nada')).toBeDefined();
    });
    
    commonTests(e);
});