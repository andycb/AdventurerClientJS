"use strict";
exports.__esModule = true;
exports.EventDispatcher = void 0;
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.handlers = new Array();
    }
    EventDispatcher.prototype.Invoke = function (event) {
        this.handlers.forEach(function (h) {
            h(event);
        });
    };
    EventDispatcher.prototype.Register = function (handler) {
        this.handlers.push(handler);
    };
    EventDispatcher.prototype.Unregister = function (handler) {
        var index = this.handlers.indexOf(handler);
        this.handlers.splice(index, 1);
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
