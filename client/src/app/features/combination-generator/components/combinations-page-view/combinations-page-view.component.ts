import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BrowsePageResponse } from '../../models/responses';
import { formatLargeNumber } from '../../../../shared/utils/format-large-number';

@Component({
  selector: 'app-combinations-page-view',
  standalone: true,
  templateUrl: './combinations-page-view.component.html',
  styleUrl: './combinations-page-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombinationsPageViewComponent {
  readonly page = input<BrowsePageResponse | null>(null);

  protected readonly formatLargeNumber = formatLargeNumber;
}