import { Component, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { SolutionItem } from '../shared-types';

@Component({
  selector: 'ls-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent implements OnInit{

  currentTheme = 'default';
  solutionsDropdownOpen = false;

  solutionsItems: SolutionItem[]= [
    {
        icon: "pie-chart-outline",
        title: "Data Visualisation",
        description: "Interactive network graphs and research analytics",
        href: "data-visualization"
    },
    {
        icon: "people-outline",
        title: "Team & Funding Matchmaking",
        description: "Connect researchers with funding opportunities",
        href: "matchmaking"
    },
    {
        icon: "trending-up",
        title: "Trend Report Generator",
        description: "AI-powered insights on emerging research trends",
        href: "trend-reports"
    }
];

  constructor(private themeService: NbThemeService){
    
  }

  toggleTheme() {
    if (this.currentTheme == 'default')
      this.currentTheme = 'dark';
    else
      this.currentTheme = 'default';

    this.themeService.changeTheme(this.currentTheme);

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
  }

  setSolutionsDropdownOpen( open: boolean) {
    this.solutionsDropdownOpen = open;
  }
  
}
