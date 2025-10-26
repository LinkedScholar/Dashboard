import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsComponent } from './ls.component';
import { NbActionsModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbContextMenuModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { LsRoutingModule } from './ls-routing.module';
import { HeaderComponent } from './header/header.component';
import { DesktopExperienceRequiredComponent } from './desktop-experience-required/desktop-experience-required.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigDialogComponentComponent } from './config-dialog-component/config-dialog-component.component';

@NgModule({
  declarations: [
    LsComponent,
    HeaderComponent,
    DesktopExperienceRequiredComponent,
    ConfigDialogComponentComponent,
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,

    LsRoutingModule,
    
    NbLayoutModule,
    NbUserModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    NbThemeModule,
    NbButtonModule,
    NbContextMenuModule,
    NbActionsModule,
    NbCardModule,
    NbButtonGroupModule,
    NbDialogModule.forChild(),
  ],
})
export class LsModule { }
