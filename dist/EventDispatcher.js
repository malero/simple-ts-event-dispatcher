"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCallback = /** @class */ (function () {
    function EventCallback(fnc, key, once, context) {
        this.fnc = fnc;
        this.key = key;
        this.once = once;
        this.context = context;
        this.calls = 0;
    }
    EventCallback.prototype.call = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.once && this.calls > 0)
            return false;
        (_a = this.fnc).apply.apply(_a, [this.context].concat(args));
        this.calls += 1;
        return true;
        var _a;
    };
    return EventCallback;
}());
exports.EventCallback = EventCallback;
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this._lastKey = 0;
        this._listeners = {};
    }
    EventDispatcher.prototype.bind = function (event, fct, context, once) {
        once = once || false;
        this._lastKey++;
        this._listeners[event] = this._listeners[event] || [];
        this._listeners[event].push(new EventCallback(fct, this._lastKey, once, context));
        return this._lastKey;
    };
    EventDispatcher.prototype.once = function (event, fct, context) {
        return this.bind(event, fct, context, true);
    };
    EventDispatcher.prototype.unbind = function (event, key) {
        if (event in this._listeners === false)
            return false;
        if (key) {
            for (var _i = 0, _a = this._listeners[event]; _i < _a.length; _i++) {
                var cb = _a[_i];
                if (key == cb.key) {
                    this._listeners[event].splice(this._listeners[event].indexOf(cb), 1);
                    return true;
                }
            }
        }
        else {
            this._listeners[event] = [];
            return true;
        }
        return false;
    };
    EventDispatcher.prototype.unbindWithContext = function (event, context) {
        if (event in this._listeners === false)
            return 0;
        var toRemove = [], cnt = 0;
        for (var _i = 0, _a = this._listeners[event]; _i < _a.length; _i++) {
            var cb = _a[_i];
            if (context == cb.context) {
                toRemove.push(cb);
            }
        }
        for (var _b = 0, toRemove_1 = toRemove; _b < toRemove_1.length; _b++) {
            var cb = toRemove_1[_b];
            this._listeners[event].splice(this._listeners[event].indexOf(cb), 1);
            cnt++;
        }
        return cnt;
    };
    EventDispatcher.prototype.getListener = function (event, key) {
        for (var _i = 0, _a = this._listeners[event]; _i < _a.length; _i++) {
            var cb = _a[_i];
            if (key == cb.key)
                return cb;
        }
    };
    EventDispatcher.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (event in this._listeners === false)
            return;
        for (var i = 0; i < this._listeners[event].length; i++) {
            var cb = this._listeners[event][i];
            // We need to unbind callbacks before they're called to prevent
            // infinite loops if the event is somehow triggered within the
            // callback
            if (cb.once) {
                this.unbind(event, cb.key);
                i--;
            }
            cb.call(args);
        }
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=EventDispatcher.js.map