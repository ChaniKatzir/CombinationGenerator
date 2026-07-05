import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatLargeNumber } from '../../../../shared/utils/format-large-number';

import { ValidationUtils } from '../../../../shared/utils/validation.utils';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination-controls.component.html',
  styleUrl: './pagination-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControlsComponent {
  readonly currentPageNumber = input<string>('1');
  readonly totalPages = input<string | null>(null);
  readonly canGoToPreviousPage = input<boolean>(false);
  readonly canGoToNextPage = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 20, 50]);
  protected readonly formatLargeNumber = formatLargeNumber;

  readonly goToFirst = output<void>();
  readonly goToPrevious = output<void>();
  readonly goToNext = output<void>();
  readonly goToLast = output<void>();
  readonly goToPage = output<string>();
  readonly pageSizeChange = output<number>();

  readonly validationMessage = signal<string | null>(null);

  requestedPage: string | null = null;

  readonly isRequestedPageValid = computed(() => {
    const validation = ValidationUtils.validatePageNumber(
      this.requestedPage,
      this.totalPages(),
    );

    return validation.isValid;
  });

  goToRequestedPage(): void {
    const validation = ValidationUtils.validatePageNumber(
      this.requestedPage,
      this.totalPages(),
    );

    if (!validation.isValid) {
      this.validationMessage.set(validation.message);
      return;
    }

    const pageNumber = String(this.requestedPage).trim();

    this.validationMessage.set(null);
    this.goToPage.emit(pageNumber);
  }

  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    const validation = ValidationUtils.validatePageSize(value);

    if (!validation.isValid) {
      this.validationMessage.set(validation.message);
      return;
    }

    this.validationMessage.set(null);
    this.pageSizeChange.emit(value);
  }
}