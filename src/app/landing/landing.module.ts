import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { LandingPageComponent } from './landing.component';
import { LandingPageRoutingModule } from './landing-routing.module';
import { NbSidebarModule, NbLayoutModule, NbButtonModule } from '@nebular/theme';



@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    ThemeModule,
    LandingPageRoutingModule,
    NbLayoutModule,
    NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
  ]
})
export class LandingPageModule { }
