"use strict";
exports.__esModule = true;
exports.PendingCall = void 0;
var PendingCall = /** @class */ (function () {
    function PendingCall(commandId, accept, reject) {
        this.CommandId = commandId;
        this.Accept = accept;
        this.Reject = reject;
    }
    return PendingCall;
}());
exports.PendingCall = PendingCall;
