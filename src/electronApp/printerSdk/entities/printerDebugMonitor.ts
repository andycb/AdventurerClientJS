import { EventDispatcher } from '../../core/eventDispatcher';

/**
 * Indicate the direction a message was sent.
 */
export enum LoggedMessageDirection{
    /**
     * Message was sent from the client to the printer.
     */
    ToPrinter,

    /**
     * Message was sent from the printer to the client.
     */
    FromPrinter
}

/**
 * A logged message sent between the client and printer.
 */
export class LoggedMessage{
    /**
     * Gets the direction of the the message.
     */
    public readonly Direction: LoggedMessageDirection;

    /**
     * Gets the value of the message.
     */
    public readonly Message: string;

    /**
     * Initializes a new instance of the LoggedMessage class.
     * @param direction The direction of the message.
     * @param message The value of the message.
     */
    constructor(direction: LoggedMessageDirection, message: string){
        this.Direction = direction;
        this.Message = message;
    }
}

/**
 * A monitor that logs all traffic between the client and printer.
 */
export class PrinterDebugMonitor{
    /**
     * The the logged messages.
     */
    private messages: Array<LoggedMessage> = [];

    /**
     * Event rased when a new message is logged.
     */
    public readonly NewMessage = new EventDispatcher<LoggedMessage>();

    /**
     * Logs a message that was sent to the printer.
     * @param data The message value.
     */
    public LogDataToPrinter(data: string): void {
        const message = new LoggedMessage(LoggedMessageDirection.ToPrinter, data);
        this.messages.push(message);
        this.NewMessage.Invoke(message);
    }

    /**
     * Logs a message that was sent to the client.
     * @param data The message value.
     */
    public LogDataFromPrinter(data: string): void{
        const message = new LoggedMessage(LoggedMessageDirection.FromPrinter, data);
        this.messages.push(message);
        this.NewMessage.Invoke(message);
    }

    /**
     * Gets all logged messages.
     */
    public GetLog(): Array<LoggedMessage> {
        return this.messages;
    }

    /**
     * Clears all logged messages.
     */
    public ClearLog(): void {
        this.messages = new Array<LoggedMessage>();
    }
}
