import { Component } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Step } from '../../entities/configuration.entities';

@Component({
  selector: 'bpmnai-pipeline-configuration',
  templateUrl: './pipeline-configuration.component.html',
  styleUrls: ['./pipeline-configuration.component.scss']
})
export class PipelineConfigurationComponent {

  constructor(public _configurationService: ConfigurationService, private _formBuilder: FormBuilder) { }

  getInputTypeForDataType(dataType: string): string {
    switch (dataType.toLowerCase()) {
      case 'long':
        return 'number';
      default:
        return 'text';
    }
  }

  getValueForParameter(parameterName: string, stepId: string) {
    const step = this._configurationService.getStepForStepId(stepId);
    const params: string[] = Object.keys(step.parameters);
    for (const i in params) {
      if (params[i] === parameterName) {
        return Object.values(step.parameters)[i];
      }
    }
    return '';
  }

  isStepInPipeline(stepClass: string): boolean {
    if (this._configurationService.isConfigurationEmpty()) {
      return false;
    }
    for (const s of this._configurationService.getConfiguration().preprocessingConfiguration.pipelineStepConfiguration.steps) {
      if (s.className === stepClass) {
        return true;
      }
    }
    return false;
  }

  dropStep(event: CdkDragDrop<Step[]>) {
    if (event.container.id === 'pipelineSteps' && event.container.id === event.previousContainer.id) {
      moveItemInArray(this._configurationService.getConfiguration()
          .preprocessingConfiguration.pipelineStepConfiguration.steps, event.previousIndex, event.currentIndex);
      this._configurationService.recalculateStepDependencies();
      this._configurationService.postConfigToServer();
    } else if (event.container.id === 'pipelineSteps' && event.previousContainer.id === 'availableSteps') {
      this._configurationService.addStepToPipeline(event.previousIndex, event.currentIndex);
      this._configurationService.recalculateStepDependencies();
      this._configurationService.postConfigToServer();
    } else if (event.container.id === 'availableSteps' && event.previousContainer.id === 'pipelineSteps') {
      this._configurationService.removeStepFromPipeline(event.previousIndex);
      this._configurationService.recalculateStepDependencies();
      this._configurationService.postConfigToServer();
    }
  }

  parameterChange(event) {
    console.log(event);
    console.log(event.srcElement.id);
    const stepId = event.srcElement.id.split('::')[0];
    const parameter = event.srcElement.id.split('::')[1];
    this._configurationService.setParameterValue(stepId, parameter, event.srcElement.value);
    this._configurationService.postConfigToServer();
  }

}
