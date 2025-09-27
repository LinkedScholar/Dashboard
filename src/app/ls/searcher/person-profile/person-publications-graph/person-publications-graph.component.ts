
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ls-person-publications-graph',
  templateUrl: './person-publications-graph.component.html',
  styleUrls: ['./person-publications-graph.component.scss']
})
export class PersonPublicationsGraphComponent {

  @Input() graphWidth: number = 800;
  @Input() graphHeight: number = 600;
  @Input() papers: any[] = [];
  
}
