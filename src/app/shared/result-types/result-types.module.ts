import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




export interface Result {
  id: number;
  name: string;
}

export interface Person extends Result {
  age : number,
  citations: number,
  hIndex: number,
  university: number,
  researchAreas: string[]
}

export interface University extends Result {
  address: string
}



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class ResultTypesModule { }
