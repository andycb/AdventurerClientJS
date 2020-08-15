"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Printer = void 0;
var net = require('net');
var fs = require('fs');
var crc32 = require('crc').crc32;
var PrinterResponseReader_1 = require("./PrinterResponseReader");
var MachineCommands_1 = require("./MachineCommands");
/// <summary>
/// Represents the printer.
/// </summary>
/// <remarks>
/// This class is NOT currently thread safe. Calling a second method while one is still
/// happening may cause unexpected errors from the printer.
/// </remarks>
var Printer = /** @class */ (function () {
    /// <summary>
    /// Initializes a new instance of the Printer class.
    /// </summary>
    /// <param name="ipAddress">
    /// The IP address of the printer to connect to.
    /// </param>
    /// <remarks>
    /// The printer will not be connected to until <see cref="Connect()" /> is called
    /// </remarks>
    function Printer(ipAddress) {
        /// <summary>
        /// The number of bytes sent to the printer in each packet.
        /// </summary>
        this.packetSizeBytes = 4096;
        this.printerAddress = ipAddress;
    }
    Printer.prototype.SendToPrinter = function (data) {
        data = data + "\n";
        if (this.PrinterDebugMonitor) {
            this.PrinterDebugMonitor.LogDataToPrinter(data);
        }
        this.printerConnection.write(data);
    };
    Printer.prototype.SendBufferToPrinter = function (data) {
        if (this.PrinterDebugMonitor != null) {
            this.PrinterDebugMonitor.LogDataToPrinter(data.toString());
        }
        this.printerConnection.write(data);
    };
    /// <summary>
    /// Connects to the specified printer.
    /// </summary>
    /// <returns>
    /// A task that compleares once the connection has been established.
    /// </returns>
    Printer.prototype.ConnectAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (a, r) {
                        _this.printerConnection = new net.Socket();
                        _this.printerConnection.on('error', function (ex) {
                            _this.isConnected = false;
                            r(ex);
                        });
                        _this.printerConnection.on('close', function () {
                            _this.isConnected = false;
                        });
                        _this.printerConnection.on('data', function (data) {
                            if (_this.PrinterDebugMonitor) {
                                _this.PrinterDebugMonitor.LogDataFromPriter(data);
                            }
                        });
                        _this.printerConnection.connect(8899, _this.printerAddress, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.responseReader = new PrinterResponseReader_1.PrinterResponseReader(this.printerConnection);
                                        this.isConnected = true;
                                        return [4 /*yield*/, this.GetPrinterStatusAsync()];
                                    case 1:
                                        _a.sent();
                                        a();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    Printer.prototype.Disconnect = function () {
        this.printerConnection.destroy();
    };
    /// <summary>
    /// Gets the current status of the printer.
    /// </summary>
    /// <returns>
    /// A task containing the current printer state.
    /// </returns>
    Printer.prototype.GetPrinterStatusAsync = function () {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands_1.MachineCommands.GetEndstopStaus;
        this.SendToPrinter(message);
        // Get its answer
        return this.responseReader.GerPrinterResponce(MachineCommands_1.MachineCommands.GetEndstopStaus);
    };
    /// <summary>
    /// Gets the firmware version of the printer.
    /// </summary>
    /// <returns>
    /// A task containing the current printer state.
    /// </returns>
    Printer.prototype.GetFirmwareVersionAsync = function () {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands_1.MachineCommands.GetFirmwareVersion;
        this.SendToPrinter(message);
        // Get its answer
        return this.responseReader.GerPrinterResponce(MachineCommands_1.MachineCommands.GetFirmwareVersion);
    };
    /// <summary>
    /// Gets the printer temperature.
    /// </summary>
    /// <returns>
    /// A task containing the current printer state.
    /// </returns>
    Printer.prototype.GetTemperatureAsync = function () {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands_1.MachineCommands.GetTemperature;
        this.SendToPrinter(message);
        // Get its answer
        return this.responseReader.GerPrinterResponce(MachineCommands_1.MachineCommands.GetTemperature);
    };
    /// <summary>
    /// Senda a command to the printer and returns its raw response.
    /// </summary>
    /// <param name="command">
    /// The full command and any params to send to the printer. 
    /// Do not include the leading ~
    /// </param>
    Printer.prototype.SendDebugCommandAsync = function (command) {
        this.ValidatePrinterReady();
        var message = "~" + command;
        console.log(message);
        this.SendToPrinter(message);
        // Get its answer
        return this.WaitForPrinterAck(command);
    };
    /// <summary>
    /// Instructs the printer to print a file already stored in its internal memory.
    /// </summary>
    /// <param name="fileName">
    /// The file name (including extention) of the file to print.
    /// </param>
    /// <returns>
    /// A task that will complete when the command is sent to the printer and it starts printing.
    /// </returns>
    Printer.prototype.PrintFileAsync = function (fileName) {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands_1.MachineCommands.PrintFileFromSd + " 0:/user/" + fileName;
        this.SendToPrinter(message);
        return this.WaitForPrinterAck(MachineCommands_1.MachineCommands.PrintFileFromSd);
    };
    /// <summary>
    /// Transfers a file to the printer's storage with a given name.
    /// </summary>
    /// <param name="filePath">
    /// The path to the file to transfer.
    /// </param>
    /// <param name="fileName">
    /// The name of the file to store it as (without file extension)
    /// </param>
    /// <returns>
    /// A task that will complete once the file has been send to the printer.
    /// </returns>
    Printer.prototype.StoreFileAsync = function (filePath, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var modelBytes, message, count, offset, crc, packet, dataSize, crcResult, actualLength, data, crcResult, i, t, bufferToSend, i, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ValidatePrinterReady();
                        return [4 /*yield*/, new Promise(function (a, r) {
                                fs.readFile(filePath, function (error, data) {
                                    if (error) {
                                        r(error);
                                    }
                                    a(data);
                                });
                            })];
                    case 1:
                        modelBytes = _a.sent();
                        message = "~" + MachineCommands_1.MachineCommands.BeginWriteToSdCard + " " + modelBytes.length + " 0:/user/" + fileName;
                        this.SendToPrinter(message);
                        return [4 /*yield*/, this.WaitForPrinterAck(MachineCommands_1.MachineCommands.BeginWriteToSdCard)];
                    case 2:
                        _a.sent();
                        count = 0;
                        offset = 0;
                        while (offset < modelBytes.length) {
                            dataSize = 0;
                            if (offset + this.packetSizeBytes < modelBytes.length) {
                                packet = modelBytes.subarray(offset, offset + this.packetSizeBytes);
                                crcResult = crc32(packet);
                                crc = crcResult;
                                dataSize = this.packetSizeBytes;
                            }
                            else {
                                actualLength = modelBytes.length - offset;
                                data = modelBytes.subarray(offset, actualLength + offset);
                                crcResult = crc32(data);
                                crc = crcResult;
                                for (i = 0; i < data.length; ++i) {
                                    t = data[i];
                                    packet.writeUInt32LE(t, i);
                                }
                                packet.fill(null, actualLength, this.packetSizeBytes);
                                dataSize = actualLength;
                            }
                            bufferToSend = Buffer.alloc(this.packetSizeBytes + 16);
                            bufferToSend.writeUInt16LE(0x5a, 0);
                            bufferToSend.writeUInt16LE(0x5a, 1);
                            bufferToSend.writeUInt16LE(0xef, 2);
                            bufferToSend.writeUInt16LE(0xbf, 3);
                            // Add the count of this packet, the size of the data it in (not counting padding) and the CRC.
                            bufferToSend.writeUInt32BE(count, 4);
                            bufferToSend.writeUInt32BE(dataSize, 8);
                            bufferToSend.writeUInt32BE(crc, 12);
                            // Add the data
                            for (i = 0; i < packet.length; ++i) {
                                bufferToSend.writeUInt8(packet[i], i + 16);
                            }
                            // Send it to the printer
                            this.SendBufferToPrinter(bufferToSend);
                            offset += this.packetSizeBytes;
                            ++count;
                        }
                        this.SendToPrinter("");
                        message = "~" + MachineCommands_1.MachineCommands.EndWriteToSdCard;
                        this.SendToPrinter(message);
                        return [2 /*return*/, this.WaitForPrinterAck(MachineCommands_1.MachineCommands.EndWriteToSdCard)];
                }
            });
        });
    };
    /// <summary>
    /// Waits fot the printer to acknowledge that a command send to it completed.
    /// </summary>
    /// <returns>
    /// A task that will complete when the printer acknowledges the command.
    /// </returns>
    Printer.prototype.WaitForPrinterAck = function (commandId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.responseReader.GerPrinterResponce(commandId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /// <summary>
    /// Validates that we are currently in a valid state to communicate with the printer.
    /// </summary>
    Printer.prototype.ValidatePrinterReady = function () {
        if (this.isDisposed) {
            throw new Error("Printer is no longer connected");
        }
        if (!this.isConnected) {
            throw new Error(("Not connected to printer, or connection lost"));
        }
    };
    return Printer;
}());
exports.Printer = Printer;
