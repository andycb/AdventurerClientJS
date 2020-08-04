
import { IPrinterResponce } from './IPrinterResponce';

 export class DebugResponse implements IPrinterResponce
 {
     /// <summary>
     /// Gets the responses.
     /// </summary>
     Responses : Array<string>

     /// <summary>
     /// Initializes a new instance of the DebugResponse class.
     /// </summary>
     /// <param name="responses">
     /// The responses sent from the printer after the command equested.
     /// </param>
     constructor (responses : Array<string>)
     {
         this.Responses = responses;
     }
 }