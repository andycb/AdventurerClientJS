import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrinterService } from '../../services/printerService';
import { CameraState } from '../../../printerSdk/printerCamera'

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
   * Reference to the image element in the view.
   */
  @ViewChild('ImageElement') private imageElement: ElementRef;

  /**
   * Initializes a new instance of the CameraComponent class.
   * @param printerService The printer service.
   */
  constructor(private printerService: PrinterService) {
  }

  /**
  * Invoked when the Angular component is initialized.
  */
  ngOnInit(): void {
    // Depending on the printer settings, the camera may become unavailable when printing finished, 
    // so subscribe to changes in the camera state.
    this.printerService.GetCamera().NewFrame.Register(this.OnNewFrame, this)
    this.printerService.GetCamera().CameraStateChanged.Register(this.OnCameraStateChanged, this);
  }

  /**
   * Invoked when a new video frame is available from the camera.
   * @param frame The bas64 encoded video frame.
   */
  private OnNewFrame(frame: string) {
    if (this.imageElement && this.imageElement.nativeElement) {
      // The camera provides multiple frames per second, so to get good performance bypass
      // Angular's change detection and set the frame directly.
      this.imageElement.nativeElement.src = frame;
    }
  }

  /**
   * Invoked when the camera's availability changes.
   * @param cameraState The new status of the camera.
   */
  private OnCameraStateChanged(cameraState: CameraState) {
    this.CameraAvailable = cameraState == CameraState.Available;
  }

  /**
  * Invoked when the Angular component is destroyed.
  */
  ngOnDestroy(): void  {
    this.printerService.GetCamera().NewFrame.Unregister(this.OnNewFrame)
    this.printerService.GetCamera().CameraStateChanged.Unregister(this.OnCameraStateChanged);
  }
}
