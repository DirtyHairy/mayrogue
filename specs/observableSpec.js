/* global describe, it, expect, beforeEach, spyOn */

require('../bootstrap').bootstrap(__dirname + '/..');

var _ = require('underscore');

var requirejs = require('requirejs'),
    Util = requirejs('util');
    
describe('The observable class / mixin', function() {
    var Observer = Util.define({
            properties: ['flag'],
            
            _flag: false,
            
            attach: function(observable) {
                var me = this;
                
                observable.attachListeners({
                    event1: me._onEvent1,
                    event2: me._onEvent2
                }, me);
            },
            
            detach: function(observable) {
                var me = this;
                
                observable.detachListeners({
                    event1: me._onEvent1,
                }, me);
            },
            
            _onEvent1: function(arg) {
                this.setFlag(true);
            },
            
            _onEvent2: function() {
                this.setFlag(true);
            }
        }),
        observer,
        observable;
        
    beforeEach(function() {
        observer = new Observer();
        observable = new Util.Observable();
        
        spyOn(observer, '_onEvent1').andCallThrough();
        spyOn(observer, '_onEvent2').andCallThrough();
        
        observer.attach(observable);
    });
    
    it('allows observers to bind to events fired on the observable', function() {
        observable.fireEvent('event1');
        observable.fireEvent('event2');
        
        expect(observer._onEvent1).toHaveBeenCalled();
        expect(observer._onEvent2).toHaveBeenCalled();
    });
    
    it('passes event arguments to event handlers, appending the observable as last argument', function() {
        observable.fireEvent('event1', 1, 2, 3);
        
        expect(observer._onEvent1).toHaveBeenCalledWith(1, 2, 3, observable);
    });
    
    it('calls handlers in the specified scope', function() {
        expect(observer.getFlag()).toBe(false);
        
        observable.fireEvent('event1');
        
        expect(observer.getFlag()).toBe(true);
    });
    
    it('handlers can be detached', function() {
        observer.detach(observable);
        
        observable.fireEvent('event1');
        observable.fireEvent('event2');
        
        expect(observer._onEvent1).not.toHaveBeenCalled();
        expect(observer._onEvent2).toHaveBeenCalled();
    });
    
    it('all handlers registered for a given scope can be detached', function() {
        observable.detachAllListeners(observer);
        
        observable.fireEvent('event1');
        observable.fireEvent('event2');
        
        expect(observer._onEvent1).not.toHaveBeenCalled();
        expect(observer._onEvent2).not.toHaveBeenCalled();
    });
    
    it('handlers can be attached multiple times leading to multiple calls...', function() {
        observer.attach(observable);
        
        observable.fireEvent('event1');
        
        expect(observer._onEvent1.calls.length).toBe(2);
    });
    
    it('... however, detaching a handler detaches all instances in the given scope', function() {
        observer.attach(observable);
        observer.detach(observable);
        
        observable.fireEvent('event1');
        observable.fireEvent('event2');
        
        observable.detachAllListeners(observer);
        
        observable.fireEvent('event1');
        observable.fireEvent('event2');
        
        expect(observer._onEvent1).not.toHaveBeenCalled();
        expect(observer._onEvent2.calls.length).toEqual(2);
    });
});