import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/index';

@Directive({
  selector: `marked-element, prism-element`
})
export class MoleculeElement extends EmitChangesDirective { }
