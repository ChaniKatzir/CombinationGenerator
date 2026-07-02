import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="pagination" aria-label="Pagination">
      <button type="button" [disabled]="!canGoToPreviousPage()" (click)="goToFirst.emit()">
        First
      </button>

      <button type="button" [disabled]="!canGoToPreviousPage()" (click)="goToPrevious.emit()">
        Previous
      </button>

      <span>Current page: {{ currentPageNumber() }}</span>

      <label>
        Go to page
        <input
          type="number"
          min="0"
          [disabled]="isLoading()"
          [(ngModel)]="requestedPage"
        />
      </label>

      <button
        type="button"
        [disabled]="isLoading() || requestedPage === null"
        (click)="goToRequestedPage()"
      >
        Go
      </button>

      <button type="button" [disabled]="!canGoToNextPage()" (click)="goToNext.emit()">
        Next
      </button>

      <button type="button" [disabled]="isLoading()" (click)="goToLast.emit()">
        Last
      </button>

      <label>
        Page size
        <select
          [value]="pageSize()"
          [disabled]="isLoading()"
          (change)="onPageSizeChange($event)"
        >
          @for (size of pageSizeOptions(); track size) {
            <option [value]="size">{{ size }}</option>
          }
        </select>
      </label>
    </nav>
  `,
  styles: [`
    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    button,
    input,
    select {
      padding: 0.5rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      background: #fff;
    }

    button {
      cursor: pointer;
    }

    button:disabled,
    input:disabled,
    select:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    input {
      width: 8rem;
    }
  `],
})
export class PaginationControlsComponent {
  readonly currentPageNumber = input<number>(0);
  readonly canGoToPreviousPage = input<boolean>(false);
  readonly canGoToNextPage = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 20, 50]);

  readonly goToFirst = output<void>();
  readonly goToPrevious = output<void>();
  readonly goToNext = output<void>();
  readonly goToLast = output<void>();
  readonly goToPage = output<number>();
  readonly pageSizeChange = output<number>();

  requestedPage: number | null = null;

  goToRequestedPage(): void {
    const pageNumber = Number(this.requestedPage);

    if (!Number.isInteger(pageNumber) || pageNumber < 0) {
      return;
    }

    this.goToPage.emit(pageNumber);
  }

  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }
}