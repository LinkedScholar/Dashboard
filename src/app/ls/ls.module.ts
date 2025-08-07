import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsComponent } from './ls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NbButtonModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { LsRoutingModule } from './ls-routing.module';
import { HeaderComponent } from './header/header.component';
import { SearcherModule } from './searcher/searcher.module';



@NgModule({
  declarations: [
    LsComponent,
    DashboardComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbUserModule,
    LsRoutingModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    SearcherModule,
    NbThemeModule,
    NbButtonModule
  ]
})
export class LsModule { }
