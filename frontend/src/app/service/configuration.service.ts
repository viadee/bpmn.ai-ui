import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Configuration, StepDefinition, ConfigurationFileLocation, KafkaTestReponse, Step } from '../entities/configuration.entities';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  private baseUrl = 'http://localhost:7000';
  private configUrl = this.baseUrl + '/config';
  private configFileLocationUrl = this.baseUrl + '/config/filelocation';
  private testKafkaBrokerUrl = this.baseUrl + '/testkafkaconn';
  private stepUrl = this.baseUrl + '/steps';

  private configuration: Configuration;
  private oldConfiguration: Configuration;
  private availableSteps: StepDefinition[];

  private configFetched = false;

  configLocation = '';
  sourceLocation = '';
  targetLocation = '';

  kafkaBroker = '';
  kafkaBrokerTestResult = 0;
  kafkaBrokerTestResultMessage = '';

  processingDone = false;

  constructor(private http: HttpClient) {
    this.getConfigFromServer();
    this.getAvailableStepsFromServer();
    this.getConfigurationFileLocationFromServer();
  }

  isConfigurationEmpty(): boolean {
    if (!this.configFetched) {
      return false;
    }

    if (!this.configuration
      || !this.configuration.preprocessingConfiguration) {
      return true;
    }

    if (this.configuration.preprocessingConfiguration.variableConfiguration.length > 0
      && this.configuration.preprocessingConfiguration.pipelineStepConfiguration !== null) {
      return false;
    }
    return true;
  }

  getConfiguration() {
    return this.configuration;
  }

  getAvailableSteps() {
    return this.availableSteps;
  }

  getStepForStepId(stepId: string): Step {
    const steps: Step[] = this.configuration.preprocessingConfiguration.pipelineStepConfiguration.steps;
    for (const step of steps) {
      if (step.id === stepId) {
        return step;
      }
    }
    return null;
  }

  /** GET configuration from the server */
  getConfigFromServer(): Observable<Configuration | any> {
    const obs: Observable<Configuration | any> = this.http.get<Configuration>(this.configUrl)
      .pipe(
        catchError(this.handleError('getConfigFromServer', []))
      );
    obs.subscribe(config => {
      this.configFetched = true;
      if (config.preprocessingConfiguration) {
        config.preprocessingConfiguration.variableConfiguration.sort((a, b) => a.variableName.localeCompare(b.variableName));
        this.configuration = config;
        this.oldConfiguration = this.cloneObject(this.configuration);
        this.addDefinitionsToSteps();
      }
    });
    return obs;
  }

  private cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
  }

  addDefinitionsToSteps(): void {
    if (this.availableSteps
      && this.availableSteps.length > 0
      && this.configuration
      && this.configuration.preprocessingConfiguration
      && this.configuration.preprocessingConfiguration.pipelineStepConfiguration.steps
      && this.configuration.preprocessingConfiguration.pipelineStepConfiguration.steps.length > 0) {
      const steps = this.configuration.preprocessingConfiguration.pipelineStepConfiguration.steps;
      for (const s of steps) {
        s.parameterCount = 0;
        if (s.parameters) {
          s.parameterCount = Object.keys(s.parameters).length;
        }
        for (const as of this.availableSteps) {
          if (as.className === s.className) {
            s.definition = as;
            break;
          }
        }
      }
    }
  }

  /** GET configuration file location from the server */
  getConfigurationFileLocationFromServer(): Observable<ConfigurationFileLocation | any> {
    const obs = this.http.get<ConfigurationFileLocation | any>(this.configFileLocationUrl)
      .pipe(
        catchError(this.handleError('getConfigurationFileLocationFromServer', []))
      );
    obs.subscribe(locations => {
      this.configLocation = locations.configLocation;
      this.sourceLocation = locations.sourceLocation;
      this.targetLocation = locations.targetLocation;
    });
    return obs;
  }

  /** POST configuration to the server */
  postConfigToServer(): Observable<Configuration | any> {
    const obs = this.http.post<Configuration | any>(this.configUrl, this.configuration)
      .pipe(
        catchError(this.handleError('postConfigToServer', []))
      );
    obs.subscribe(config => {
      if (config.length === 0) {
        // this.statusbarService.setMessage('Error while saving configuration. Please try again.');
        this.configuration = this.cloneObject(this.oldConfiguration);
      } else {
        // this.statusbarService.setMessage('Configuration saved succesfully');
      }
      this.addDefinitionsToSteps();
    });
    return obs;
  }

  /** GET available steps from the server */
  getAvailableStepsFromServer(): Observable<StepDefinition[]> {
    const obs = this.http.get<StepDefinition[]>(this.stepUrl)
      .pipe(
        catchError(this.handleError('getAvailableStepsFromServer', []))
      );
    obs.subscribe(steps => {
      steps.sort((a, b) => a.name.localeCompare(b.name));
      this.availableSteps = steps;
      this.addDefinitionsToSteps();
    });
    return obs;
  }

  testKafkaBrokerConnection() {
    this.kafkaBrokerTestResult = 99;
    const obs = this.http.post<KafkaTestReponse>(this.testKafkaBrokerUrl, this.kafkaBroker)
      .pipe(
        catchError(this.handleError('testKafkaBrokerConnection', []))
      );
    obs.subscribe(response => {
      if ((<KafkaTestReponse>response).resultCode === 204) {
        this.kafkaBrokerTestResult = 1;
        this.kafkaBrokerTestResultMessage = (<KafkaTestReponse>response).message;
      } else if ((<KafkaTestReponse>response).resultCode === 200) {
        this.kafkaBrokerTestResult = 2;
        this.kafkaBrokerTestResultMessage = 'Connection to Kafka broker was successful!';
      } else {
        this.kafkaBrokerTestResult = -1;
        this.kafkaBrokerTestResultMessage = (<KafkaTestReponse>response).message;
      }
    });
    return obs;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public recalculateStepDependencies(): void {
    const steps: Step[] = this.configuration.preprocessingConfiguration.pipelineStepConfiguration.steps;
    let counter = 1;
    let lastStep;
    for (const step of steps) {
      if (counter === 1) {
        step.dependsOn = '';
      } else {
        step.dependsOn = lastStep.id;
      }
      counter++;
      lastStep = step;
    }
  }

  public setParameterValue(stepId: string, parameter: string, value: string) {
    const steps: Step[] = this.configuration.preprocessingConfiguration.pipelineStepConfiguration.steps;
    for (const step of steps) {
      if (step.id === stepId) {
        if (value === '') {
          step.parameters[parameter] = null;
        } else {
          step.parameters[parameter] = value;
        }
      }
    }
  }

  public addStepToPipeline(availableStepsIndex, pipelineStepsIndex) {
    const availableSteps: StepDefinition[] = this.getAvailableSteps();
    const newStepDefinition: StepDefinition = availableSteps[availableStepsIndex];
    const newStep: Step = new Step();
    newStep.active = true;
    newStep.className = newStepDefinition.className;
    newStep.id = newStepDefinition.id;
    newStep.definition = newStepDefinition;
    newStep.parameters = {};
    this.configuration.preprocessingConfiguration
        .pipelineStepConfiguration.steps.splice(pipelineStepsIndex, 0, newStep);
    this.unifyStepIds();
  }

  public unifyStepIds() {
    const steps: Step[] = this.configuration.preprocessingConfiguration.pipelineStepConfiguration.steps;
    let i = 1;
    for (const step of steps) {
      step.id = step.className.split('.')[step.className.split('.').length - 1] + '_' + i++;
    }
  }

  public removeStepFromPipeline(pipelineStepsIndex) {
    this.configuration.preprocessingConfiguration
        .pipelineStepConfiguration.steps.splice(pipelineStepsIndex, 1);
  }

  /** Log a ConfigurationService message with the MessageService */
  private log(message: string) {
    console.log(`ConfigurationService: ${message}`);
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
