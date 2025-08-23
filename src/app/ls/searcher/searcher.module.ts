import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbSelectModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { SearchResultComponent } from './search-result/search-result.component';
import { GraphResultComponent } from './search-result/graph-result/graph-result.component';
import { GraphListBridgeService } from './graph-list-bridge.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SearcherRoutingModule } from './searcher-routing.module';
import { SearcherComponent } from './searcher.component';



@NgModule({
  declarations: [
    SearchResultComponent,
    GraphResultComponent,
    SearcherComponent
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

    SharedModule
    
  ],

  providers: [GraphListBridgeService],
})
export class SearcherModule { }
