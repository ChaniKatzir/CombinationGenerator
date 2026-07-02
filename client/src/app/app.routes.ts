import { Routes } from '@angular/router';

import { CombinationGeneratorPage } from './features/combination-generator/pages/combination-generator.page';

export const routes: Routes = [
  {
    path: '',
    component: CombinationGeneratorPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];