import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { RangePipe } from './range.pipe';
import { SearchAutocompleteResultComponent } from './search-autocomplete-result/search-autocomplete-result.component';
import { NbIconModule } from '@nebular/theme';



@NgModule({
  declarations: [
    SafeHtmlPipe,
    RangePipe,
    SearchAutocompleteResultComponent
  ],
  imports: [
    CommonModule,

    NbIconModule
  ],
  exports: [
    SafeHtmlPipe,
    RangePipe,
    SearchAutocompleteResultComponent
  ]
})
export class SharedModule { }
