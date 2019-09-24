import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BpmnaiService } from 'src/app/service/bpmnai.service';

@Component({
  selector: 'bpmnai-data-processing',
  templateUrl: './data-processing.component.html',
  styleUrls: ['./data-processing.component.scss']
})
export class DataProcessingComponent implements OnInit, OnDestroy {

  dataProcessingForm: FormGroup;

  outputFormat = 'parquet';

  private _subscriptions: Subscription[] = [];

  constructor(public _configurationService: ConfigurationService,
    private _bpmnaiService: BpmnaiService,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dataProcessingForm = this._formBuilder.group({
      configLocation: [{ value: '', disabled: true }, Validators.required],
      sourceLocation: [{ value: '', disabled: true }, Validators.required],
      targetLocation: [{ value: '', disabled: true }, Validators.required],
    });
  }

  triggerPreProcessing() {
    this._subscriptions.push(this._bpmnaiService.runProcessing(this.outputFormat).subscribe());
  }

  ngOnDestroy(): void {
    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }
  }

  outputFormatChanged(value: string) {
    this.outputFormat = value;
  }
}
