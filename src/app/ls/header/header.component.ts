import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { NbDialogService, NbThemeService } from '@nebular/theme';
import { ConfigDialogComponentComponent } from '../config-dialog-component/config-dialog-component.component';

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

  constructor(
    private themeService: NbThemeService,
    private authService: NbAuthService,
    private dialogService: NbDialogService,
    private router: Router) {}



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
      title: 'Funding',
      url: '/ls/funding',
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

  logout() {
    this.authService.logout('email').subscribe(() => {
      this.router.navigate(['/']);
    });
    return false;
  }

  openDialog() {
    this.dialogService.open(ConfigDialogComponentComponent);
  }

}
