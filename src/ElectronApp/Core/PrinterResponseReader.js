"use strict";
exports.__esModule = true;
exports.PrinterResponseReader = void 0;
var MachineCommands_1 = require("./MachineCommands");
var PrinterStatus_1 = require("./Entities/PrinterStatus");
var TemperatureResponse_1 = require("./Entities/TemperatureResponse");
var FirmwareVersionResponse_1 = require("./Entities/FirmwareVersionResponse");
var PendingCall_1 = require("./Entities/PendingCall");
var PendingResponce_1 = require("./Entities/PendingResponce");
/// <summary>
/// A class for reading responces from the printer.
/// </summary>
var PrinterResponseReader = /** @class */ (function () {
    /// <summary>
    /// Initializes a new insrance of the PrinterResponseReader class.
    /// </summary>
    function PrinterResponseReader(socket) {
        var _this = this;
        /// <summary>
        /// The stream reader
        /// </summary>
        //private readonly StreamReader streamReader;
        /// <summary>
        /// The regex for detecting the start of a response and extracting the command.
        /// </summary>
        this.cmdReceivedRegex = new RegExp("CMD (?<CommandId>[MG][0-9]+) Received\.");
        /// <summary>
        /// Value indicating if the class has been disposed
        /// </summary>
        this.isDisposed = false;
        this.lineBuffer = new Array();
        this.responceBuffer = new Array();
        this.pendingCalls = new Array();
        this.socket = socket;
        this.socket.on('data', function (d) { return _this.HandleData(d.toString()); });
    }
    PrinterResponseReader.prototype.HandleData = function (data) {
        var prev = 0, next;
        while ((next = data.indexOf('\n', prev)) > -1) {
            this.buffer += data.substring(prev, next);
            // Found a new line
            this.lineBuffer.push(this.buffer);
            console.log(">>>" + this.buffer);
            this.TryDrainBuffer();
            this.buffer = '';
            prev = next + 1;
        }
        // No new line is this data, add to the buffer and for a future packet
        this.buffer += data.substring(prev);
    };
    PrinterResponseReader.prototype.TryDrainBuffer = function () {
        var mostResentLine = this.lineBuffer[this.lineBuffer.length - 1].trim();
        if (mostResentLine == "ok" || mostResentLine == "ok.") {
            // Find a machine command
            var commandId = this.GetCommandId();
            if (commandId.length > 0) {
                this.responceBuffer.push(new PendingResponce_1.RendingResponce(commandId, this.GenerateResponce(commandId, this.lineBuffer)));
                this.TryDrainPendingCalls();
            }
            this.lineBuffer.length = 0;
        }
        else if (mostResentLine.endsWith("error")) {
            // Find a machine command
            var commandId = this.GetCommandId();
            // Pull out the error code
            var errorCode = "";
            var errorParts = mostResentLine.split(' ');
            if (errorParts.length == 2) {
                errorCode = errorParts[0];
            }
            if (commandId.length > 0) {
                // Failed to find a command, the buffer is useless.
                this.responceBuffer.push(new PendingResponce_1.RendingResponce(commandId, null, new Error(errorCode)));
                this.TryDrainPendingCalls();
            }
            this.lineBuffer.length = 0;
        }
    };
    PrinterResponseReader.prototype.GetCommandId = function () {
        for (var i = this.lineBuffer.length - 2; i >= 0; --i) {
            var searchLine = this.lineBuffer[i];
            var match = searchLine.match(this.cmdReceivedRegex);
            if (this.cmdReceivedRegex.test(searchLine)) {
                // Pull out the ID that the response is for
                return match.groups["CommandId"];
            }
        }
        return null;
    };
    PrinterResponseReader.prototype.TryDrainPendingCalls = function () {
        var _this = this;
        for (var i = 0; i < this.responceBuffer.length; ++i) {
            for (var a = 0; a < this.pendingCalls.length; ++a) {
                var response = this.responceBuffer[i];
                var pendingCall = this.pendingCalls[a];
                if (response.CommandId == pendingCall.CommandId) {
                    pendingCall.Accept(response.Result);
                    this.responceBuffer.splice(i, 1);
                    this.pendingCalls.splice(a, 1);
                    return;
                }
            }
        }
        this.pendingCalls.forEach(function (pendingCall) {
            _this.responceBuffer.forEach(function (responce) {
                if (response.Error != null) {
                    pendingCall.Reject(responce.Error);
                }
                else {
                    pendingCall.Accept(responce.Result);
                }
                return;
            });
        });
    };
    /// <summary>
    /// Gets the reponce for a command from the printer.
    /// </summary>
    /// <typeparam name="T">
    /// The type of the response.
    /// </typeparam>
    /// <returns>
    /// A task containing the responce.
    /// </returns>
    PrinterResponseReader.prototype.GerPrinterResponce = function (commandId) {
        var _this = this;
        var promise = new Promise(function (a, r) {
            var pendingCal = new PendingCall_1.PendingCall(commandId, a, r);
            _this.pendingCalls.push(pendingCal);
            _this.TryDrainPendingCalls();
        });
        return promise;
    };
    /// <summary>
    /// Generates a response object from returned data.
    /// </summary>
    /// <param name="command">
    /// The command that the response is for.
    /// </param>
    /// <param name="data">
    /// The data in the response.
    /// </param>
    /// <returns>
    /// The response object.
    /// </returns>
    PrinterResponseReader.prototype.GenerateResponce = function (command, data) {
        switch (command) {
            case MachineCommands_1.MachineCommands.GetEndstopStaus:
                return new PrinterStatus_1.PrinterStatus(data);
            case MachineCommands_1.MachineCommands.GetFirmwareVersion:
                return new FirmwareVersionResponse_1.FirmwareVersionResponse(data);
            case MachineCommands_1.MachineCommands.GetTemperature:
                return new TemperatureResponse_1.TemperatureResponse(data);
            case MachineCommands_1.MachineCommands.BeginWriteToSdCard:
            case MachineCommands_1.MachineCommands.EndWriteToSdCard:
            case MachineCommands_1.MachineCommands.PrintFileFromSd:
                return null;
            default:
                throw new Error();
            ///throw new NotImplementedException(string.Format(CultureInfo.InvariantCulture, "Unexpected command: {0}", command));
        }
    };
    return PrinterResponseReader;
}());
exports.PrinterResponseReader = PrinterResponseReader;
