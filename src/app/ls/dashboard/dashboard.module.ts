import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbSelectModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    DashboardComponent,
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

    SharedModule
  ],

  providers: [
  ]
})
export class DashboardModule { }
