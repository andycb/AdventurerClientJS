import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PrinterService } from "../Services/PrinterService";

@Injectable({
    providedIn: 'root'
  })
export class ConnectedGuard implements CanActivate {

    constructor(private router: Router, private printerService: PrinterService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.printerService.GetIsConnected()) {
            return true;
        }

        this.router.navigate(['/connect'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}