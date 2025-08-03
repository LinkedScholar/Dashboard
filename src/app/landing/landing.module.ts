import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { LandingComponent } from './landing.component';
import { LandingPageRoutingModule } from './landing-routing.module';
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbIconModule, NbPopoverModule, NbCardModule, NbInputModule, NbFormFieldModule} from '@nebular/theme';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingDropdownSolutionComponent } from './landing-header/landing-dropdown-solution/landing-dropdown-solution.component';
import { LandingContactComponent } from './landing-footer/landing-contact/landing-contact.component';
import { LandingContributeComponent } from './landing-footer/landing-contribute/landing-contribute.component';
import { LandingHelpNfactsComponent } from './landing-footer/landing-help-nfacts/landing-help-nfacts.component';
import { LandingPrivacyComponent } from './landing-footer/landing-privacy/landing-privacy.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { LandingNotFoundComponent } from './landing-not-found/not-found.component';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { LandingAPIComponent } from './landing-footer/landing-api/landing-api.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LpSearchbarComponent } from './landing-page/lp-searchbar/lp-searchbar.component';
import { LpContentComponent } from './landing-page/lp-content/lp-content.component';
import { FeatureShowcaseComponent } from './landing-page/lp-content/feature-showcase/feature-showcase.component';


@NgModule({
  declarations: [
    LandingHeaderComponent,
    LandingDropdownSolutionComponent,
    LandingContactComponent,
    LandingContributeComponent,
    LandingHelpNfactsComponent,
    LandingPrivacyComponent,
    LandingFooterComponent,
    LandingNotFoundComponent,
    LandingAPIComponent,
    LandingPageComponent,
    LandingComponent,
    LpSearchbarComponent,
    LpContentComponent,
    FeatureShowcaseComponent
  ],
  imports: [
    ThemeModule,
    LandingPageRoutingModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbIconModule,
    NbPopoverModule,
    NbCardModule,
    ngFormsModule,
    NbInputModule,
    NbFormFieldModule
  ]
})
export class LandingModule { }
