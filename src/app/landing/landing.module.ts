import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { LandingPageComponent } from './landing.component';
import { LandingPageRoutingModule } from './landing-routing.module';
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbIconModule} from '@nebular/theme';
import { LandingHeaderComponent } from './landing-header/landing-header.component';


@NgModule({
  declarations: [
    LandingPageComponent,
    LandingHeaderComponent
  ],
  imports: [
    ThemeModule,
    LandingPageRoutingModule,
    NbLayoutModule,
    NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbIconModule
  ]
})
export class LandingPageModule { }
