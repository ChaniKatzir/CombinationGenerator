import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-start-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="start-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <label for="n">Enter n</label>

      <input
        id="n"
        type="text"
        inputmode="numeric"
        formControlName="n"
        placeholder="Number between 1 and 20"
      />

      @if (validationMessage()) {
        <p class="validation-error">{{ validationMessage() }}</p>
      }

      <button type="submit" [disabled]="isLoading()">
        Start
      </button>
    </form>
  `,
  styles: [`
    .start-form {
      display: grid;
      gap: 0.75rem;
      max-width: 24rem;
    }

    label {
      font-weight: 600;
    }

    input {
      padding: 0.65rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    button {
      width: fit-content;
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

    .validation-error {
      margin: 0;
      color: #842029;
      font-size: 0.9rem;
    }
  `],
})
export class StartFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly isLoading = input<boolean>(false);
  readonly startRequested = output<number>();

  readonly form = this.fb.group({
    n: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.min(1),
      Validators.max(20),
    ]),
  });

  validationMessage(): string | null {
    const control = this.form.controls.n;

    if (!control.invalid || !(control.dirty || control.touched)) {
      return null;
    }

    if (control.hasError('required')) {
      return 'Please enter a value for n.';
    }

    if (control.hasError('pattern')) {
      return 'n must be a whole number.';
    }

    if (control.hasError('min') || control.hasError('max')) {
      return 'n must be between 1 and 20.';
    }

    return 'Invalid value.';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.startRequested.emit(Number(this.form.controls.n.value));
  }
}