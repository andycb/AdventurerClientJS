import { Injectable } from '@angular/core';
import { IPrinterService } from "../../Core/IPrinterService"
import { PrinterStatus } from "../../Core/Entities/PrinterStatus"
import { TemperatureResponse } from "../../Core/Entities/TemperatureResponse"
import { FirmwareVersionResponse } from "../../Core/Entities/FirmwareVersionResponse"
import { EventDispatcher } from "../../Core/EventDispatcher"
import { PrinterDebugMonitor } from "../../Core/Entities/PrinterDebugMonitor"
import { Printer } from "../../Core/Printer"
import { ErrorLogger } from "../../Core/ErrorLogger"

var path = window.require('path');

@Injectable({
  providedIn: 'root'
})
export class PrinterService implements IPrinterService {

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
    var extension = pathInfo.ext.toLowerCase();
    if (extension != ".g" && extension != ".gx" && extension != ".gcode"){
        throw new Error("Invalid file type");
    }

    if (extension != ".gx"){
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

public EnableDebugLogging() : void {
    if (this.printer.PrinterDebugMonitor == null) {
        this.printer.PrinterDebugMonitor = new PrinterDebugMonitor();
    }
}

public DisableDebugLogging() : void {
    this.printer.PrinterDebugMonitor = null;
}
}
