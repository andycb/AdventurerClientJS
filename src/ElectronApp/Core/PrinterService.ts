import { Printer } from "./Printer"
import { PrinterStatus } from "./Entities/PrinterStatus"
import { ErrorLogger } from "./ErrorLogger"
import { IPrinterService } from "./IPrinterService";
import { EventDispatcher } from "./EventDispatcher"

var path = require('path');

export class PrinterService implements IPrinterService {
    public static Init(){
        if (window["PrinterService"] == undefined){
            window["PrinterService"] = new PrinterService();
        }
    }
    
    public readonly ConnectionStateChanged = new EventDispatcher<boolean>();

    printer: Printer = null;

    private constructor(){
        // Private constructor
    }

    public async ConnectAsync(printerAddress: string) : Promise<any> {
        this.printer = new Printer(printerAddress);
        //await this.printer.ConnectAsync();
        this.ConnectionStateChanged.Invoke(true);

        setInterval(async () => {
            try {
                await this.printer.GetPrinterStatusAsync();
            }
            catch(e){
                ErrorLogger.NonFatalError(e);
            }
        }, 1000);
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