import { EventDispatcher } from './eventDispatcher';

/**
 * A wrapper around a promise, which also provides a progress update.
 */
export class PromiseWithProgress<T> {
    /**
     * The promise to the completion of the operation.
     */
    public readonly Promise: Promise<T>;

    /**
     * Event raised when there is an update to the progress.
     */
    public readonly Progress = new EventDispatcher<number>();

    /**
     * Initializes a new instance of the StatusComponent class.
     * @param func The function to execute.
     */
    constructor (func: (updateProgress: (value: number) => void) => Promise<T>){
        this.Promise = func((value: number) => this.UpdateProgress(value));
    }

    /**
     * Updates the current progress.
     * @param value 
     */
    private UpdateProgress(value: number): void{
        if (value < 0 || value > 1){
            throw new Error("Value is out of range");
        }

        this.Progress.Invoke(value);
    }
}
