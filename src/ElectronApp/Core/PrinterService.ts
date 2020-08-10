import { Printer } from "./Printer"
import { PrinterStatus } from "./Entities/PrinterStatus"
import { DebugResponse } from "./Entities/DebugResponse"
import { TemperatureResponse } from "./Entities/TemperatureResponse"
import { FirmwareVersionResponse } from "./Entities/FirmwareVersionResponse"
import { ErrorLogger } from "./ErrorLogger"
import { IPrinterService } from "./IPrinterService";
import { EventDispatcher } from "./EventDispatcher"
import { PrinterDebugMonitor } from "./Entities/PrinterDebugMonitor"

var path = require('path');

export class PrinterService implements IPrinterService {
    public static Init(){
        if (window["PrinterService"] == undefined){
            window["PrinterService"] = new PrinterService();
        }
    }

    private isConected: boolean;
    public GetIsConnected(): boolean {
        return this.isConected;
    }
    
    public readonly ConnectionStateChanged = new EventDispatcher<boolean>();

    printer: Printer = null;

    private constructor(){
        // Private constructor
    }

    public async ConnectAsync(printerAddress: string) : Promise<any> {
        this.printer = new Printer(printerAddress);
        await this.printer.ConnectAsync();
        this.isConected = true;
        this.ConnectionStateChanged.Invoke(true);

        setInterval(async () => {
            try {
                await this.printer.GetPrinterStatusAsync();
            }
            catch(e){
                ErrorLogger.NonFatalError(e);
            }
        }, 5000);
    }

    public Disconnect(){
        this.printer.Disconnect();
        this.printer = null;
        this.isConected = false;
        this.ConnectionStateChanged.Invoke(false);
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

    SendDebugCommandAsync(command: string) : Promise<any> {
        if (this.printer == null){
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }

        return this.printer.SendDebugCommandAsync(command);
    }

    GetFirmwareVersionAsync() : Promise<FirmwareVersionResponse> {
        if (this.printer == null){
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }

        return this.printer.GetFirmwareVersionAsync();
    }   
    
    GetTemperatureAsync(): Promise<TemperatureResponse> {
        if (this.printer == null){
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }

        return this.printer.GetTemperatureAsync();
    }

    public StoreFileAsync(filePath: string) : Promise<void>{
        if (this.printer == null){
            throw new Error("Cannot call this method before calling and awaiting ConnectAsnc()");
        }
        
        // Deal with .gcode files by stripping the extension and using .g. Leave gx files alone
        var pathInfo = path.parse(filePath);

        var fileName = pathInfo.name;
        if (pathInfo.ext.toLowerCase() != ".gx"){
            fileName = fileName + ".g"
        }
        else{
            fileName = fileName + ".gx"
        }
        
        return this.printer.StoreFileAsync(filePath, fileName);
    }

    public GetDebugMonitor() : PrinterDebugMonitor {
        return this.printer.PrinterDebugMonitor;
    }
}