import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formatLargeNumber } from '../../../../shared/utils/format-large-number';
import { BrowsePageResponse } from '../../models/responses';

@Component({
  selector: 'app-combinations-page-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (page(); as currentPage) {
      <section class="page-card">
        <header>
          <h2>Browse combinations</h2>
          <p>
            Page {{ currentPage.pageNumber }},
            page size {{ currentPage.pageSize }}
          </p>
        </header>

        @if (currentPage.items.length > 0) {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Combination</th>
                </tr>
              </thead>

              <tbody>
                @for (item of currentPage.items; track item.index) {
                  <tr>
                    <td>{{ formatLargeNumber(item.index) }}</td>
                    <td>[{{ item.values.join(', ') }}]</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p>No combinations to display.</p>
        }

        @if (!currentPage.hasMore) {
          <p class="message">No more combinations to display.</p>
        }
      </section>
    }
  `,
  styles: [`
    .page-card {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.75rem;
      background: #fff;
    }

    header {
      display: grid;
      gap: 0.25rem;
    }

    h2,
    p {
      margin: 0;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 0.6rem;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    th {
      font-weight: 700;
      background: #f7f7f7;
    }

    td:last-child {
      font-family: monospace;
    }

    .message {
      color: #555;
    }
  `],
})
export class CombinationsPageViewComponent {
  readonly page = input<BrowsePageResponse | null>(null);
  
  
  readonly formatLargeNumber = formatLargeNumber;
}