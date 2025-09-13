import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbSelectModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsComponent } from './projects/projects.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProjectsComponent,
  ],
  imports: [
    CommonModule,

    DashboardRoutingModule,

    NbCardModule,
    NbFormFieldModule,
    NbInputModule,
    NbIconModule,
    FormsModule,
    NbSelectModule,
    NbListModule,
    ReactiveFormsModule,

    SharedModule
  ],

  providers: [
  ]
})
export class DashboardModule { }
