import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingNotFoundComponent } from '../../landing/landing-not-found/not-found.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearcherComponent } from './searcher.component';

const routes: Routes = [{
  path: '',
  component: SearcherComponent,
  children: [
    {
      path: '',
      component: SearchResultComponent,
    },
    {
      path: '**',
      component: LandingNotFoundComponent,
    },
  ]},
  
  
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SearcherRoutingModule {
}

