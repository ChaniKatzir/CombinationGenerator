import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formatLargeNumber } from '../../../../shared/utils/format-large-number';
import { BrowsePageResponse } from '../../models/responses';

@Component({
  selector: 'app-combinations-page-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combinations-page-view.component.html',
  styleUrl: './combinations-page-view.component.css',
})
export class CombinationsPageViewComponent {
  readonly page = input<BrowsePageResponse | null>(null);
  
  
  readonly formatLargeNumber = formatLargeNumber;
}