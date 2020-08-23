import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PrinterService } from '../services/printerService';

/**
 * Guard component to redirect navigation to the connect form is the app is not connected to a printer.
 */
@Injectable({
    providedIn: 'root'
  })
export class ConnectedGuard implements CanActivate {

    /**
     * Initializes a new instance of the ConnectedGuard class.
     * @param router The Angular router
     * @param printerService The printer service.
     */
    constructor(private router: Router, private printerService: PrinterService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.printerService.GetIsConnected()) {
            return true;
        }

        this.router.navigate(['/connect'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}