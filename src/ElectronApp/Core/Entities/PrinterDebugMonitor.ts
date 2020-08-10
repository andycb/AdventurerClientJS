import { EventDispatcher } from "../EventDispatcher"

export enum LoggedMessageDirection{
    ToPrinter,
    FromPrinter
}

export class LoggedMessage{
    constructor(direction: LoggedMessageDirection, messsage: string){
        this.Direction = direction;
        this.Mesage = messsage;
    }

    public readonly Direction: LoggedMessageDirection;
    public readonly Mesage: String;
}

export class PrinterDebugMonitor{
    private messages: Array<LoggedMessage> = [];

    public readonly NewMessage = new EventDispatcher<LoggedMessage>();


    public LogDataToPrinter(data: string){
        var message = new LoggedMessage(LoggedMessageDirection.ToPrinter, data);
        this.messages.push(message);
        this.NewMessage.Invoke(message);
    }

    public LogDataFromPriter(data: string){
        var message = new LoggedMessage(LoggedMessageDirection.FromPrinter, data);
        this.messages.push(message);
        this.NewMessage.Invoke(message);    }

    public GetLog(): Array<LoggedMessage> {
        return this.messages;
    }

    public ClearLog() {
        this.messages = new Array<LoggedMessage>();
    }
}