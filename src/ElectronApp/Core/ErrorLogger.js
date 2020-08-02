"use strict";
exports.__esModule = true;
exports.ErrorLogger = void 0;
var ErrorLogger = /** @class */ (function () {
    function ErrorLogger() {
    }
    ErrorLogger.NonFatalError = function (error) {
        console.log("ErrorLogger::NonFatalError() - " + error.toString() + "\n" + error.stack);
    };
    return ErrorLogger;
}());
exports.ErrorLogger = ErrorLogger;
