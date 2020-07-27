console.log("preload");

var path = require('path');
import { Printer } from "./ElectronApp/Core/Printer"
import { PrinterStatus } from "./ElectronApp/Core/Entities/PrinterStatus"

export class PrinterService{
    printer: Printer = null;

    public ConnectAsync(printerAddress: string) : Promise<any> {
        console.log("Test Executed");

        this.printer = new Printer(printerAddress);
        return this.printer.ConnectAsync();
    }    

    public GetPrinterStatusAsync() : Promise<PrinterStatus>{
        if (this.printer == null){
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }

        return this.printer.GetPrinterStatusAsync();
    }

    public PrintFileAsync(fileName: string) : Promise<any>{
        if (this.printer == null){
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }

        return this.printer.PrintFileAsync(fileName);
    }

    public StoreFileAsync(filePath: string) : Promise<void>{
        if (this.printer == null){
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }

        // Deal with .gcode files by stripping the extension and using .g. Leave gx files alone
        var pathInfo = path.parse(filePath);
        var fileName = pathInfo.name;
        if (pathInfo.ext.toLowercase() != ".gx"){
            fileName = fileName + ".g"
        }
        else{
            fileName = fileName + ".gx"
        }
        
        return this.printer.StoreFileAsync(filePath, fileName);
    }
}

window["PrinterService"] = new PrinterService();
