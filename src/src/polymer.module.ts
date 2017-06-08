import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';

import { EmitChangesDirective } from './events/index';
import { IronControlDirective } from './forms/index';
import { CustomStyleService, PolymerDomSharedStylesHost } from './style/index';
import { PolymerTemplateDirective } from './templates/index';

@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [
    EmitChangesDirective,
    IronControlDirective,
    PolymerTemplateDirective
  ],
  providers: [
    CustomStyleService
  ],
  exports: [
    EmitChangesDirective,
    FormsModule,
    IronControlDirective,
    PolymerTemplateDirective
  ]
})
export class PolymerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PolymerModule,
      providers: [
        { provide: DomSharedStylesHost, useClass: PolymerDomSharedStylesHost }
      ]
    };
  }
}
