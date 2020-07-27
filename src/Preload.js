"use strict";
exports.__esModule = true;
exports.PrinterService = void 0;
console.log("preload");
var path = require('path');
var Printer_1 = require("./ElectronApp/Core/Printer");
var PrinterService = /** @class */ (function () {
    function PrinterService() {
        this.printer = null;
    }
    PrinterService.prototype.ConnectAsync = function (printerAddress) {
        console.log("Test Executed");
        this.printer = new Printer_1.Printer(printerAddress);
        return this.printer.ConnectAsync();
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
    PrinterService.prototype.StoreFileAsync = function (filePath) {
        if (this.printer == null) {
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        // Deal with .gcode files by stripping the extension and using .g. Leave gx files alone
        var pathInfo = path.parse(filePath);
        var fileName = pathInfo.name;
        if (pathInfo.ext.toLowercase() != ".gx") {
            fileName = fileName + ".g";
        }
        else {
            fileName = fileName + ".gx";
        }
        return this.printer.StoreFileAsync(filePath, fileName);
    };
    return PrinterService;
}());
exports.PrinterService = PrinterService;
window["PrinterService"] = new PrinterService();
