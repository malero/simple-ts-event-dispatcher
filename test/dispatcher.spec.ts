import { EventDispatcher } from "../src/EventDispatcher";


describe('EventDispatcher', () => {
    let dispatcher: EventDispatcher = null,
        dummy = null,
        dummy2 = null;

    beforeEach(() => {
        dispatcher = new EventDispatcher();
        dummy = jasmine.createSpyObj('dummy', ['callback']);
        dummy2 = jasmine.createSpyObj('dummy2', ['callback']);
    });

    it("should bind and be called properly", () => {
        dispatcher.bind('event', dummy.callback.bind(dummy));
        expect(dummy.callback).not.toHaveBeenCalled();
        dispatcher.trigger('event', 1, 2, 'three');
        expect(dummy.callback).toHaveBeenCalled();
    });

    it("should unbind and not be called", () => {
        const key: number = dispatcher.bind('event', dummy.callback.bind(dummy));
        expect(dispatcher.unbind('event', key)).toEqual(true);
        dispatcher.trigger('event', 1, 2, 'three');
        expect(dummy.callback).not.toHaveBeenCalled();
    });

    it("should not unbind events that don't exist", () => {
        const key: number = dispatcher.bind('event', dummy.callback.bind(dummy));
        expect(dispatcher.unbind('fake_event', -1)).toEqual(false);
        dispatcher.trigger('event', 1, 2, 'three');
        expect(dummy.callback).toHaveBeenCalled();
    });

    it("should bind and be called properly", () => {
        dispatcher.bind('event', dummy.callback.bind(dummy));
        expect(dummy.callback).not.toHaveBeenCalled();
        dispatcher.trigger('event', 1, 2, 'three');
        expect(dummy.callback).toHaveBeenCalled();
    });

    it("should unbind all", () => {
        dispatcher.bind('event', dummy.callback, dummy);
        dispatcher.bind('event', dummy.callback, dummy);
        dispatcher.bind('event', dummy2.callback, dummy2);
        expect(dispatcher.unbind('event')).toEqual(true);
        expect(dispatcher.unbindWithContext('event', dummy)).toBe(0);
        expect(dispatcher.unbindWithContext('event', dummy2)).toBe(0);
        dispatcher.trigger('event');
        expect(dummy.callback).not.toHaveBeenCalled();
    });

    it("should unbind all with matching context", () => {
        dispatcher.bind('event', dummy.callback, dummy);
        dispatcher.bind('event', dummy.callback, dummy);
        dispatcher.bind('event', dummy2.callback, dummy2);
        expect(dispatcher.unbindWithContext('event', dummy)).toBe(2);
        dispatcher.trigger('event');
        expect(dummy.callback).not.toHaveBeenCalled();
    });

    it("should unbind the correct listeners by key", () => {
        let key1 = dispatcher.bind('event', dummy.callback, dummy),
            key2 = dispatcher.bind('event', dummy.callback, dummy),
            key3 = dispatcher.bind('event', dummy.callback, dummy),
            key4 = dispatcher.bind('event', dummy.callback, dummy),
            key5 = dispatcher.bind('event', dummy.callback, dummy);

        expect(dispatcher.unbind('event', key2)).toBe(true);
        expect(dispatcher.unbind('event', key4)).toBe(true);
        expect(dispatcher.unbind('event', key1)).toBe(true);
        expect(dispatcher.unbind('event', key3)).toBe(true);
        expect(dispatcher.unbind('event', key5)).toBe(true);
    });

    it("should fail to unbind the once listeners", () => {
        let key1 = dispatcher.once('event', dummy.callback, dummy),
            cb1 = dispatcher.getListener('event', key1),
            key2 = dispatcher.once('event', dummy.callback, dummy),
            cb2 = dispatcher.getListener('event', key2),
            key3 = dispatcher.once('event', dummy.callback, dummy),
            cb3 = dispatcher.getListener('event', key3),
            key4 = dispatcher.bind('event', dummy.callback, dummy),
            cb4 = dispatcher.getListener('event', key4),
            key5 = dispatcher.once('event', dummy.callback, dummy),
            cb5 = dispatcher.getListener('event', key5);

        dispatcher.trigger('event');
        dispatcher.trigger('event');
        dispatcher.trigger('event');
        dispatcher.trigger('event');
        expect(dispatcher.unbind('event', key2)).toBe(false);
        expect(cb2.calls).toBe(1);
        expect(dispatcher.unbind('event', key4)).toBe(true);
        expect(cb4.calls).toBe(4);
        expect(dispatcher.unbind('event', key1)).toBe(false);
        expect(cb1.calls).toBe(1);
        expect(dispatcher.unbind('event', key3)).toBe(false);
        expect(cb3.calls).toBe(1);
        expect(dispatcher.unbind('event', key5)).toBe(false);
        expect(cb5.calls).toBe(1);
        expect(dispatcher.unbind('event', key4)).toBe(false);
    });

    it("should only be called once", () => {
        let onceCalls = 0,
            normalCalls = 0;
        dispatcher.once('event', () => {
            // empty
        });
        dispatcher.once('event', () => {
            onceCalls += 1;
        });
        dispatcher.once('event', () => {
            // empty
        });
        dispatcher.bind('event', () => {
            normalCalls += 1;
        });
        dispatcher.trigger('event');
        dispatcher.trigger('event');
        dispatcher.trigger('event');
        dispatcher.trigger('event');
        expect(onceCalls).toBe(1);
        expect(normalCalls).toBe(4);
    });

    it("should only be called once with nested event triggers", () => {
        let onceCalls = 0,
            normalCalls = 0;
        const key = dispatcher.once('event', () => {
                dispatcher.trigger('event');
            }),
            cb = dispatcher.getListener('event', key);
        dispatcher.trigger('event');
        expect(cb.calls).toBe(1);
    });

    it("should pass arguments", () => {
        const key = dispatcher.once('event', (num, arr, obj) => {
                expect(num).toBe(1);
                expect(arr[0]).toBe(1);
                expect(arr[1]).toBe(2);
                expect(arr[2]).toBe(3);
                expect(obj.foo).toBe('bar');
            }),
            cb = dispatcher.getListener('event', key);
        dispatcher.trigger('event', 1, [1,2,3], {foo:'bar'});
    });

    it("cannot call a once event more than once", () => {
        const key = dispatcher.once('event', () => {}),
            cb = dispatcher.getListener('event', key);
        dispatcher.trigger('event');
        expect(cb.call()).toBe(false);
        expect(cb.calls).toBe(1);
    });
});
