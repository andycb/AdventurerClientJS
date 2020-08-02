export class ErrorLogger{
    public static NonFatalError(error: Error){
        console.log("ErrorLogger::NonFatalError() - " + error.toString() + "\n" + error.stack);
    }
}