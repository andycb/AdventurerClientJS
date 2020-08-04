import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PrinterServiceWrapperService } from "../Services/printer-service-wrapper.service";

@Injectable({
    providedIn: 'root'
  })
export class ConnectedGuard implements CanActivate {

    constructor(private router: Router, private printerService: PrinterServiceWrapperService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.printerService.GetIsConnected()) {
            return true;
        }

        this.router.navigate(['/connect'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}