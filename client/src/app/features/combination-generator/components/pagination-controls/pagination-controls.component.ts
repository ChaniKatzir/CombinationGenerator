import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';


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
  readonly canGoToPreviousPage = input<boolean>(false);
  readonly canGoToNextPage = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 20, 50]);

  readonly goToFirst = output<void>();
  readonly goToPrevious = output<void>();
  readonly goToNext = output<void>();
  readonly goToLast = output<void>();
  readonly goToPage = output<string>();
  readonly pageSizeChange = output<number>();

  requestedPage: string = '';

  goToRequestedPage(): void {
    const value = this.requestedPage.trim();

    if (!/^[1-9]\d*$/.test(value)) {
      return;
    }

    this.goToPage.emit(value);
  }
  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }
}