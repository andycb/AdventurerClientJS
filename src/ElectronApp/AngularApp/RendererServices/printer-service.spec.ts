import { TestBed } from '@angular/core/testing';

import { PrinterServiceService } from './printer.service';

describe('PrinterServiceService', () => {
  let service: PrinterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrinterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
