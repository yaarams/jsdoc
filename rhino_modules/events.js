/*global Packages: true */

/**
 * Partial Rhino implementation of Node.js 'events' module. Adapted from Mocha.
 * @license MIT
 * @see https://github.com/visionmedia/mocha/blob/48e16c3c/mocha.js
 */
function EventEmitter() {}
exports.EventEmitter = EventEmitter;

/** @private */
EventEmitter.prototype._initialize = function() {
    if (this.$events) {
        return;
    }

    this.$events = {};
    this.$eventPool = new java.util.concurrent.ScheduledThreadPoolExecutor(8);

    this._getListener = function(fn) {
        return new java.lang.Runnable({
            run: Packages.org.mozilla.javascript.Context.call(fn)
        });
    };
};

/**
 * Add a listener.
 */
EventEmitter.prototype.on = function (name, fn) {
    this._initialize();
    this.$events[name] = this.$events[name] || [];
    this.$events[name].push(fn);

    return this;
};

/**
 * Synonym for `{@link EventEmitter#on}`.
 */
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

/**
 * Add a listener that runs only once.
 */
EventEmitter.prototype.once = function (name, fn) {
    var self = this;

    function on () {
        self.removeListener(name, on);
        fn.apply(this, arguments);
    }

    on.listener = fn;
    this.on(name, on);

    return this;
};

/**
 * Remove a listener.
 */
EventEmitter.prototype.removeListener = function (name, fn) {
    this._initialize();

    if (this.$events[name]) {
        var list = this.$events[name];

        var pos = -1;

        for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
                pos = i;
                break;
            }
        }

        if (pos < 0) {
            return this;
        }

        list.splice(pos, 1);

        if (!list.length) {
            delete this.$events[name];
        }
    }

    return this;
};

/**
 * Remove all listeners for an event.
 */
EventEmitter.prototype.removeAllListeners = function (name) {
    if (name === undefined) {
        this.$events = {};
        return this;
    }

    if (this.$events[name]) {
        delete this.$events[name];
    }

    return this;
};

/**
 * Get all listeners for an event.
 */
EventEmitter.prototype.listeners = function (name) {
    this._initialize();

    return this.$events[name] || [];
};

/**
 * Emit an event.
 */
EventEmitter.prototype.emit = function (name) {
    if (!this.$events) {
        return false;
    }

    var handler = this.$events[name];
    if (!handler) {
        return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    var listeners = handler.slice();

    for (var i = 0, l = listeners.length; i < l; i++) {
        this.$eventPool.execute( this._getListener(function() {
            listeners[i].apply(this, args);
        }) );
    }

    return true;
};
