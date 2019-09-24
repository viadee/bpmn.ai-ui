import { Component, OnInit, Output } from '@angular/core';
import { ConfigurationService } from 'src/app/service/configuration.service';

@Component({
  selector: 'bpmnai-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.scss']
})
export class SetupPageComponent implements OnInit {

  constructor(private _configurationService: ConfigurationService) { }

  ngOnInit() {
  }

  @Output()
  get step1Ready() {
      return this._configurationService.getConfiguration() != null;
  }

  @Output()
  get step2Ready() {
      return this._configurationService.processingDone;
  }
}
