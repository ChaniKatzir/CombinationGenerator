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
  templateUrl: './combination-generator.page.html',
  styleUrl: './combination-generator.page.css',
})
export class CombinationGeneratorPage {
  readonly facade = inject(CombinationGeneratorFacade);
}