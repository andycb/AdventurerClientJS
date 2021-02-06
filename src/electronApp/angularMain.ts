import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './angularApp/app.module';
import { environment } from './environments/environment';
import { ErrorLogger } from './core/errorLogger'

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

ErrorLogger.SetUp();