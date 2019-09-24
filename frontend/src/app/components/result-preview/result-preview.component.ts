import { Component, OnInit } from '@angular/core';
import { BpmnaiService } from 'src/app/service/bpmnai.service';

@Component({
  selector: 'bpmnai-result-preview',
  templateUrl: './result-preview.component.html',
  styleUrls: ['./result-preview.component.scss']
})
export class ResultPreviewComponent implements OnInit {

  constructor(public _bpmnaiService: BpmnaiService) { }

  ngOnInit() {
  }

}
