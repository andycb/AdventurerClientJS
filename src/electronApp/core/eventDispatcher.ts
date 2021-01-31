type Handler<E> = (event: E) => void;

/**
 * Very lightweight dispatcher for registering and invoking events.
 */
export class EventDispatcher<E> {
    /**
     * The handlers that are currently registered.
     */
    private handlers: Array<EventHandler<E>>;

    /**
     * Initializes a new instance of the EventDispatcher class.
     */
    constructor() {
        this.handlers = new Array<EventHandler<E>>();
    }

    /**
     * Raise the event to notify all subscribers of new data.
     * @param eventData The event data.
     */
    public Invoke(eventData: E): void {
        this.handlers.forEach(h => {
            h.Handler.bind(h.Context)(eventData);
        });
    }

    /**
     * Raise the event to notify all subscribers of new data.
     * @param eventData A function to invoke to get the event data.
     * If if there are zero subscribers listening to the event the function will not be invoked.
     * If there are any listeners the function wil be invoked exactly once.
     */
    public InvokeLazy(eventData: () => E): void {
        if (this.handlers.length > 0){
            const result = eventData();
            this.Invoke(result);
        }
    }

    /**
     * Register for new events.
     * @param handler Thee event handler.
     * @param context (optional) The context to use for 'this' when invoking the event handler.
     */
    public Register(handler: Handler<E>, context: any = undefined): void {
        this.handlers.push(new EventHandler<E>(handler, context));
    }

    /**
     * Unregister a handler.
     * @param handler The handler.
     */
    public Unregister(handler: Handler<E>): void {
        const foundHandler = this.handlers.find(h => h.Handler == handler);
        const index = this.handlers.indexOf(foundHandler);
        this.handlers.splice(index, 1);
    }
}

/**
 * Stores a registered event handler.
 */
export class EventHandler<E> {
    /**
     * The function to call back when the event is invoked.
     */
    public readonly Handler: Handler<E>;

    /**
     * The context to use for 'this' when invoking the event handler
     */
    public readonly Context: any;

    /**
     * Initializes a new instance of the EventHandler class
     * @param handler The function to call back when the event is invoked.
     * @param context The context to use for 'this' when invoking the event handler
     */
    constructor (handler: Handler<E>, context: any){
        this.Handler = handler;
        this.Context = context;
    }
}
