import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <section class="error" role="alert">
        <span>{{ message() }}</span>

        @if (dismissible()) {
          <button type="button" (click)="dismiss.emit()">×</button>
        }
      </section>
    }
  `,
  styles: [`
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid #f1b0b7;
      border-radius: 0.5rem;
      background: #fff5f5;
      color: #842029;
    }

    button {
      border: none;
      background: transparent;
      font-size: 1.25rem;
      cursor: pointer;
      color: inherit;
    }
  `],
})
export class ErrorMessageComponent {
  readonly message = input<string | null>(null);
  readonly dismissible = input<boolean>(true);

  readonly dismiss = output<void>();
}