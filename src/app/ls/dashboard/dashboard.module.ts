import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbPopoverModule, NbProgressBarModule, NbSelectModule } from '@nebular/theme';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsComponent } from './projects/projects.component';
import { MatchedFundingsComponent } from './matched-fundings/matched-fundings.component';
import { SearcherPageModule } from '../searcher-page/searcher-page.module';



@NgModule({
  declarations: [
    DashboardComponent,
    ProjectsComponent,
    MatchedFundingsComponent,
  ],
  imports: [
    CommonModule,
    SearcherPageModule,

    DashboardRoutingModule,

    NbCardModule,
    NbFormFieldModule,
    NbInputModule,
    NbIconModule,
    NbSelectModule,
    NbListModule,
    NbButtonModule,
    NbPopoverModule,
    NbAccordionModule,
    NbProgressBarModule,
    NbDialogModule.forChild(),


    SharedModule,
  ],

  providers: [
  ]
})
export class DashboardModule { }
