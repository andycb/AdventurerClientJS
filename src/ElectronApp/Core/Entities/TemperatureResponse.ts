
import { IPrinterResponce } from './IPrinterResponce';
import { templateJitUrl } from '@angular/compiler';

 export class TemperatureResponse implements IPrinterResponce
 {
     /// <summary>
     /// Gets the temperature of tool 0;
     /// </summary>
     Tool0Temp: number;

     /// <summary>
     /// Gets the temperature of the build plate.
     /// </summary>
     BuildPlateTemp: number;

     /// <summary>
     /// Initializes a new instance of the TemperatureResponse class.
     /// </summary>
     /// <param name="responses">
     /// The responses sent from the printer after the endstop status was requested.
     /// </param>
     constructor (responses : Array<string>)
     {
         //// Example interaction:
         ////
         //// CMD M105 Received.
         //// T0:25 /0 B:17/0
         //// ok
         ////
         //// Note the differnece in spacing between the two slashes in the above. This is
         //// how is is sent from the printer.
         responses.forEach(response => {
             if (response.startsWith("T0:")){
                 var parts = response.split(' ');
                 parts.forEach(part => { 
                     var tempSplit = part.split(/\:(.+)/)
                     for (var i = 0; i < tempSplit.length; ++i){
                         if (tempSplit[i] == "T0"){
                             this.Tool0Temp = Number.parseFloat(tempSplit[i + 1]);
                         }
                         else if (tempSplit[i] == "B"){
                             var temp = tempSplit[i + 1];
                             temp = temp.substr(0, temp.indexOf('/'));
                             this.BuildPlateTemp = Number.parseFloat(temp);
                         }
                     }
                 })
             }
         });
     } 
 }