
import { IPrinterResponse } from './iPrinterResponse';

export class TemperatureResponse implements IPrinterResponse
 {
     /**
      * Gets the temperature of tool 0;
      */
     public Tool0Temp: number;

     /**
      * Gets the temperature of the build plate.
      */
     public BuildPlateTemp: number;

     /**
      * Initializes a new instance of the TemperatureResponse class.
      */
     constructor(responses: Array<string>)
     {
         // Example interaction:
         // /
         // CMD M105 Received.
         // T0:25 /0 B:17/0
         // ok

         // Note the difference in spacing between the two slashes in the above. This is
         // how is is sent from the printer.
         responses.forEach(response => {
             if (response.startsWith('T0:')){
                 const parts = response.split(' ');
                 parts.forEach(part => {
                     const tempSplit = part.split(/\:(.+)/);
                     for (let i = 0; i < tempSplit.length; ++i){
                         if (tempSplit[i] === 'T0'){
                             this.Tool0Temp = Number.parseFloat(tempSplit[i + 1]);
                         }
                         else if (tempSplit[i] === 'B'){
                             let temp = tempSplit[i + 1];
                             temp = temp.substr(0, temp.indexOf('/'));
                             this.BuildPlateTemp = Number.parseFloat(temp);
                         }
                     }
                 });
             }
         });
     }
 }
