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
exports.PrinterService = void 0;
var Printer_1 = require("./Printer");
var ErrorLogger_1 = require("./ErrorLogger");
var EventDispatcher_1 = require("./EventDispatcher");
var path = require('path');
var PrinterService = /** @class */ (function () {
    function PrinterService() {
        this.ConnectionStateChanged = new EventDispatcher_1.EventDispatcher();
        this.printer = null;
        // Private constructor
    }
    PrinterService.Init = function () {
        if (window["PrinterService"] == undefined) {
            window["PrinterService"] = new PrinterService();
        }
    };
    PrinterService.prototype.GetIsConnected = function () {
        return this.isConected;
    };
    PrinterService.prototype.ConnectAsync = function (printerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.printer = new Printer_1.Printer(printerAddress);
                        return [4 /*yield*/, this.printer.ConnectAsync()];
                    case 1:
                        _a.sent();
                        this.isConected = true;
                        this.ConnectionStateChanged.Invoke(true);
                        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, this.printer.GetPrinterStatusAsync()];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        e_1 = _a.sent();
                                        ErrorLogger_1.ErrorLogger.NonFatalError(e_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, 5000);
                        return [2 /*return*/];
                }
            });
        });
    };
    PrinterService.prototype.Disconnect = function () {
        this.printer.Disconnect();
        this.printer = null;
        this.isConected = false;
        this.ConnectionStateChanged.Invoke(false);
    };
    PrinterService.prototype.GetPrinterStatusAsync = function () {
        if (this.printer == null) {
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        return this.printer.GetPrinterStatusAsync();
    };
    PrinterService.prototype.PrintFileAsync = function (fileName) {
        if (this.printer == null) {
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        return this.printer.PrintFileAsync(fileName);
    };
    PrinterService.prototype.SendDebugCommandAsync = function (command) {
        if (this.printer == null) {
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        return this.printer.SendDebugCommandAsync(command);
    };
    PrinterService.prototype.GetFirmwareVersionAsync = function () {
        if (this.printer == null) {
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        return this.printer.GetFirmwareVersionAsync();
    };
    PrinterService.prototype.GetTemperatureAsync = function () {
        if (this.printer == null) {
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        return this.printer.GetTemperatureAsync();
    };
    PrinterService.prototype.StoreFileAsync = function (filePath) {
        if (this.printer == null) {
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        // Deal with .gcode files by stripping the extension and using .g. Leave gx files alone
        var pathInfo = path.parse(filePath);
        var fileName = pathInfo.name;
        if (pathInfo.ext.toLowerCase() != ".gx") {
            fileName = fileName + ".g";
        }
        else {
            fileName = fileName + ".gx";
        }
        return this.printer.StoreFileAsync(filePath, fileName);
    };
    PrinterService.prototype.GetDebugMonitor = function () {
        return this.printer.PrinterDebugMonitor;
    };
    return PrinterService;
}());
exports.PrinterService = PrinterService;
