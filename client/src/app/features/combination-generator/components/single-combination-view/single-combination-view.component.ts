import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CurrentCombination } from '../../models/combination.models';

@Component({
  selector: 'app-single-combination-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (combination(); as item) {
      <section class="card">
        <h2>Combination number {{ item.index }}</h2>
        <p class="values">{{ formattedValues() }}</p>

        @if (!item.hasMore) {
          <p class="message">No more combinations.</p>
        }
      </section>
    } @else {
      <section class="empty">
        <p>Click Next to display the first combination.</p>
      </section>
    }
  `,
  styles: [`
    .card,
    .empty {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.75rem;
      background: #fff;
    }

    h2 {
      margin: 0 0 0.75rem;
      font-size: 1.1rem;
    }

    .values {
      margin: 0;
      font-family: monospace;
      font-size: 1.1rem;
    }

    .message {
      margin: 0.75rem 0 0;
      color: #555;
    }
  `],
})
export class SingleCombinationViewComponent {
  readonly combination = input<CurrentCombination | null>(null);

  readonly formattedValues = computed(() => {
    const values = this.combination()?.values ?? [];
    return `[${values.join(', ')}]`;
  });
}