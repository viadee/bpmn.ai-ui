import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDataSourceComponent } from './setup-data-source.component';

describe('SetupDataSourceComponent', () => {
  let component: SetupDataSourceComponent;
  let fixture: ComponentFixture<SetupDataSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDataSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
