"use strict";
exports.__esModule = true;
exports.RendingResponce = void 0;
var RendingResponce = /** @class */ (function () {
    function RendingResponce(commandId, result, error) {
        if (error === void 0) { error = null; }
        this.CommandId = commandId;
        this.Result = result;
        this.Error = error;
    }
    return RendingResponce;
}());
exports.RendingResponce = RendingResponce;
