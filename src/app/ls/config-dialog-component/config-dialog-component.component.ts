import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ls-config-dialog-component',
  templateUrl: './config-dialog-component.component.html',
  styleUrls: ['./config-dialog-component.component.scss']
})
export class ConfigDialogComponentComponent {

  themeValue = [];
  unitsValue = ["Imperial"];
  vocabularyValue = ["EuroSciVoc"];

  constructor(
    protected ref: NbDialogRef<ConfigDialogComponentComponent>,
    private themeService: NbThemeService) {
      this.themeService.getJsTheme().subscribe(theme => {
        this.themeValue = [theme.name];
      })
    }

  dismiss() {
    this.ref.close();
  }

  updateUnits(value) {
    console.log("Update units");
    console.log(value);
    if (value.length == 0) {
      return;
    }
    this.unitsValue = [value[0]];
  }

  updateVocabulary(value) {
    if (value.length === 0) {
      return;
    }
    this.vocabularyValue = [value[0]];
  }

  updateTheme(value) {
    if (value.length === 0) {
      return;
    }
    this.themeService.changeTheme(value[0]);
    this.themeValue = [value[0]];
  }

}
