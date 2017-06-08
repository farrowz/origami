import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  AppElementsModule,
  IronElementsModule,
  PaperElementsModule,
  PolymerModule
} from '@codebakery/origami';

import { AppComponent } from './app.component';
import { FeaturesComponent } from './features/features.component';

@NgModule({
  imports: [
    AppElementsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    IronElementsModule,
    PaperElementsModule,
    PolymerModule.forRoot()
  ],
  declarations: [
    AppComponent,
    FeaturesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
