import { ErrorLogger } from 'electronApp/core/errorLogger';
import { EventDispatcher } from '../core/eventDispatcher';
const MjpegCamera = window.require('mjpeg-camera');

/**
 * Represents the printer's camera.
 */
export class PrinterCamera {
     /**
     * The number of milliseconds to wait for the camera to respond before calling it disconnected.
     */
    private readonly lostConnectionTimeout: number = 2000;

    /**
     * The address of the printer.
     */
    private readonly printerAddress: string;

    /**
     * The connection to the mjpeg camera stream.
     */
    private camera: any;

    /**
     * The current timeout.
     */
    private currentTimeout: NodeJS.Timeout = null;

     /**
     * Event raised when a new video frame is available from the camera.
     */
    public readonly NewFrame = new EventDispatcher<string>();

    /**
     * Event raised when the camera's availability changes.
     */
    public readonly CameraStateChanged = new EventDispatcher<CameraState>();

    /**
     * Gets the state of the camera.
     */
    public CameraState: CameraState = CameraState.Unknown;

    /**
     * Initializes a new instance of the PrinterCamera class.
     * @param ipAddress he IP address of the printer to connect to.
     */
    public constructor(ipAddress: string) {
        this.printerAddress = ipAddress;
    }

    /**
     * Attempts to establish a connection to the printer and starts monitoring it.
     */
    private EstablishPrinterConnection(): void {
        this.camera = new MjpegCamera({
            url: this.GetStreamAddress()
        });

        // Set a timeout to check if the camera becomes connected
        this.currentTimeout = setTimeout(() => this.ReportNoConnectionAndAttemptReconnect(), this.lostConnectionTimeout);
        this.camera.start((e) => {
            // Connection to camera failed
            ErrorLogger.NonFatalError(e);
            this.ReportNoConnectionAndAttemptReconnect();
        });

        this.camera.on('data', frame => {
            // Reset the timeout
            if (this.currentTimeout){
                clearTimeout(this.currentTimeout);
            }

            // We got data from the camera, its available!
            this.UpdateCameraState(CameraState.Available);

            // Set a timeout to report disconnected if more data does not arrive.
            this.currentTimeout = setTimeout(() => this.ReportNoConnectionAndAttemptReconnect(), this.lostConnectionTimeout);

            // Notify subscribers that there is a new frame
            this.NewFrame.InvokeLazy(() => {
                // Lazy convert teh stream into a base 64 string only if there is a subscriber listening.
                return 'data:image/jpeg' + ';base64,' + frame.data.toString('base64');
            });
        });
    }

    /**
     * Reports that the camera connection is lost and starts trying to reconnect.
     */
    private ReportNoConnectionAndAttemptReconnect() {
        this.DisconnectCamera();
        this.UpdateCameraState(CameraState.NotAvailable);

        // Wait for a while and try and make a new connection.
        this.currentTimeout = setTimeout(() => this.EstablishPrinterConnection(), this.lostConnectionTimeout);
    }

    /**
     * Connects to the camera.
     */
    public ConnectCamera() {
        this.EstablishPrinterConnection();
    }

    /**
     * Disconnect from the camera.
     */
    public DisconnectCamera(): void{
        if (this.camera){
            this.camera.stop();
            this.camera = null;
        }

        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
    }

    /**
     * Updates the current availability state of the camera.
     * @param newState The new state.
     */
    private UpdateCameraState(newState: CameraState) {
        if (this.CameraState != newState) {
            this.CameraState = newState;
            this.CameraStateChanged.Invoke(newState);
        }
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

/**
 * Represents the current state of the camera.
 */
export enum CameraState {
    /**
     * The state is still loading and is not yet known.
     */
    Unknown,

    /**
     * The camera is available.
     */
    Available,

    /**
     * The printer is not available.
     */
    NotAvailable
}
