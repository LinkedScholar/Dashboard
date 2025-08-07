import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearcherComponent } from './searcher.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearcherRoutingModule } from './searcher-routing.module';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbUserModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { MockResultsService } from './mock-results.service';
import { GraphResultComponent } from './search-result/graph-result/graph-result.component';
import { RangePipe } from '../../range.pipe';

@NgModule({
  declarations: [
    SearcherComponent,
    SearchResultComponent,
    SearchBarComponent,
    GraphResultComponent,
    RangePipe
  ],
  providers: [
    MockResultsService
  ],
  imports: [
    CommonModule,
    // OUR MODULES
    SearcherRoutingModule,
    FormsModule,
    // NEBULAR MODULES
    NbCardModule,
    NbFormFieldModule,
    NbInputModule,
    NbSelectModule,
    NbAccordionModule,
    NbUserModule,
    NbIconModule,
    NbButtonModule,
    NbLayoutModule,
    NbListModule
  ]
})
export class SearcherModule { }
