import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingContactComponent } from './landing-footer/landing-contact/landing-contact.component';
import { LandingContributeComponent } from './landing-footer/landing-contribute/landing-contribute.component';
import { LandingPrivacyComponent } from './landing-footer/landing-privacy/landing-privacy.component';
import { LandingNotFoundComponent } from './landing-not-found/not-found.component';
import { LandingHelpNfactsComponent } from './landing-footer/landing-help-nfacts/landing-help-nfacts.component';
import { LandingAPIComponent } from './landing-footer/landing-api/landing-api.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
      },
      {
        path: 'contact',
        component: LandingContactComponent,
      },
      {
        path: 'contribute',
        component: LandingContributeComponent
      },
      {
        path: 'privacy',
        component: LandingPrivacyComponent
      },
      {
        path: 'help-n-facts',
        component: LandingHelpNfactsComponent
      },
      {
        path: 'api',
        component: LandingAPIComponent
      },
      {
        path: '**',
        component: LandingNotFoundComponent,
      },
    ]
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class LandingPageRoutingModule {
}

