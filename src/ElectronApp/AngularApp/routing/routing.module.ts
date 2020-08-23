import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConnectFormComponent } from '../components/connect-form/connect-form.component';
import { StatusComponent } from '../components/status/status.component';
import { AboutComponent } from '../components/about/about.component';
import { ConnectedGuard } from './connectedGuard';
import { DebugComponent } from '../components/debug/debug.component'
import { PrintComponent } from '../components/print/print.component'

/**
 * The app routes.
 */
const routes: Routes = [
  { path: 'connect', component: ConnectFormComponent},
  { path: 'status', component: StatusComponent, canActivate: [ConnectedGuard]},
  { path: 'about', component: AboutComponent },
  { path: 'debug', component: DebugComponent, canActivate: [ConnectedGuard]},
  { path: 'print', component: PrintComponent, canActivate: [ConnectedGuard]},
  { path: '', redirectTo: '/status', pathMatch: 'full' }
];

/**
 * The routing module.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
