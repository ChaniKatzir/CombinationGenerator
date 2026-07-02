import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-action-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toolbar">
      <button type="button" [disabled]="!canGetNext()" (click)="getNext.emit()">
        Next
      </button>

      <button type="button" [disabled]="!canEnterBrowse()" (click)="enterBrowse.emit()">
        Browse combinations
      </button>

      <button type="button" [disabled]="!canReset()" (click)="reset.emit()">
        Reset
      </button>
    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    button {
      padding: 0.65rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `],
})
export class ActionToolbarComponent {
  readonly canGetNext = input<boolean>(false);
  readonly canEnterBrowse = input<boolean>(false);
  readonly canReset = input<boolean>(false);

  readonly getNext = output<void>();
  readonly enterBrowse = output<void>();
  readonly reset = output<void>();
}