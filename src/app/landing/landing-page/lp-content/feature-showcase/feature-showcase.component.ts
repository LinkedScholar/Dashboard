import { FeatureDetail } from './../lp-content.component';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FeatureContent } from '../lp-content.component';
@Component({
  selector: 'ls-feature-showcase',
  templateUrl: './feature-showcase.component.html',
  styleUrls: ['./feature-showcase.component.scss']
})
export class FeatureShowcaseComponent implements OnInit{
  @Input () data: FeatureContent;
  @Input () reversed: boolean = false;

  selected_detail = 0;
  selected_detail_data: FeatureDetail = {
    description: "none",
    icon: "none",
    image: "none",
    title: "none"
  };

  ngOnInit() {
    this.selected_detail_data = this.data.fetureDetails[0];
  }

  highlightDetail(index : number) : void {
    this.selected_detail = index;
    this.selected_detail_data = this.data.fetureDetails[index];
  }
}
