import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService';

/**
 * Component for viewing the printer camera feed.
 */
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  /**
   * Gets the address of teh camera stream.
   */
  public StreamAddress: string;

  /**
   * Gets a value indicating that teh camera is available.
   */
  public CameraAvailable: boolean = true;

  /**
   * Initializes a new instance of the CameraComponent class.
   * @param printerService The printer service.
   */
  constructor(private printerService: PrinterService) {
    this.StreamAddress = printerService.GetCameraVideoStreamAddress();
  }

  /**
  * Invoked when the Angular component is initialized.
  */
  ngOnInit(): void {

  }

  /**
  * Invoked when the Angular component is destroyed.
  */
  ngOnDestroy(): void  {
    this.StreamAddress = null;
  }

  /**
  * Invoked when the camera feed fails.
  */
  cameraError(): void {
    // Depending on the printer settings, the camera may become unavailable when printing finished, 
    // so show a message if the camera feed stops.
    this.CameraAvailable = false;
  }
}
