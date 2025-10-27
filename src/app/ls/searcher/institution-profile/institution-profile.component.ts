import { map } from 'rxjs/operators';
import { BackendBridgeService } from './../../../shared/backend-bridge.service';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

type researchArea = {
  keyword: string,
  count: number
}
@Component({
  selector: 'ls-institution-profile',
  templateUrl: './institution-profile.component.html',
  styleUrls: ['./institution-profile.component.scss']
})
export class InstitutionProfileComponent {
  
  institutionId: string;
  institutionName: string;
  researchAreas: string[] = [];
  topResearchAreas = [];
  selectedResearchArea: string;

  coInstitutions: any;

  matrix : any = [[]];
  labels: any = [];

  pubChart: any;
  citChart: any;

  topResearchers: any;
  chartData : any = [];

  overview: any;

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private backendBridge: BackendBridgeService,
    private titleService: Title) {}
  
  

  onAreaChange(area: string) {
    this.selectedResearchArea = area;
    this.backendBridge.getInstitutionTopResearchers(this.institutionId, this.selectedResearchArea).subscribe(data => {
      this.topResearchers = data;
    })
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.restartVariables();

      this.institutionId = params['id']; 

      this.backendBridge.getInstitutionBasicData(this.institutionId).subscribe(data => {
        this.institutionName = data["name"];
        this.titleService.setTitle(`Linked Scholar - ${this.institutionName}`);
      }).add(() => {
        this.backendBridge.getInstitutionOverview(this.institutionId).subscribe(data => {
          
          this.overview = {
            name: this.institutionName,
            children: data
          }
          console.log(this.overview);
        })
      });
      
      this.backendBridge.getInstitutionResearchInterest(this.institutionId).subscribe(data => {
        this.researchAreas = (data as researchArea[]).slice(0, 3).map(area => area.keyword);
        this.topResearchAreas = (data as researchArea[]).slice(0, 5);
        this.chartData = this.topResearchAreas.map(area => { return {"id" : area.keyword, "count": area.count}});
        console.log(this.chartData);
      }).add(() => {
        if (this.researchAreas.length == 0) { return; }
        this.selectedResearchArea = this.researchAreas[0];
        this.backendBridge.getInstitutionTopResearchers(this.institutionId, this.selectedResearchArea).subscribe(data => {
          this.topResearchers = data;
        })
      })
      
      this.backendBridge.getCoInstitutions(this.institutionId).subscribe(data => {
        this.coInstitutions = data;
      }).add(() => {
        this.backendBridge.getCoInstitutionMatrix(this.institutionId).subscribe(data => {
          this.matrix = data;
          // concat only 6 names
          this.labels = [this.institutionName] .concat(this.coInstitutions.slice(0, 6).map(coAuthor => coAuthor.name));
        })
      });
      
      this.backendBridge.getInstitutionPubsOverTime(this.institutionId).subscribe(data => {
        this.pubChart = (data as any[]).map(item => {return {"id": item["year"], "count": item["count"]}});  
      })

      this.backendBridge.getInstitutionCitationsOverTime(this.institutionId).subscribe(data => {
        this.citChart = (data as any[]).map(item => {return {"id": item["year"], "count": item["count"]}});  
      })

      
      
    });
  }

  restartVariables() {
    this.institutionName = "...";

  }

  navigateToPerson(id: string) {
    this.router.navigate(['/ls/person', id]);
  }

  navigateToInstitution(id: string) {
    this.router.navigate(['/ls/institution', id]);
  }
}
