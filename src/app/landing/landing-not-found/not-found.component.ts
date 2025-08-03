import { Component } from '@angular/core';
import { Location } from '@angular/common'; // Import the Location service

@Component({
  selector: 'ls-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class LandingNotFoundComponent {

  constructor(private location: Location) {
  }

  goToHome() {
    this.location.back();
  }
}
