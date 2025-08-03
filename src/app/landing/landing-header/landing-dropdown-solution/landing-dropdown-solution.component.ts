import { Component, Input } from '@angular/core';
import { SolutionItem } from '../../shared-types';

@Component({
  selector: 'ls-landing-dropdown-solution',
  templateUrl: './landing-dropdown-solution.component.html',
  styleUrls: ['./landing-dropdown-solution.component.scss']
})
export class LandingDropdownSolutionComponent {
  @Input() data: SolutionItem;
}
