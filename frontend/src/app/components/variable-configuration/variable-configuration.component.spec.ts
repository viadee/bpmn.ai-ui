import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableConfigurationComponent } from './variable-configuration.component';

describe('VariableConfigurationComponent', () => {
  let component: VariableConfigurationComponent;
  let fixture: ComponentFixture<VariableConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
