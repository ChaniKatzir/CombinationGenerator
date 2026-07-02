import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div class="spinner-wrapper" aria-live="polite" aria-busy="true">
        <div class="spinner" aria-hidden="true"></div>
        <span>{{ label() }}</span>
      </div>
    }
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #555;
    }

    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 3px solid #ddd;
      border-top-color: #333;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `],
})
export class LoadingSpinnerComponent {
  readonly isLoading = input<boolean>(false);
  readonly label = input<string>('Loading...');
}