type Handler<E> = (event: E) => void;

export class EventDispatcher<E> { 
    private handlers: Array<Handler<E>>;

    constructor () {
        this.handlers = new Array<Handler<E>>();
    }

    public Invoke(event: E) { 
        this.handlers.forEach(h => {
            h(event);
        });
    }

    public Register(handler: Handler<E>) { 
        this.handlers.push(handler);
    }

    public Unregister(handler: Handler<E>) {
        var index = this.handlers.indexOf(handler);
        this.handlers.splice(index,1);
    }
}
