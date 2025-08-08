import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingNotFoundComponent } from '../../landing/landing-not-found/not-found.component';
import { ReportGeneratorComponent } from './report-generator.component';
import { RpDashboardComponent } from './rp-dashboard/rp-dashboard.component';

const routes: Routes = [{
  path: '',
  component: ReportGeneratorComponent,
  children: [
    {
      path: '',
      component: RpDashboardComponent,
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
export class ReportGeneratorRoutingModule {
}

