import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
@Component({
  selector: 'ls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit{

  constructor(private router: Router, private authService: NbAuthService) { }
  ngOnInit() {
    this.authService.isAuthenticated().subscribe(auth => {
      if (auth) {
        this.router.navigate(['/pages']);
      }
    })
  }

}
