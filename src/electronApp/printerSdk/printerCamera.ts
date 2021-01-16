/**
 * Represents the printer's camera.
 */
export class PrinterCamera {
    /**
     * The address of the printer.
     */
    readonly printerAddress: string;

    /**
     * Initializes a new instance of the PrinterCamera class.
     * @param ipAddress he IP address of the printer to connect to.
     */
    public constructor(ipAddress: string) {
        this.printerAddress = ipAddress;
    }

    /**
     * Gets a value indicating if the printer camera is enabled.
     */
    public IsEnabled(): Promise<boolean> {
        const checkCamera = (a) => {
            const request = new XMLHttpRequest();
            request.timeout = 3500;
            
            // Some printers only support streaming, so use the stream feed to check if the camera works
            // this means that we don't want to check for a full load, as the data is streaming and will never complete. 
            // So instead wait for the first chunk of data to show it works, then abort the connection.
            request.onreadystatechange = () => {
                if (request.readyState == XMLHttpRequest.LOADING) {
                    a(true);
                    request.abort();
                }
            };

            request.onerror = () => {
                a(false);
            };

            request.ontimeout = () => {
                a(false);
            };

            request.open('GET', this.GetStreamAddress());
            request.send();
        };

        return new Promise<boolean>(checkCamera);
    }

    /**
     * Gets the URL for the camera's live stream.
     */
    public GetStreamAddress(): string {
        return this.GetRootAddress() + '/?action=stream';
    }

    /**
     * Gets the root URL for the printer's camera controls.
     */
    public GetRootAddress(): string {
        return 'http://' + this.printerAddress + ':8080';
    }
}
