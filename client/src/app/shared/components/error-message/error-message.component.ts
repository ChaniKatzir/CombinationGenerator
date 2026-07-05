import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-message.component.html',  
  styleUrl: './error-message.component.css',
})
export class ErrorMessageComponent {
  readonly message = input<string | null>(null);
  readonly dismissible = input<boolean>(true);
  readonly dismiss = output<void>();
}