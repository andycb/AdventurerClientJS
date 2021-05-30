
import { IPrinterResponse } from './iPrinterResponse';

export class TemperatureResponse implements IPrinterResponse {
    /**
     * Gets the temperature of tool 0;
     */
    public Tool0Temp: number;

    /**
     * Gets the target temperature of tool 0;
     */
    public Tool0TargetTemp: number;

    /**
     * Gets the temperature of the build plate.
     */
    public BuildPlateTemp: number;

    /**
     * Gets the target temperature of the build plate.
     */
    public BuildPlateTargetTemp: number;

    /**
     * Initializes a new instance of the TemperatureResponse class.
     */
    constructor(responses: Array<string>) {
        // Example interaction:
        // /
        // CMD M105 Received.
        // T0:25 /250 B:17/150
        // ok

        // Note the difference in spacing between the two slashes in the above. This is
        // how is is sent from the printer.
        responses.forEach(response => {
            if (response.startsWith('T0:')) { // the T0:25 /250 B:17/150 part of the response
                const parts = response.split(' '); // splits at space
                parts.forEach(part => {
                    const tempSplit = part.split(/\:(.+)/); // split part into it's components "T0", "{T0Temp}"" OR "/{T0TargetTemp}" OR "B", "{BuildPlateTemp}/{BuildPlateTargetTemp}"
                    for (let i = 0; i < tempSplit.length; ++i) {
                        if (tempSplit[i] === 'T0') { // if it's the T0 temp part (Tool0)
                            this.Tool0Temp = Number.parseFloat(tempSplit[i + 1]); // put the T0Temp into Tool0Temp
                        }
                        else if (tempSplit[i].substring(0, 1) === '/') { // if the tempSplit starts with '/' ("/{T0TargetTemp}")
                            this.Tool0TargetTemp = Number.parseFloat(tempSplit[i].substring(1)); // get whats after '/' into Tool0TargetTemp
                        }
                        else if (tempSplit[i] === 'B') { // if it's the B part (BuildPlate)
                            let temp = tempSplit[i + 1];
                            this.BuildPlateTemp = Number.parseFloat(temp.substr(0, temp.indexOf('/'))); // put what's before '/' into BuildPlateTemp
                            this.BuildPlateTargetTemp = Number.parseFloat(temp.substr(temp.indexOf('/') + 1)); // put what's after '/' inti BuildPlateTargetTemp
                        }
                    }
                });
            }
        });
    }
}
