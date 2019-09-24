import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from '../../service/configuration.service';

@Component({
  selector: 'bpmnai-parameter-configuration',
  templateUrl: './parameter-configuration.component.html',
  styleUrls: ['./parameter-configuration.component.scss']
})
export class ParameterConfigurationComponent implements OnInit, OnDestroy {

  dataProcessingForm: FormGroup;

  outputDataSubscription$;

  @Output() outputFormatChanged = new EventEmitter<string>();

  constructor(private _formBuilder: FormBuilder, public _configurationService: ConfigurationService) { }

  ngOnInit() {
    this.dataProcessingForm = this._formBuilder.group({
      configLocation: [{ value: '', disabled: true }, Validators.required],
      sourceLocation: [{ value: '', disabled: true }, Validators.required],
      targetLocation: [{ value: '', disabled: true }, Validators.required],
      outputFormat: ['parquet', Validators.required],
    });

    this.outputDataSubscription$ = this.dataProcessingForm.valueChanges.subscribe((values: any) => {
      this.outputFormatChanged.emit(values.outputFormat);
    });
  }

  ngOnDestroy(): void {
    this.outputDataSubscription$.unsubscribe();
  }

}
