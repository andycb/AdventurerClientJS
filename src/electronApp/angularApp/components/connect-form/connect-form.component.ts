import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, } from '@angular/core';
import { PrinterService } from '../../services/printerService';
import { ErrorLogger } from '../../../core/errorLogger';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSaver } from '../../../core/dataSaver';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/**
 * Error matcher for the printer address.
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  
  /**
   * Checks if a control is in an error state.
   * @param control The control to check.
   * @param form The form the control is in.
   */
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
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
  /**
   * Gets a value indicating that the error message should be shown.
   */
  public isError: boolean;

  /**
   * The URL that the user was attempting to navigate to when directed here.
   */
  private returnUrl: string;

  /**
   * Gets the matcher instance for this form.
   */
  public matcher = new MyErrorStateMatcher();

  /**
   * Array of last used IPs
   */
  private ips: string[];

  /**
   * Array of the filtered IPs
   */
  public filteredIPs: Observable<string[]>;

  /**
   * Gets the printer address form.
   */
  PrinterAddress = new FormControl('', [
    Validators.required
  ]);

  /**
   * ElementRef for the ip Address input field
   */
  @ViewChild("ipInput") ipInputField: ElementRef;

  /**
   * Initializes a new instance of the ConnectFormComponent.
   * @param route The current Angular rout.
   * @param printerService The printer service.
   * @param router The Angular router.
   */
  constructor(private route: ActivatedRoute, private printerService: PrinterService, private router: Router){
    
    this.printerService.ConnectionStateChanged.Register(isConnected => {
      // If we now how a connection, continue to our original destination
      if (isConnected){
        this.router.navigate([this.returnUrl ?? '/']);
      }
    });
  }

  /**
   * Invoked when the Angular component is initialized.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl as string;
    });
    this.ips = DataSaver.GetSavedIPs();
    this.filteredIPs = this.PrinterAddress.valueChanges.pipe(
      startWith(),
      map(value => this._filter(value))
    );
    this.PrinterAddress.setValue(this.ips[0]);
    window.setTimeout(() => {
      this.ipInputField.nativeElement.focus(); // click on input field 
    });
  }

  /**
   * Invoked when the connect button is pressed
   */
  public async connect(): Promise<unknown> {
    if (this.PrinterAddress.value.trim().length === 0) {
      return;
    }

    try{
      await this.printerService.ConnectAsync(this.PrinterAddress.value);
      DataSaver.SaveLastIP(this.PrinterAddress.value);
    }
    catch (e) {
      this.isError = true;
      ErrorLogger.NonFatalError(e);
    }
  }

  /**
   * Sets the selected ip into the Address field
   * @param ip The ip to set in the Address field
   */
  public setIP(ip: string) {
    DataSaver.SaveLastIP(ip);
    this.PrinterAddress.setValue(ip);
    this.ipInputField.nativeElement.click(); // click on input field
  }

  /**
   * Filters the options for autocomplete
   * @param value 
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ips.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}