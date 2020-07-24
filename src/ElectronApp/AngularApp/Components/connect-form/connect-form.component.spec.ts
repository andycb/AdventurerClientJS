import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectFormComponent } from './connect-form.component';

describe('ConnectFormComponent', () => {
  let component: ConnectFormComponent;
  let fixture: ComponentFixture<ConnectFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
