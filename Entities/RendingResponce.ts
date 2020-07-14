import { IPrinterResponce } from "./IPrinterResponce"

export class RendingResponce{
    constructor (commandId: string, result : IPrinterResponce, error : Error = null){
        this.CommandId = commandId;
        this.Result = result;
        this.Error = error;
    }

    public CommandId : string;
    public Result : IPrinterResponce;
    public Error : Error;
}