import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProcessingComponent } from './data-processing.component';

describe('DataProcessingComponent', () => {
  let component: DataProcessingComponent;
  let fixture: ComponentFixture<DataProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
