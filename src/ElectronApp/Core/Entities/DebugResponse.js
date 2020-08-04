"use strict";
exports.__esModule = true;
exports.DebugResponse = void 0;
var DebugResponse = /** @class */ (function () {
    /// <summary>
    /// Initializes a new instance of the DebugResponse class.
    /// </summary>
    /// <param name="responses">
    /// The responses sent from the printer after the command equested.
    /// </param>
    function DebugResponse(responses) {
        this.Responses = responses;
    }
    return DebugResponse;
}());
exports.DebugResponse = DebugResponse;
