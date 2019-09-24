import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VariableFilterPipe } from './pipes/variable.filter.pipe';
import { WebsocketService } from './service/websocket.service';
import { VariableConfigurationComponent } from './components/variable-configuration/variable-configuration.component';
import { PipelineConfigurationComponent } from './components/pipeline-configuration/pipeline-configuration.component';
import { StatusbarComponent } from './components/statusbar/statusbar.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faLink, faPlug, faStopCircle, faUnlink } from '@fortawesome/free-solid-svg-icons';
import { ResultPreviewComponent } from './components/result-preview/result-preview.component';
import { SetupPageComponent } from './pages/setup-page/setup-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SetupDataSourceComponent } from './components/setup-data-source/setup-data-source.component';
import { DataProcessingComponent } from './components/data-processing/data-processing.component';
import { ParameterConfigurationComponent } from './components/parameter-configuration/parameter-configuration.component';
import { BpmnaiService } from './service/bpmnai.service';
import { ConfigurationService } from './service/configuration.service';


// Add an icon to the library for convenient access in other components
library.add(faCircle);
library.add(faStopCircle);
library.add(faPlug);
library.add(faLink);
library.add(faUnlink);

@NgModule({
  declarations: [
    AppComponent,
    VariableConfigurationComponent,
    PipelineConfigurationComponent,
    StatusbarComponent,
    VariableFilterPipe,
    ResultPreviewComponent,
    SetupPageComponent,
    NotFoundPageComponent,
    SetupDataSourceComponent,
    DataProcessingComponent,
    ParameterConfigurationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [
    WebsocketService,
    ConfigurationService,
    BpmnaiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
