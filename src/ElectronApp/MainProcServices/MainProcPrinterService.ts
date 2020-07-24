import { Printer } from "../../Core/Printer"

import { isParameter } from "typescript"
import { PrinterStatus } from "../../Core/Entities/PrinterStatus";
const ipc = require('electron').ipcMain

export class MainProcPrinterService{
    private printer: Printer;

    constructor(){
        ipc.handle("PrinterService", (event, args) => {
            var methodName = args as String;
            if (!(methodName)){
                methodName = args[0] as String;
            }
            else{
                args = args.slice(1);
            }

            console.log("Method name = " + methodName);

            var result: any;
            result = this.HandleRequestAsync(methodName, args);
            event.returnValue = result;
        });
    }

    private HandleRequestAsync(methodName: String, args: any[]) : Promise<any>{
        switch (methodName){
            case "IsConnected":
                return this.IsConnectedAsync(args[1]);

            case "Connect":
                return this.ConnectAsync(args[1]);

            case "GetPrinterStatus":
                return this.GetPrinterStatusAsync();
        }

    }

    private GetPrinterStatusAsync() : Promise<PrinterStatus> {
        return this.printer.GetPrinterStatusAsync();
    }

    private IsConnectedAsync(printerIp: string) : Promise<Boolean>{
        return new Promise(() => {
            this.printer != null;
        });
    }

    private ConnectAsync(printerIp: string) : Promise<any>{
        console.log(printerIp);
        this.printer = new Printer(printerIp);
        return this.printer.ConnectAsync();
    }
}