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

    public IsEnabled(): Promise<boolean> {
        const checkCamera = (a) => {
            const request = new XMLHttpRequest();

            request.onload = () => {
                a(true);
            };

            request.onerror = () => {
                a(false);
            };

            request.open('GET', this.GetRootAddress());
            request.send();
        };

        return new Promise<boolean>(checkCamera);
    }

    public GetStreamAddress(): string {
        return this.GetRootAddress() + '/?action=stream';
    }

    public GetRootAddress(): string {
        return 'http://' + this.printerAddress + ':8080';
    }
}
