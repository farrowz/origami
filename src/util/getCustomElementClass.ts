import { ElementRef } from '@angular/core';

import { customElements } from './customElements';
import { getTagName } from './getTagName';

export function getCustomElementClass(elementRef: ElementRef): Function {
  if (elementRef && elementRef.nativeElement) {
    const htmlElement = Object.getPrototypeOf(elementRef.nativeElement);
    if (htmlElement && htmlElement.is) {
      return customElements.get(htmlElement.is);
    } else {
      console.warn(`${getTagName(elementRef)} is not registered`);
    }
  }
}