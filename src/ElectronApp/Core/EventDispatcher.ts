type Handler<E> = (event: E) => void;

/**
 * Very lightweight dispatcher for registering and invoking events.
 */
export class EventDispatcher<E> {
    /**
     * The handlers that are currently registered.
     */
    private handlers: Array<Handler<E>>;

    /**
     * Initializes a new instance of the EventDispatcher class.
     */
    constructor() {
        this.handlers = new Array<Handler<E>>();
    }

    /**
     * Raise the event to notify all subscribers of new data.
     * @param event The event data.
     */
    public Invoke(event: E): void {
        this.handlers.forEach(h => {
            h(event);
        });
    }

    /**
     * Register for new events.
     * @param handler Thee vent handler.
     */
    public Register(handler: Handler<E>): void {
        this.handlers.push(handler);
    }

    /**
     * Unregister a handler.
     * @param handler The handler.
     */
    public Unregister(handler: Handler<E>): void {
        const index = this.handlers.indexOf(handler);
        this.handlers.splice(index, 1);
    }
}
