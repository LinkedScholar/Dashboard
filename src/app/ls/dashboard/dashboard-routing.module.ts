import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LandingNotFoundComponent } from '../../landing/landing-not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [
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
export class DashboardRoutingModule {
}

