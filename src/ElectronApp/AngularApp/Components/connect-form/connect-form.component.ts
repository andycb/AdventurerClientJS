import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrinterServiceWrapperService } from "../../Services/printer-service-wrapper.service"
import { ErrorLogger } from "../../../Core/ErrorLogger"
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/**
 * The connect form component, shown when not connected to a printer.
 */
@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: ['./connect-form.component.css']
})
export class ConnectFormComponent implements OnInit {

  public isError: boolean;
  private returnUrl: string;
  matcher = new MyErrorStateMatcher();

  PrinterAddress = new FormControl('', [
    Validators.required
  ]);

  constructor(private route: ActivatedRoute, private printerService: PrinterServiceWrapperService, private router: Router){

    this.printerService.ConnectionStateChanged.Register(isConnected => {
      // If we now how a connection, continue to our original destination
      if (isConnected){
        this.router.navigate([this.returnUrl ?? '/']);
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] as string;
    });
  }

  /**
   * Invoked when the connect button is pressed
   */
  public async connect(){
    if (this.PrinterAddress.value.trim().length == 0){
      return;
    }

    try{
      await this.printerService.ConnectAsync(this.PrinterAddress.value);
    }
    catch(e) {
      this.isError = true;
      ErrorLogger.NonFatalError(e);
    }
  } 
}
