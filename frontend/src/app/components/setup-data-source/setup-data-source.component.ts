import { Component, EventEmitter, OnDestroy, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from '../../service/configuration.service';
import { Subscription } from 'rxjs';
import { BpmnaiService } from 'src/app/service/bpmnai.service';

@Component({
   selector: 'bpmnai-setup-data-source',
   templateUrl: './setup-data-source.component.html',
   styleUrls: ['./setup-data-source.component.scss']
})
export class SetupDataSourceComponent implements OnInit, OnDestroy {

   public setupForm: FormGroup;

   private readonly kafkaBrokerPattern = '[a-zA-Z0-9-.]+:[0-9]{2,5}';

   datasource = 'kafka';

   _processingLevel = 'process';

   private _subscriptions: Subscription[] = [];

   private testedKafkaBrokerUrl = '';

   constructor(private _formBuilder: FormBuilder,
      private _bpmnaiService: BpmnaiService,
      public _configurationService: ConfigurationService) {
   }

   get f() { return this.setupForm.controls; }

   get processingLevel() {
      return this._configurationService.getConfiguration() != null ?
         this._configurationService.getConfiguration().preprocessingConfiguration.dataLevel : this._processingLevel;
   }

   @Input()
   set processingLevel(val: string) {
      if (this._configurationService.getConfiguration() != null) {
         this._configurationService.getConfiguration().preprocessingConfiguration.dataLevel = val;
      } else {
         this._processingLevel = val;
      }
   }

   isKafkaBrokerTestRunning() {
      return this._configurationService.kafkaBrokerTestResult === 99;
   }

   shouldCreateConfigurationButtonBeVisible() {
      return this._configurationService.isConfigurationEmpty()
            && this._configurationService.kafkaBrokerTestResult === 2
            && this.testedKafkaBrokerUrl === this._configurationService.kafkaBroker;
   }

   determineKafkaIconColor() {
      switch (this._configurationService.kafkaBrokerTestResult) {
         case -1:
            return 'red';
         case 1:
            return 'orange';
         case 2:
            return 'green';
         default:
            return 'white';
      }
   }

   testKafkaConfiguration(): void  {
      this._configurationService.kafkaBroker = this.setupForm.value.kafkaBroker;
      this.testedKafkaBrokerUrl = this.setupForm.value.kafkaBroker;
      this._subscriptions.push(this._configurationService.testKafkaBrokerConnection().subscribe());
   }

   triggerConfigurationGeneration(): void {
      this._subscriptions.push(this._bpmnaiService.runMinimalPipeline(this._processingLevel).subscribe());
   }

   ngOnInit() {
      this.setupForm = this._formBuilder.group({
         configLocation: [{value: '', disabled: true}, Validators.required],
         kafkaBroker: [{value: '', disabled: false}, [Validators.required, Validators.pattern(this.kafkaBrokerPattern)]]
      });
   }

   ngOnDestroy(): void {
      for (const sub of this._subscriptions) {
         sub.unsubscribe();
      }
   }

}
