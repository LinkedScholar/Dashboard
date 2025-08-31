import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { RangePipe } from './range.pipe';
import { SearchAutocompleteResultComponent } from './search-autocomplete-result/search-autocomplete-result.component';
import { NbIconModule } from '@nebular/theme';
import { StackedBarComponent } from './charts/stacked-bar/stacked-bar.component';
import { ChordDiagramComponent } from './charts/chord-diagram/chord-diagram.component';



@NgModule({
  declarations: [
    SafeHtmlPipe,
    RangePipe,
    SearchAutocompleteResultComponent,
    StackedBarComponent,
    ChordDiagramComponent
  ],
  imports: [
    CommonModule,

    NbIconModule
  ],
  exports: [
    SafeHtmlPipe,
    RangePipe,
    SearchAutocompleteResultComponent,
    StackedBarComponent,
    ChordDiagramComponent,
  ]
})
export class SharedModule { }
