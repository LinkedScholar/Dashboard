import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbSelectModule, NbTabsetModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { SearchResultComponent } from './search-result/search-result.component';
import { GraphResultComponent } from './search-result/graph-result/graph-result.component';
import { GraphListBridgeService } from './graph-list-bridge.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SearcherRoutingModule } from './searcher-routing.module';
import { SearcherComponent } from './searcher.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';
import { InstitutionProfileComponent } from './institution-profile/institution-profile.component';



@NgModule({
  declarations: [
    SearchResultComponent,
    GraphResultComponent,
    SearcherComponent,
    PersonProfileComponent,
    InstitutionProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    SearcherRoutingModule,


    NbIconModule,
    NbButtonModule,
    NbCardModule,
    NbThemeModule,
    NbSelectModule,
    NbFormFieldModule,
    NbListModule,
    NbInputModule,
    NbUserModule,
    NbAccordionModule,
    NbTabsetModule,

    SharedModule
    
  ],

  providers: [GraphListBridgeService],
})
export class SearcherModule { }
