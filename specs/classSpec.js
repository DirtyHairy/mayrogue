/* global describe, it, expect, beforeEach */

require('../bootstrap').bootstrap(__dirname + '/..');

var requirejs = require('requirejs'),
    Util = requirejs('util');

describe('The class manager', function() {
    var fooFlag = false,
        Ancestor = Util.Class.define({
            foo: function() {
                fooFlag = true;
            }
        }),
        ancestor = new Ancestor();
    
    beforeEach(function() {
        fooFlag = false;
    })
    
    it('allows descendants to inherit their parents properties', function() {
        var Descendant = Util.extend(Ancestor, {
                bar: function() {
                }
            }),
            descendant = new Descendant();
        
        expect(ancestor.foo).toBeDefined();
        expect(ancestor.bar).not.toBeDefined();
        expect(descendant.foo).toBeDefined();
        expect(descendant.bar).toBeDefined();
        expect(descendant.hasOwnProperty('foo')).not.toBe(true);
    });
    
    it ('allows descendants to override their parent properties', function() {
        var anotherFlag = false,
            Descendant = Util.extend(Ancestor, {
                foo: function() {
                    anotherFlag = true;
                }
            }),
            descendant = new Descendant();
            
            descendant.foo();
            
            expect(anotherFlag).toBe(true);
            expect(fooFlag).toBe(false);
    });
});

describe('The property annotation', function() {
    var TestClass = Util.define({
            properties: ['readWrite', 'anotherProp',
                {field: '_readOnly', getter: true},
                {field: '_writeOnly', setter: true},
                {field: '_customGetterSetter', getter: 'getThing', setter: 'setThing'},
            ],
            
            _readOnly: true,
            _customGetterSetter: true,
            
            getCustomGetterSetter: function() {
                return 10;
            },
            
            setCustomGetterSetter: function() {
                this._customGetterSetter = 20;
            }
        }),
        testInstance;
    
    beforeEach(function() {
        testInstance = new TestClass();
    });
    
    it('allows to autogenerate getters and setters', function() {
        expect(testInstance.getReadWrite()).toBe(null);
        testInstance.setReadWrite(true);
        expect(testInstance.getReadWrite()).toBe(true);
    });
    
    it('getters and setters can be enabled individually', function() {
        expect(testInstance.getReadOnly).toBeDefined();
        expect(testInstance.setReadOnly).not.toBeDefined();
        expect(testInstance.getWriteOnly).not.toBeDefined();
        expect(testInstance.setWriteOnly).toBeDefined();
        expect(testInstance.getReadOnly()).toBe(true);
        expect(testInstance._writeOnly).toBe(null);
        testInstance.setWriteOnly(true);
        expect(testInstance._writeOnly).toBe(true);
    });
    
    it('manually defined getters / setter have precedence over the autogenerated functions', function() {
        expect(testInstance.getCustomGetterSetter()).toBe(10);
        testInstance.setCustomGetterSetter(false);
        expect(testInstance._customGetterSetter).toBe(20);
    });
});