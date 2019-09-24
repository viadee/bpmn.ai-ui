import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineConfigurationComponent } from './pipeline-configuration.component';

describe('PipelineConfigurationComponent', () => {
  let component: PipelineConfigurationComponent;
  let fixture: ComponentFixture<PipelineConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
