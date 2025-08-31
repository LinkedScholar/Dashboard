import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockResultsService } from '../../../shared/mock-results.service';
import { BackendBridgeService } from '../../../shared/backend-bridge.service';

function simpleHash(inputString, maxValue = 10000) {
  // Initialize the hash value
  let hash = 0;

  // Check if the input is a valid string
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return 0; // Return 0 or handle error for invalid input
  }

  // Iterate over each character of the string
  for (let i = 0; i < inputString.length; i++) {
    const char = inputString.charCodeAt(i);
    // Use a bitwise OR to keep the hash an integer and perform a simple calculation
    hash = ((hash << 5) - hash) + char;
    // Convert to a 32bit integer
    hash |= 0;
  }

  // Use the modulo operator to constrain the hash to a number between 0 and 9999
  const constrainedHash = Math.abs(hash) % maxValue;

  // Add 1 to the result to make the range 1 to 10000
  return constrainedHash + 1;
}



@Component({
  selector: 'ls-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss']
})
export class PersonProfileComponent implements OnInit{

  personId: string;
  personName: string = "...";
  personPicture: string; // TODO: FIXME
  paperCount = 0;
  citationCount = 0;
  affiliations = [];

  chartData:any = [];
  coAuthors:any;

  gIndex = 0;
  hIndex = 0;
  i10Index = 0;
  sociabilityIndex = 0;
  
  matrix : any;
  labels : any;

  loading = true;


  
  constructor(private router: Router, private route : ActivatedRoute, private mockData : MockResultsService, private backendBridge: BackendBridgeService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.personId = params['id']; 
      this.personPicture = this.getFakePicture(this.personId);
      // this.personName = this.mockData.getPerson(+this.personId).name
      this.backendBridge.getPersonBasicData(this.personId).subscribe(data => {
        data = data[0];
        this.personName = data[0];
        this.citationCount = data[1];
        this.paperCount = data[2];
        this.affiliations = data[3];
      });

      this.backendBridge.getPersonResearchInteres(this.personId).subscribe(data => {
        this.chartData = data;
      })

      this.backendBridge.getCoAuthors(this.personId).subscribe(data => {
        this.coAuthors = data;
        this.loading = false;
        
      }).add(() => {
        this.backendBridge.getCoAuthorMatrix(this.personId).subscribe(data => {
          this.matrix = data;
          // concat only 6 names
          this.labels = [this.personName] .concat(this.coAuthors.slice(0, 6).map(coAuthor => coAuthor[2]));
        })
      });

      
    });

    // RANDOM VALUES for gIndex and others
    this.gIndex = simpleHash(this.personId + "gIndex", 100);
    this.hIndex = simpleHash(this.personId + "hIndex", 100);
    this.i10Index = simpleHash(this.personId + "i10Index", 100);
    this.sociabilityIndex = simpleHash(this.personId + "sociabilityIndex", 100);
  }

  navigateToInstitution(id: number) {
    this.router.navigate(['/ls/institution', this.affiliations[id][0]]);
  }

  navigateToPerson(id: number) {
    this.router.navigate(['/ls/person', id]);
  }

  getFakePicture(id) {
    return "https://avatars.githubusercontent.com/u/" + simpleHash(id) // TODO: FIXME
  }

  loadNext() {
    if (this.loading) { return }
    this.loading = true;
    this.backendBridge.getCoAuthors(this.personId, this.coAuthors.length).subscribe(data => {
      let f:any = data
      if (f)
      {
        this.coAuthors.push(...f);
        this.loading = false;
      }
    })
  }
}
