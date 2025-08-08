import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsComponent } from './ls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NbActionsModule, NbButtonModule, NbContextMenuModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { LsRoutingModule } from './ls-routing.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    LsComponent,
    DashboardComponent,
    HeaderComponent,
  ],

  imports: [
    CommonModule,

    LsRoutingModule,
    
    NbLayoutModule,
    NbUserModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    NbThemeModule,
    NbButtonModule,
    NbContextMenuModule,
    NbActionsModule
  ]
})
export class LsModule { }
