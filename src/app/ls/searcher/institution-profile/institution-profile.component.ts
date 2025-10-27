import { map } from 'rxjs/operators';
import { BackendBridgeService } from './../../../shared/backend-bridge.service';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperData } from '../person-profile/person-profile.component';

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
  moreResearchAreas = [];
  selectedResearchArea: string;
  selectedResearchAreaExtended: string;

  coInstitutions: any;
  coInstitutionsFiltered: any;

  matrix : any = [[]];
  matrixFiltered : any = [[]];
  labels: any = [];
  labelsFiltered: any = [];

  pubChart: any;
  citChart: any;

  pubChartFiltered: any;
  citChartFiltered: any;

  topResearchers: any;
  topResearchersExtended: any;
  chartData : any = [];

  loadingPagesFiltered = false;

  papers: any[] = [];
  nPages: number = 1;
  currentPage: number = 1;

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

  onAreaChangeExtended(area: string) {
    this.selectedResearchAreaExtended = area;

    this.pubChartFiltered = [];
    this.citChartFiltered = [];
    this.topResearchersExtended = [];
    this.coInstitutionsFiltered = [];
    this.matrixFiltered = [];
    this.labelsFiltered = [];
    this.currentPage = 1;


    this.backendBridge.getInstitutionTopResearchers(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
      this.topResearchersExtended = data;
    })

    this.backendBridge.getCoInstitutionsFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
      this.coInstitutionsFiltered = data;
    }).add(() => {
      this.backendBridge.getCoInstitutionMatrixFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
        this.matrixFiltered = data;
        // concat only 6 names
        this.labelsFiltered = [this.institutionName] .concat(this.coInstitutions.slice(0, 6).map(coAuthor => coAuthor.name));
      })
    });

    this.backendBridge.getInstitutionPubsOverTimeFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
      this.pubChartFiltered = (data as any[]).map(item => {return {"id": item["year"], "count": item["count"]}});  
    })

    this.backendBridge.getInstitutionCitationsOverTimeFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
      this.citChartFiltered = (data as any[]).map(item => {return {"id": item["year"], "count": item["count"]}});  
    })

    this.backendBridge.getInstitutionPapers(this.institutionId, (this.currentPage - 1)*10, this.selectedResearchAreaExtended).subscribe(
      (data: PaperData[]) => {
        this.papers = data;
        this.loadingPagesFiltered = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loadingPagesFiltered = false;
      }
    );

    this.backendBridge.getInstitutionBasicDataFiltered(this.institutionId, this.selectedResearchArea).subscribe(data => {
      let totalPubs = data["paperCount"];
      this.nPages = Math.ceil(totalPubs / 10);
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
            children: data,
          }
          console.log(this.overview);
        })
      });
      
      this.backendBridge.getInstitutionResearchInterest(this.institutionId).subscribe(data => {
        this.researchAreas = (data as researchArea[]).slice(0, 3).map(area => area.keyword);
        this.topResearchAreas = (data as researchArea[]).slice(0, 5);
        this.moreResearchAreas = (data as researchArea[]).slice(0, 15);
        this.chartData = this.topResearchAreas.map(area => { return {"id" : area.keyword, "count": area.count}});
        console.log(this.chartData);
      }).add(() => {
        if (this.researchAreas.length == 0) { return; }
        this.selectedResearchArea = this.researchAreas[0];
        this.selectedResearchAreaExtended = this.selectedResearchArea;
        this.backendBridge.getInstitutionTopResearchers(this.institutionId, this.selectedResearchArea).subscribe(data => {
          this.topResearchers = data;
        });
        this.backendBridge.getInstitutionTopResearchers(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
          this.topResearchersExtended = data;
        })

        this.backendBridge.getCoInstitutionsFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
          this.coInstitutionsFiltered = data;
        }).add(() => {
          this.backendBridge.getCoInstitutionMatrixFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
            this.matrixFiltered = data;
            // concat only 6 names
            this.labelsFiltered = [this.institutionName] .concat(this.coInstitutions.slice(0, 6).map(coAuthor => coAuthor.name));
          })
        });

        this.backendBridge.getInstitutionPubsOverTimeFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
          this.pubChartFiltered = (data as any[]).map(item => {return {"id": item["year"], "count": item["count"]}});  
        })
  
        this.backendBridge.getInstitutionCitationsOverTimeFiltered(this.institutionId, this.selectedResearchAreaExtended).subscribe(data => {
          this.citChartFiltered = (data as any[]).map(item => {return {"id": item["year"], "count": item["count"]}});  
        })
        this.backendBridge.getInstitutionPapers(this.institutionId, (this.currentPage - 1)*10, this.selectedResearchAreaExtended).subscribe(
          (data: PaperData[]) => {
            this.papers = data;
            this.loadingPagesFiltered = false;
          },
          (error) => {
            console.error('Error fetching data:', error);
            this.loadingPagesFiltered = false;
          }
        );
        this.backendBridge.getInstitutionBasicDataFiltered(this.institutionId, this.selectedResearchArea).subscribe(data => {
          let totalPubs = data["paperCount"];
          this.nPages = Math.ceil(totalPubs / 10);
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

  handleNewPage(page) {
    this.loadingPagesFiltered = true;
    this.currentPage = page;

    this.backendBridge.getInstitutionPapers(this.institutionId, (this.currentPage - 1)*10, this.selectedResearchAreaExtended).subscribe(
      (data: PaperData[]) => {
        this.papers = data;
        this.loadingPagesFiltered = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loadingPagesFiltered = false;
      }
    );
  }
}
