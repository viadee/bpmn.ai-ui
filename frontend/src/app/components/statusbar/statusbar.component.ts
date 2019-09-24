import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { BpmnaiService } from 'src/app/service/bpmnai.service';

@Component({
   selector: 'bpmnai-statusbar',
   templateUrl: './statusbar.component.html',
   styleUrls: ['./statusbar.component.scss'],
   animations: [
      trigger('showHideAnim', [
         state('hide', style({
            bottom: '-100%'
         })),
         state('show', style({
            bottom: '0'
         })),
         transition('show=>hide', animate('1000ms')),
         transition('hide=>show', animate('1500ms'))
      ])
   ]
})

export class StatusbarComponent implements OnInit, OnDestroy {
   private subscriptions: Subscription[] = [];

   message = '';
   currentState = 'show';
   wsConnectionStatus = false;
   jobRunning = false;

   constructor(private _bpmnaiService: BpmnaiService) {
   }

   ngOnDestroy(): void {
      // this.statusbarService.unregisterUI();
      for (const sub of this.subscriptions) {
         sub.unsubscribe();
      }
   }

   ngOnInit(): void {
      // this.statusbarService.registerUI(this);
      this._bpmnaiService.jobStatusReceived$.subscribe(
         jobStatus => {
           this.setMessage(jobStatus.message);
           this.jobRunning = jobStatus.running;
         });

      this._bpmnaiService.wsConnectionStatusReceived$.subscribe(
            connectionStatus => {
              this.wsConnectionStatus = connectionStatus;
            });
   }

   setMessage(msg: string) {
      this.changeState('show');
      this.message = msg;
   }

   changeState(s: string) {
      this.currentState = s;
   }

   cancelJob() {
      this.subscriptions.push(this._bpmnaiService.cancelJob().subscribe());
   }
}
