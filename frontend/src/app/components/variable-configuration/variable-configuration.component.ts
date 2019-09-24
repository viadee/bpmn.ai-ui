import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { FormBuilder } from '@angular/forms';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Configuration, VariableConfiguration } from '../../entities/configuration.entities';
import { MatSelectionListChange } from '@angular/material/list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bpmnai-variable-configuration',
  templateUrl: './variable-configuration.component.html',
  styleUrls: ['./variable-configuration.component.scss']
})
export class VariableConfigurationComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];

  configuration: Configuration;

  userSearch = '';
  showNotUsedVariables = true;
  outputFormat = 'parquet';

  constructor(public _configurationService: ConfigurationService, private _formBuilder: FormBuilder) { }

  onUseVariableChange(ob: MatSlideToggleChange) {
    const matSlideToggle: MatSlideToggle = ob.source;
    const variableName = matSlideToggle.name;
    const vars: VariableConfiguration[] = this._configurationService.getConfiguration().preprocessingConfiguration.variableConfiguration;
    for (const v of vars) {
      if (v.variableName === variableName) {
        v.useVariable = matSlideToggle.checked;
        break;
      }
    }
    this.subscriptions.push(this._configurationService.postConfigToServer().subscribe());
  }

  onVariableTypeChange(ob: MatSelectionListChange) {
    this.subscriptions.push(this._configurationService.postConfigToServer().subscribe());
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
