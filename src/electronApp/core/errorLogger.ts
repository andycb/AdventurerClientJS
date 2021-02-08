var nodeLog = window.require('node-log-rotate');

/**
 * A static class for logging errors.
 */
export class ErrorLogger {
    /**
     * Log an error that the app recovered from.
     * @param error The error.
     */
    public static NonFatalError(error: Error): void {
        const errorMessage = 
            'ErrorLogger::NonFatalError() - ' 
            + error.toString()
            + '\n'
            + error.stack;

        console.log(errorMessage);
        nodeLog.log(errorMessage);
    }

    /**
     * Logs a trance message.
     * @param message The message.
     */
    public static Trace(message: string): void {
        const formattedMessage = 
            'ErrorLogger::Trace() - ' 
            + message;

        console.log(formattedMessage);
        nodeLog.log(formattedMessage);
    }

    /**
     * Sets up the logger and purges old logs.
     */
    public static SetUp() {
        nodeLog.setup({
            appName: 'adventurer-client',  
            maxSize: 10 * 1024 * 1024
        });
  
        nodeLog.deleteLog(7);
        ErrorLogger.Trace("Application Started");
    }
}
