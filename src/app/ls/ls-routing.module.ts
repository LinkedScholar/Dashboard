import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LsComponent } from './ls.component';
import { LandingNotFoundComponent } from '../landing/landing-not-found/not-found.component';
const routes: Routes = [{
  path: '',
  component: LsComponent,
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module')
        .then(m => m.DashboardModule)
    },
    {
      path: 'search',
      loadChildren: () => import('./searcher/searcher.module')
        .then(m => m.SearcherModule)
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
export class LsRoutingModule {
}

