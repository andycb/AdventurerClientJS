/**
 * A static class for logging errors.
 */
export class ErrorLogger{
    /**
     * Log an error that the app recovered from.
     * @param error The error.
     */
    public static NonFatalError(error: Error): void {
        console.log('ErrorLogger::NonFatalError() - '
        + error.toString()
        + '\n'
        + error.stack);
    }
}
