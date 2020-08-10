"use strict";
exports.__esModule = true;
exports.PrinterDebugMonitor = exports.LoggedMessage = exports.LoggedMessageDirection = void 0;
var EventDispatcher_1 = require("../EventDispatcher");
var LoggedMessageDirection;
(function (LoggedMessageDirection) {
    LoggedMessageDirection[LoggedMessageDirection["ToPrinter"] = 0] = "ToPrinter";
    LoggedMessageDirection[LoggedMessageDirection["FromPrinter"] = 1] = "FromPrinter";
})(LoggedMessageDirection = exports.LoggedMessageDirection || (exports.LoggedMessageDirection = {}));
var LoggedMessage = /** @class */ (function () {
    function LoggedMessage(direction, messsage) {
        this.Direction = direction;
        this.Mesage = messsage;
    }
    return LoggedMessage;
}());
exports.LoggedMessage = LoggedMessage;
var PrinterDebugMonitor = /** @class */ (function () {
    function PrinterDebugMonitor() {
        this.messages = [];
        this.NewMessage = new EventDispatcher_1.EventDispatcher();
    }
    PrinterDebugMonitor.prototype.LogDataToPrinter = function (data) {
        var message = new LoggedMessage(LoggedMessageDirection.ToPrinter, data);
        this.messages.push(message);
        this.NewMessage.Invoke(message);
    };
    PrinterDebugMonitor.prototype.LogDataFromPriter = function (data) {
        var message = new LoggedMessage(LoggedMessageDirection.FromPrinter, data);
        this.messages.push(message);
        this.NewMessage.Invoke(message);
    };
    PrinterDebugMonitor.prototype.GetLog = function () {
        return this.messages;
    };
    PrinterDebugMonitor.prototype.ClearLog = function () {
        this.messages = new Array();
    };
    return PrinterDebugMonitor;
}());
exports.PrinterDebugMonitor = PrinterDebugMonitor;
