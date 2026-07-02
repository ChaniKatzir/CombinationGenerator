import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

import { ActionToolbarComponent } from '../components/action-toolbar/action-toolbar.component';
import { CombinationsPageViewComponent } from '../components/combinations-page-view/combinations-page-view.component';
import { PaginationControlsComponent } from '../components/pagination-controls/pagination-controls.component';
import { SingleCombinationViewComponent } from '../components/single-combination-view/single-combination-view.component';
import { StartFormComponent } from '../components/start-form/start-form.component';

import { CombinationGeneratorFacade } from '../services/combination-generator.facade';

@Component({
  selector: 'app-combination-generator-page',
  standalone: true,
  imports: [
    ErrorMessageComponent,
    LoadingSpinnerComponent,
    StartFormComponent,
    ActionToolbarComponent,
    SingleCombinationViewComponent,
    CombinationsPageViewComponent,
    PaginationControlsComponent,
  ],
  providers: [CombinationGeneratorFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page">
      <header class="header">
        <h1>Combination Generator</h1>
        <p>Generate permutations from the server without pre-calculating them on the client.</p>
      </header>

      <app-error-message
        [message]="facade.errorMessage()"
        (dismiss)="facade.clearError()"
      />

      <app-loading-spinner [isLoading]="facade.isLoading()" />

      @if (facade.isStartMode()) {
        <app-start-form
          [isLoading]="facade.isLoading()"
          (startRequested)="facade.start($event)"
        />
      }

      @if (facade.isSingleMode()) {
        <section class="summary">
          <p><strong>n:</strong> {{ facade.n() }}</p>
          <p><strong>Total permutations:</strong> {{ facade.totalPermutations() }}</p>
        </section>

        <app-action-toolbar
          [canGetNext]="facade.canGetNext()"
          [canEnterBrowse]="facade.canEnterBrowse()"
          [canReset]="facade.canReset()"
          (getNext)="facade.getNext()"
          (enterBrowse)="facade.enterBrowse()"
          (reset)="facade.reset()"
        />

        <app-single-combination-view
          [combination]="facade.currentCombination()"
        />
      }

      @if (facade.isBrowseMode()) {
        <section class="summary">
          <p><strong>n:</strong> {{ facade.n() }}</p>
          <p><strong>Total permutations:</strong> {{ facade.totalPermutations() }}</p>
        </section>

        <app-combinations-page-view
          [page]="facade.browsePage()"
        />

        <app-pagination-controls
          [currentPageNumber]="facade.currentPageNumber()"
          [canGoToPreviousPage]="facade.canGoToPreviousPage()"
          [canGoToNextPage]="facade.canGoToNextPage()"
          [isLoading]="facade.isLoading()"
          [pageSize]="facade.pageSize()"
          (goToFirst)="facade.goToFirstPage()"
          (goToPrevious)="facade.goToPreviousPage()"
          (goToNext)="facade.goToNextPage()"
          (goToPage)="facade.loadBrowsePage($event)"
          (pageSizeChange)="facade.changePageSize($event)"
          (goToLast)="facade.goToLastPage()" 
        />

        <div class="browse-actions">
          <button
            type="button"
            [disabled]="!facade.canExitBrowse()"
            (click)="facade.exitBrowse()"
          >
            Back
          </button>

          <button
            type="button"
            [disabled]="!facade.canReset()"
            (click)="facade.reset()"
          >
            Reset
          </button>
        </div>
      }
    </main>
  `,
  styles: [`
    .page {
      display: grid;
      gap: 1.25rem;
      max-width: 60rem;
      margin: 0 auto;
      padding: 2rem;
      font-family: Arial, sans-serif;
    }

    .header {
      display: grid;
      gap: 0.35rem;
    }

    h1,
    p {
      margin: 0;
    }

    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 0.75rem;
      background: #fafafa;
    }

    .browse-actions {
      display: flex;
      gap: 0.75rem;
    }

    button {
      padding: 0.65rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `],
})
export class CombinationGeneratorPage {
  readonly facade = inject(CombinationGeneratorFacade);
}