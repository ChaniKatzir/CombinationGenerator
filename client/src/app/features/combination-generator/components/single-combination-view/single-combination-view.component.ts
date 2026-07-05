import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatLargeNumber } from '../../../../shared/utils/format-large-number';
import { CurrentCombination } from '../../models/combination.models';

@Component({
  selector: 'app-single-combination-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './single-combination-view.component.html',
  styleUrl: './single-combination-view.component.css',
})
export class SingleCombinationViewComponent {
  readonly combination = input<CurrentCombination | null>(null);
  protected readonly formatLargeNumber = formatLargeNumber;
  readonly formattedValues = computed(() => {
    const values = this.combination()?.values ?? [];
    return `[${values.join(', ')}]`;
  });
}