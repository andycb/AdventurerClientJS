
import { IPrinterResponce } from './IPrinterResponce';
import { Vector3 } from './Vector3';

 export class FirmwareVersionResponse implements IPrinterResponce
 {
     /// <summary>
     /// Gets the machine type.
     /// </summary>
     MachineType: string

     /// <summary>
     /// Gets the machine name.
     /// </summary>
     MachineName: string

     /// <summary>
     /// Gets the firmware version.
     /// </summary>
     FirmwareVersion: string

     /// <summary>
     /// Gets the serial number.
     /// </summary>
     SerialNumber: string

     /// <summary>
     /// Gets the tool count.
     /// </summary>
     ToolCount: number;

     /// <summary>
     /// Gets the print volume of the printer.
     /// </summary>
     BuildVolume: Vector3;

     /// <summary>
     /// Initializes a new instance of the FirmwareVersionResponse class.
     /// </summary>
     /// <param name="responses">
     /// The responses sent from the printer after the endstop status was requested.
     /// </param>
     constructor (responses : Array<string>)
     {
         //// Example interaction:
         ////
         //// CMD M115 Received.
         //// Machine Type: Voxel
         //// Machine Name: Voxel
         //// Firmware: v1.0.3
         //// SN: XXXX999999
         //// X: 150 Y: 150 Z: 150
         //// Tool Count: 1
         //// ok
         responses.forEach(response => {
             var parts = response.split(/\:(.+)/)
             if (parts.length > 1)
             {
                 switch (parts[0].trim().toLowerCase())
                 {
                     case "machine type":
                         this.MachineType = parts[1].trim();
                         break;

                     case "machine name":
                         this.MachineName = parts[1].trim();
                         break;
                         
                     case "firmware":
                         this.FirmwareVersion = parts[1].trim();
                         break;

                    case "sn":
                        this.SerialNumber = parts[1].trim();
                        break;

                    case "tool count":
                        this.ToolCount = Number.parseInt(parts[1].trim());
                        break;

                    case "x":
                        this.BuildVolume = FirmwareVersionResponse.GetBuildVolumeVector(response.trim());
                        break;
                 }
             }
         });
     }
     /// <summary>
     /// Extracts the build volume from the string reprisentation.
     /// </summary>
     /// <param name="strVal">
     /// The string reprisentation sent by the printer.
     /// </param>
     /// <returns>
     /// A vector reprisenting the current build volume.
     /// </returns>
     private static GetBuildVolumeVector(strVal : string) : Vector3
     {
         // Example format: X: 150 Y: 150 Z: 150
         var result = new Vector3(Number.NaN, Number.NaN, Number.NaN);

         var xyzParts = strVal.split(' ');
         for (var i = 0; i < xyzParts.length; i += 2){
             switch(xyzParts[i].toLowerCase()){
                 case "x:":
                    result.X = Number.parseFloat(xyzParts[i + 1]);

                case "y:":
                    result.Y = Number.parseFloat(xyzParts[i + 1]);

                case "z:":
                    result.Z = Number.parseFloat(xyzParts[i + 1]);
             }
         }

         return result;
     }
 }