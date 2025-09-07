import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbTabsetModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { SearchResultComponent } from './search-result/search-result.component';
import { ForceGraphComponent } from './search-result/graph-result/graph-result.component';
import { GraphListBridgeService } from './graph-list-bridge.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SearcherRoutingModule } from './searcher-routing.module';
import { SearcherComponent } from './searcher.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';
import { InstitutionProfileComponent } from './institution-profile/institution-profile.component';
import { UserPlaceHolderComponent } from './user-place-holder/user-place-holder.component';
import { PagingFooterComponent } from './paging-footer/paging-footer.component';
import { AuthorListComponent } from './search-result/author-list/author-list.component';



@NgModule({
  declarations: [
    SearchResultComponent,
    ForceGraphComponent,
    SearcherComponent,
    PersonProfileComponent,
    InstitutionProfileComponent,
    UserPlaceHolderComponent,
    PagingFooterComponent,
    AuthorListComponent
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
    NbLayoutModule,

    SharedModule
    
  ],

  providers: [GraphListBridgeService],
})
export class SearcherModule { }
