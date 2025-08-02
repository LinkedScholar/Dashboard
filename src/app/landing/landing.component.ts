import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
@Component({
  selector: 'ngx-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingPageComponent  implements OnDestroy {
  private alive = true;

  ngOnDestroy() {
    this.alive = false;
  }
}
