import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/index';

@Directive({
  selector: `paper-ripple`
})
export class PaperElement extends EmitChangesDirective { }
