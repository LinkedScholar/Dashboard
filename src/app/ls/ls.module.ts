import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsComponent } from './ls.component';
import { NbActionsModule, NbButtonModule, NbContextMenuModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { LsRoutingModule } from './ls-routing.module';
import { HeaderComponent } from './header/header.component';
import { DesktopExperienceRequiredComponent } from './desktop-experience-required/desktop-experience-required.component';

@NgModule({
  declarations: [
    LsComponent,
    HeaderComponent,
    DesktopExperienceRequiredComponent,
  ],

  imports: [
    CommonModule,

    LsRoutingModule,
    
    NbLayoutModule,
    NbUserModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    NbThemeModule,
    NbButtonModule,
    NbContextMenuModule,
    NbActionsModule
  ]
})
export class LsModule { }
