import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-action-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './action-toolbar.component.html',
  styleUrl: './action-toolbar.component.css',
})
export class ActionToolbarComponent {
  readonly canGetNext = input<boolean>(false);
  readonly canEnterBrowse = input<boolean>(false);
  readonly canReset = input<boolean>(false);

  readonly getNext = output<void>();
  readonly enterBrowse = output<void>();
  readonly reset = output<void>();
}