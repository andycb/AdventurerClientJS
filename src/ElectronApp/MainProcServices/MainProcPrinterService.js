"use strict";
exports.__esModule = true;
exports.MainProcPrinterService = void 0;
var Printer_1 = require("../../Core/Printer");
var ipc = require('electron').ipcMain;
var MainProcPrinterService = /** @class */ (function () {
    function MainProcPrinterService() {
        var _this = this;
        ipc.handle("PrinterService", function (event, args) {
            var methodName = args;
            if (!(methodName)) {
                methodName = args[0];
            }
            else {
                args = args.slice(1);
            }
            console.log("Method name = " + methodName);
            var result;
            result = _this.HandleRequestAsync(methodName, args);
            event.returnValue = result;
        });
    }
    MainProcPrinterService.prototype.HandleRequestAsync = function (methodName, args) {
        switch (methodName) {
            case "IsConnected":
                return this.IsConnectedAsync(args[1]);
            case "Connect":
                return this.ConnectAsync(args[1]);
            case "GetPrinterStatus":
                return this.GetPrinterStatusAsync();
        }
    };
    MainProcPrinterService.prototype.GetPrinterStatusAsync = function () {
        return this.printer.GetPrinterStatusAsync();
    };
    MainProcPrinterService.prototype.IsConnectedAsync = function (printerIp) {
        var _this = this;
        return new Promise(function () {
            _this.printer != null;
        });
    };
    MainProcPrinterService.prototype.ConnectAsync = function (printerIp) {
        console.log(printerIp);
        this.printer = new Printer_1.Printer(printerIp);
        return this.printer.ConnectAsync();
    };
    return MainProcPrinterService;
}());
exports.MainProcPrinterService = MainProcPrinterService;
