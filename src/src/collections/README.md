# Collection Libraries

Origami aims to work out of the box with all Polymer-based elements.

However, third party libraries can provide selectors to reduce the markup complexity. Origami ships with built-in selectors for all of Polymer's core collections.

## Import

All collection libraries are optional, and they may actually reduce an application's bundle size by removing extra markup. Import them alongside `PolymerModule`.

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PolymerModule } from '@codebakery/origami';
import { PaperElementsModule } from '@codebakery/origami/lib/collections';

@NgModule({
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    PolymerModule.forRoot(),
    PaperElementsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Before:
```html
<paper-input label="Enter Value" ironControl polymer [(ngModel)]="value"></paper-input>
<paper-button polymer [(disabled)]="isDisabled">Submit</paper-button>
```

After:
```html
<paper-input label="Enter Value" [(ngModel)]="value"></paper-input>
<paper-button [(disabled)]="isDisabled">Submit</paper-button>
```
