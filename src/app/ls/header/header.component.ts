import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { NbMenuService, NbThemeService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';

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
    private router: Router,
    private menuService: NbMenuService) {}

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];


  ngOnInit(): void {
    this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name
    })

    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user-context-menu'),
        map(({ item: { title } }) => title),
      ).subscribe(title => {
        if (title === 'Log out') {
          this.logout();
        }
        else if (title === 'Profile') {
          this.router.navigate(['/ls/profile']);
        }
      });
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

  logout() {
    console.log('logout');
    this.authService.logout('email').subscribe(() => {
      this.router.navigate(['/']);
    });
    return false;
  }

}
