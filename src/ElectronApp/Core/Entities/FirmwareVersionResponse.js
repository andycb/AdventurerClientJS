"use strict";
exports.__esModule = true;
exports.FirmwareVersionResponse = void 0;
var Vector3_1 = require("./Vector3");
var FirmwareVersionResponse = /** @class */ (function () {
    /// <summary>
    /// Initializes a new instance of the FirmwareVersionResponse class.
    /// </summary>
    /// <param name="responses">
    /// The responses sent from the printer after the endstop status was requested.
    /// </param>
    function FirmwareVersionResponse(responses) {
        var _this = this;
        //// Example interaction:
        ////
        //// CMD M115 Received.
        //// Machine Type: Voxel
        //// Machine Name: Voxel
        //// Firmware: v1.0.3
        //// SN: XXXX999999
        //// X: 150 Y: 150 Z: 150
        //// Tool Count: 1
        //// ok
        responses.forEach(function (response) {
            var parts = response.split(/\:(.+)/);
            if (parts.length > 1) {
                switch (parts[0].trim().toLowerCase()) {
                    case "machine type":
                        _this.MachineType = parts[1].trim();
                        break;
                    case "machine name":
                        _this.MachineName = parts[1].trim();
                        break;
                    case "firmware":
                        _this.FirmwareVersion = parts[1].trim();
                        break;
                    case "sn":
                        _this.SerialNumber = parts[1].trim();
                        break;
                    case "tool count":
                        _this.ToolCount = Number.parseInt(parts[1].trim());
                        break;
                    case "x":
                        _this.BuildVolume = FirmwareVersionResponse.GetBuildVolumeVector(response.trim());
                        break;
                }
            }
        });
    }
    /// <summary>
    /// Extracts the build volume from the string reprisentation.
    /// </summary>
    /// <param name="strVal">
    /// The string reprisentation sent by the printer.
    /// </param>
    /// <returns>
    /// A vector reprisenting the current build volume.
    /// </returns>
    FirmwareVersionResponse.GetBuildVolumeVector = function (strVal) {
        // Example format: X: 150 Y: 150 Z: 150
        var result = new Vector3_1.Vector3(Number.NaN, Number.NaN, Number.NaN);
        var xyzParts = strVal.split(' ');
        for (var i = 0; i < xyzParts.length; i += 2) {
            switch (xyzParts[i].toLowerCase()) {
                case "x:":
                    result.X = Number.parseFloat(xyzParts[i + 1]);
                case "y:":
                    result.Y = Number.parseFloat(xyzParts[i + 1]);
                case "z:":
                    result.Z = Number.parseFloat(xyzParts[i + 1]);
            }
        }
        return result;
    };
    return FirmwareVersionResponse;
}());
exports.FirmwareVersionResponse = FirmwareVersionResponse;
