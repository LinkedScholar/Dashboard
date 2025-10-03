import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearcherPageComponent } from './searcher-page.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SharedModule } from '../../shared/shared.module';
import { NbCardModule, NbFormFieldModule, NbInputModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SearcherPageComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,


    NbFormFieldModule,
    NbInputModule,
    NbCardModule,


    SharedModule
  ],
  exports: [
    SearchBarComponent,
    SearcherPageComponent
  ]
})
export class SearcherPageModule { }
