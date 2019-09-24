import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from './service/websocket.service';
import { StatusbarComponent } from './components/statusbar/statusbar.component';

@Component({
   selector: 'bpmnai-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
   title = 'bpmn.ai';

   @ViewChild(StatusbarComponent) statusbarComponent: StatusbarComponent;

   constructor(private wsService: WebsocketService) {
   }

   ngOnInit(): void {
      this.wsService.connect();
   }
}
