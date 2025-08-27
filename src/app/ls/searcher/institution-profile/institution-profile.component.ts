import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ls-institution-profile',
  templateUrl: './institution-profile.component.html',
  styleUrls: ['./institution-profile.component.scss']
})
export class InstitutionProfileComponent {
  
  institutionId: number;
  
  constructor(private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.institutionId = +params['id']; // The '+' converts the string to a number
      // Now you can use this.personId to fetch data, etc.
    });
  }
}
