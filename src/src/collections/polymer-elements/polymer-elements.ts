import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/index';

@Directive({
  selector: `array-selector, custom-style, dom-bind, dom-if, dom-module, dom-repeat`
})
export class PolymerElement extends EmitChangesDirective { }
