"use strict";
exports.__esModule = true;
exports.PrinterStatus = void 0;
var Vector3_1 = require("./Vector3");
var PrinterStatus = /** @class */ (function () {
    /// <summary>
    /// Initializes a new instance of the PrinterStatus class.
    /// </summary>
    /// <param name="responses">
    /// The responses sent from the printer after the endstop status was requested.
    /// </param>
    function PrinterStatus(responses) {
        var _this = this;
        //// Example interaction:
        ////
        //// CMD M119 Received.
        //// Endstop: X-max:1 Y-max:0 Z-max:0
        //// MachineStatus: READY
        //// MoveMode: READY
        //// Status: S:0 L:0 J:0 F:0
        //// ok
        responses.forEach(function (response) {
            var parts = response.split(/\:(.+)/);
            if (parts.length > 1) {
                switch (parts[0].trim().toLowerCase()) {
                    case "machinestatus":
                        _this.MachineStatus = parts[1].trim();
                        break;
                    case "movemode":
                        _this.MoveMode = parts[1].trim();
                        break;
                    case "endstop":
                        _this.Endstop = PrinterStatus.GetEndstopVector(parts[1]);
                        break;
                }
            }
        });
    }
    /// <summary>
    /// Extracts the endstop vector fro the string reprisentation.
    /// </summary>
    /// <param name="strVal">
    /// The string reprisentation send by the printer.
    /// </param>
    /// <returns>
    /// A vector reprisenting the current endstop value.
    /// </returns>
    PrinterStatus.GetEndstopVector = function (strVal) {
        // Example format: X-max:1 Y-max:0 Z-max:0
        var result = new Vector3_1.Vector3(Number.NaN, Number.NaN, Number.NaN);
        /// First break out each of the X/Y/Z planes
        var xyzParts = strVal.split(' ');
        xyzParts.forEach(function (plane) {
            // For each plane break into a key and value
            var planeParts = plane.split(':');
            if (planeParts.length == 2) {
                // Attemt to parse the value
                var val = Number.parseFloat(planeParts[1]);
                if (!Number.isNaN(val)) {
                    // Assign the parsed value to the relevent plane
                    switch (planeParts[0].toLocaleLowerCase()) {
                        case "x-max":
                            result.X = val;
                            break;
                        case "y-max":
                            result.Y = val;
                            break;
                        case "z-max":
                            result.Z = val;
                            break;
                    }
                }
            }
        });
        return result;
    };
    return PrinterStatus;
}());
exports.PrinterStatus = PrinterStatus;
