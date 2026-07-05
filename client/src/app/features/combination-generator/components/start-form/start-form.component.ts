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
  templateUrl: './start-form.component.html',
  styleUrl: './start-form.component.css',
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