"use strict";
exports.__esModule = true;
exports.MachineCommands = void 0;
/// <summary>
/// Commands that can be sent to the printer.
/// </summary>
var MachineCommands = /** @class */ (function () {
    function MachineCommands() {
    }
    /// <summary>
    /// The Get endstop status command.
    /// </summary>
    MachineCommands.GetEndstopStaus = "M119";
    /// <summary>
    /// The begin write to SD card command.
    /// </summary>
    MachineCommands.BeginWriteToSdCard = "M28";
    /// <summary>
    /// The end write to SD card command.
    /// </summary>
    MachineCommands.EndWriteToSdCard = "M29";
    /// <summary>
    /// The print file from SD card command.
    /// </summary>
    MachineCommands.PrintFileFromSd = "M23";
    /// <summary>
    /// The get firmware version command.
    /// </summary>
    MachineCommands.GetFirmwareVersion = "M115";
    /// <summary>
    /// The get Temperature version command.
    /// </summary>
    MachineCommands.GetTemperature = "M105";
    return MachineCommands;
}());
exports.MachineCommands = MachineCommands;
