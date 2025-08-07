import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

type HeaderLink = {
  url: string;
  title: string;
}

@Component({
  selector: 'ls-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent implements OnInit{

  currentTheme: string;

  constructor(private themeService: NbThemeService) {}

  ngOnInit(): void {
    this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name
    })
  }

  links: HeaderLink[] = [
    {
      title: 'Dashboard',
      url: '/ls/dashboard',
    },
    {
      title: 'Searcher',
      url: '/ls/searcher',
    },
    {
      title: 'Reports',
      url: '/ls/report',
    },
  ];

  activeLink: number = 0;

  setActiveLink(index: number) {
    this.activeLink = index;
  }

  toggleTheme() {
    if (this.currentTheme == 'default')
      this.currentTheme = 'dark';
    else
      this.currentTheme = 'default';

    this.themeService.changeTheme(this.currentTheme);
  }

}
