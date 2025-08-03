import { Component } from '@angular/core';

@Component({
  selector: 'ls-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss']
})
export class LandingFooterComponent {
  links = [
    { path: "/landing", title: "Home" },
    { path: "help-n-facts", title: "Help & Facts" },
    { path: "contribute", title: "Contribute" },
    { path: "contact", title: "Contact" },
    { path: "privacy", title: "Privacy" },
    { path: "api", title: "API" },
  ]
}
