import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable, of } from 'rxjs';
import { JobStatus, WebSocketMessage, ResultPreviewData } from '../entities/configuration.entities';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BpmnaiService {

  private baseUrl = 'http://localhost:7000';

  private getResultPreviewUrl = this.baseUrl + '/previewdata';
  private cancelUrl = this.baseUrl + '/cancel';
  private minimalPipelineUrl = this.baseUrl + '/runminimalpipeline';
  private runProcessingUrl = this.baseUrl + '/runprocessing';

  private resultPreviewData: ResultPreviewData = new ResultPreviewData();

  // Observable string sources
  private jobStatusReceivedSource = new Subject<JobStatus>();
  private wsConnectionStatusSource = new Subject<boolean>();

  // Observable string streams
  jobStatusReceived$ = this.jobStatusReceivedSource.asObservable();
  wsConnectionStatusReceived$ = this.wsConnectionStatusSource.asObservable();

  jobStatus = new JobStatus();
  private subscriptions: Subscription[] = [];
  processingLevel = '';

  constructor(private _configurationService: ConfigurationService,
        private httpClient: HttpClient) { }

  // Service message commands
  shareJobStatus(jobStatus: JobStatus) {
    this.jobStatusReceivedSource.next(jobStatus);
  }

  shareWsConnectionStatus(wsConnectionStatus: boolean) {
    this.wsConnectionStatusSource.next(wsConnectionStatus);
  }

  handleMessage(msg: string) {
    const wsm: WebSocketMessage = JSON.parse(msg);

    this.jobStatus.running = wsm.jobRunning;

    if (wsm.handleMessage) {
      this.jobStatus.message = wsm.message;
    }

    if (wsm.jobFinished) {
      if (wsm.jobResultOK) {
        switch (wsm.jobName) {
          case 'configGeneration':
            this.subscriptions.push(this._configurationService.getConfigFromServer().subscribe(config => {
              if (config.preprocessingConfiguration) {
                this.subscriptions.push(this._configurationService.getConfigurationFileLocationFromServer().subscribe());
                this.jobStatus.finished = true;
              }
            }));
            break;
          case 'runningProcessing':
            this._configurationService.processingDone = true;
            this.getResultPreviewFromServer();
            break;
          default:
            break;
        }
      }
    }

    this.shareJobStatus(this.jobStatus);
  }

  cancelJob(): Observable<any> {
    this.jobStatus.running = false;
    return this.httpClient.post(this.cancelUrl, '')
      .pipe(
        catchError(this.handleError('cancelJob', []))
      );
  }

  runMinimalPipeline(processingLevel: string): Observable<any>  {
    this.jobStatus.running = true;
    this.processingLevel = processingLevel;
    const payload = {
      'dataLevel': processingLevel,
      'kafkaBroker' : this._configurationService.kafkaBroker
    };
    return this.httpClient.post(this.minimalPipelineUrl, payload)
      .pipe(
        catchError(this.handleError('runMinimalPipeline', []))
      );
  }

  runProcessing(outputFormat: string, csvDelimiter: string): Observable<any>  {
    this.jobStatus.running = true;
    const payload = {
      'dataLevel': this._configurationService.getConfiguration().preprocessingConfiguration.dataLevel,
      'outputFormat': outputFormat,
      'csvDelimiter': csvDelimiter
    };
    return this.httpClient.post(this.runProcessingUrl, payload)
      .pipe(
        catchError(this.handleError('runProcessing', []))
      );
  }

  getResultPreviewData(): ResultPreviewData {
    return this.resultPreviewData;
  }
  getResultPreviewFromServer(): Observable<ResultPreviewData | any>  {
    const obs = this.httpClient.get(this.getResultPreviewUrl)
      .pipe(
        catchError(this.handleError('getResultPreview', []))
      );
    obs.subscribe(response => {
      this.resultPreviewData = <ResultPreviewData>response;
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

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a BpmnaiService message with the MessageService */
  private log(message: string) {
    console.log(`BpmnaiService: ${message}`);
  }
}
