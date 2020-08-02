"use strict";
exports.__esModule = true;
var PrinterService_1 = require("./ElectronApp/Core/PrinterService");
// Initalize a the printer service so here so that it is loaded with Node cotext, 
// we'll wrap it with a mockable serbive higher up the cal stack
PrinterService_1.PrinterService.Init();
