import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatStepperModule,
  MatGridListModule,
  MatExpansionModule,
  MatInputModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatSnackBarModule,
  MatButtonToggleModule,
  MatProgressBarModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    DragDropModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    DragDropModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class MaterialModule { }
