
import { IPrinterResponse } from './iPrinterResponse';
import { Vector3 } from './vector3';

/**
 * Represents a response from the printer for the firmware version request.
 */
export class FirmwareVersionResponse implements IPrinterResponse
{
    /**
     * Gets the machine type.
     */
    MachineType: string;

    /**
     * Gets the machine name.
     */
    MachineName: string;

    /**
     * Gets the firmware version.
     */
    FirmwareVersion: string;

    /**
     * Gets the serial number.
     */
    SerialNumber: string;

    /**
     * Gets the tool count.
     */
    ToolCount: number;

    /**
     * Gets the print volume of the printer.
     */
    BuildVolume: Vector3;

    /**
     * Initializes a new instance of the FirmwareVersionResponse class.
     * @param responses The responses sent from the printer after the endstop status was requested.
     */
    constructor(responses: Array<string>)
    {
        // Example interaction:
        //
        // CMD M115 Received.
        // Machine Type: Voxel
        // Machine Name: Voxel
        // Firmware: v1.0.3
        // SN: XXXX999999
        // X: 150 Y: 150 Z: 150
        // Tool Count: 1
        // ok
        responses.forEach(response => {
            const parts = response.split(/\:(.+)/);
            if (parts.length > 1)
            {
                switch (parts[0].trim().toLowerCase())
                {
                    case 'machine type':
                        this.MachineType = parts[1].trim();
                        break;

                    case 'machine name':
                        this.MachineName = parts[1].trim();
                        break;

                    case 'firmware':
                        this.FirmwareVersion = parts[1].trim();
                        break;

                case 'sn':
                    this.SerialNumber = parts[1].trim();
                    break;

                case 'tool count':
                    this.ToolCount = Number.parseInt(parts[1].trim(), 10);
                    break;

                case 'x':
                    this.BuildVolume = FirmwareVersionResponse.GetBuildVolumeVector(response.trim());
                    break;
                }
            }
        });
    }

    /**
     * Extracts the build volume from the string representation.
     * @param strVal The string representation sent by the printer.
     */
    private static GetBuildVolumeVector(strVal: string): Vector3
    {
        // Example format: X: 150 Y: 150 Z: 150
        const result = new Vector3(Number.NaN, Number.NaN, Number.NaN);

        const xyzParts = strVal.split(' ');
        for (let i = 0; i < xyzParts.length; i += 2){
            switch (xyzParts[i].toLowerCase()){
                case 'x:':
                result.X = Number.parseFloat(xyzParts[i + 1]);
                break;

            case 'y:':
                result.Y = Number.parseFloat(xyzParts[i + 1]);
                break;

            case 'z:':
                result.Z = Number.parseFloat(xyzParts[i + 1]);
                break;
            }
        }

        return result;
    }
}
