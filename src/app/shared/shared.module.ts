import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { RangePipe } from './range.pipe';
import { SearchAutocompleteResultComponent } from './search-autocomplete-result/search-autocomplete-result.component';
import { NbAccordionModule, NbButtonModule, NbFormFieldModule, NbIconModule, NbInputModule, NbPopoverModule, NbListModule, NbPopoverDirective } from '@nebular/theme';
import { StackedBarComponent } from './charts/stacked-bar/stacked-bar.component';
import { ChordDiagramComponent } from './charts/chord-diagram/chord-diagram.component';
import { FundingPromptComponent } from './funding/funding-prompt/funding-prompt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from './funding/tag/tag.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';



@NgModule({
  declarations: [
    SafeHtmlPipe,
    RangePipe,
    SearchAutocompleteResultComponent,
    StackedBarComponent,
    ChordDiagramComponent,
    FundingPromptComponent,
    TagComponent,
    BarChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    NbIconModule,
    NbPopoverModule,
    NbButtonModule,
    NbInputModule,
    NbFormFieldModule,
    NbAccordionModule,
    NbListModule
  ],
  exports: [
    SafeHtmlPipe,
    RangePipe,
    SearchAutocompleteResultComponent,
    StackedBarComponent,
    ChordDiagramComponent,
    FundingPromptComponent,
    BarChartComponent
  ],
})
export class SharedModule { }
