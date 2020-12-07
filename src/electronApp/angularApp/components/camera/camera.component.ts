import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  public readonly StreamAddress: string;

  /**
   * Initializes a new instance of the CameraComponent class.
   * @param printerService The printer service.
   */
  constructor(private printerService: PrinterService) {
    this.StreamAddress = printerService.GetCameraVideoStreamAddress();
  }

  ngOnInit(): void {
  }
}
