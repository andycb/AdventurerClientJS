
import { Vector3 } from './Vector3';
import { IPrinterResponce } from './IPrinterResponce';

 export class PrinterStatus implements IPrinterResponce
 {
     /// <summary>
     /// Gets the current endstop values.
     /// </summary>
     Endstop : Vector3
     
     /// <summary>
     /// Gets the current machine status.
     /// </summary>
     MachineStatus : string
     /// <summary>
     /// Gets the current move mode.
     /// </summary>
     MoveMode : string
     /// <summary>
     /// Initializes a new instance of the PrinterStatus class.
     /// </summary>
     /// <param name="responses">
     /// The responses sent from the printer after the endstop status was requested.
     /// </param>
     constructor (responses : Array<string>)
     {
         //// Example interaction:
         ////
         //// CMD M119 Received.
         //// Endstop: X-max:1 Y-max:0 Z-max:0
         //// MachineStatus: READY
         //// MoveMode: READY
         //// Status: S:0 L:0 J:0 F:0
         //// ok
         responses.forEach(response => {
             var parts = response.split(/\:(.+)/)
             if (parts.length > 1)
             {
                 switch (parts[0].trim().toLowerCase())
                 {
                     case "machinestatus":
                         this.MachineStatus = parts[1].trim();
                         break;
                     case "movemode":
                         this.MoveMode = parts[1].trim();
                         break;
                         
                     case "endstop":
                         this.Endstop = PrinterStatus.GetEndstopVector(parts[1]);
                         break;
                 }
             }
         });
     }
     /// <summary>
     /// Extracts the endstop vector fro the string reprisentation.
     /// </summary>
     /// <param name="strVal">
     /// The string reprisentation send by the printer.
     /// </param>
     /// <returns>
     /// A vector reprisenting the current endstop value.
     /// </returns>
     private static GetEndstopVector(strVal : string) : Vector3
     {
         // Example format: X-max:1 Y-max:0 Z-max:0
         var result = new Vector3(Number.NaN, Number.NaN, Number.NaN);
         
         /// First break out each of the X/Y/Z planes
         var xyzParts = strVal.split(' ');
         xyzParts.forEach(plane => {
             // For each plane break into a key and value
             var planeParts = plane.split(':');
             if (planeParts.length == 2)
             {
                 // Attemt to parse the value
                 var val = Number.parseFloat(planeParts[1]);
                 if (!Number.isNaN(val))
                 {
                     // Assign the parsed value to the relevent plane
                     switch(planeParts[0].toLocaleLowerCase())
                     {
                         case "x-max":
                             result.X = val;
                             break;
                         case "y-max":
                             result.Y = val;
                             break;
                         case "z-max":
                             result.Z = val;
                             break;
                     }
                 }
             }
         });
         return result;
     }
 }