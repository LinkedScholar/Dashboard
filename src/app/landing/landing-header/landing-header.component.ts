import { Component, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';


@Component({
  selector: 'ls-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent implements OnInit{

  currentTheme = 'default';

  constructor(private themeService: NbThemeService){
    
  }

  toggleTheme() {
    if (this.currentTheme == 'default')
      this.currentTheme = 'cosmic';
    else
      this.currentTheme = 'default';

    this.themeService.changeTheme(this.currentTheme);

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
  }
  
}
