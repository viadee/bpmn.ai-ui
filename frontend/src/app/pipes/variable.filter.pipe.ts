import { Pipe, PipeTransform } from '@angular/core';

import { VariableConfiguration } from '../entities/configuration.entities';

@Pipe({ name: 'filterByInput' })
export class VariableFilterPipe implements PipeTransform {
  transform(variables: VariableConfiguration[], input: string, showNotUsedVariables: boolean) {
    return variables.filter(variable => {
      let result = variable.variableName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      if (!showNotUsedVariables) {
        result = result && variable.useVariable;
      }
      return result;
    });
  }
}
