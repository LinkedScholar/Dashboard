import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportGeneratorComponent } from './report-generator.component';
import { ReportGeneratorRoutingModule } from './report-generator-routing.module';
import { RpDashboardComponent } from './rp-dashboard/rp-dashboard.component';
import { NbLayoutModule } from '@nebular/theme';



@NgModule({
  declarations: [
    ReportGeneratorComponent,
    RpDashboardComponent
  ],
  imports: [
    CommonModule,
    ReportGeneratorRoutingModule,
    NbLayoutModule,
  ]
})
export class ReportGeneratorModule { }
