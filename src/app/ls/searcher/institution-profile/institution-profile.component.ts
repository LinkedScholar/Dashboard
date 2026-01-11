import { map } from 'rxjs/operators';
import { BackendBridgeService } from './../../../shared/backend-bridge.service';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperData } from '../person-profile/person-profile.component';
import * as XLSX from 'xlsx';

type researchArea = {
  keyword: string,
  count: number
}

export interface FundingOpportunity {
  id: string;
  title: string;
  abstract: string;
  topics: string[];
  trlMin: number;
  trlMax: number;
  budgetMin: number;
  budgetMax: number;
  consortiumSize: number;
  deadline?: string;
}

export interface InstitutionMatch {
  id: string;
  name: string;
  previousCollaborations: number;
  smartScore: number;
  isLocked?: boolean;
}

export interface ResearcherCandidate {
  id: string;
  name: string;
  institutionId: string;
  institutionName: string;
  role: string;
  publicationCount: number;
  citationCount: number;
  expertiseScore: number;
  collaborationHistory: number;
}

export interface TeamMember {
  researcher: ResearcherCandidate;
  institutionId: string;
}

export interface ProposalDraft {
  fundingOpportunity: FundingOpportunity;
  selectedInstitutions: InstitutionMatch[];
  teamMembers: TeamMember[];
  generatedDate: string;
}

export type InstitutionSortKey = 'previousCollaborations' | 'smartScore' | 'name';
export type ResearcherSortKey = 'publicationCount' | 'citationCount' | 'expertiseScore' | 'collaborationHistory' | 'name';

export enum FundingMatchStep {
  LINK_INPUT = 'link_input',
  SUMMARY = 'summary',
  INSTITUTIONS = 'institutions',
  TEAM_BUILDING = 'team_building',
  EXPORT = 'export'
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

  // Funding Match-Maker State
  currentFundingStep: FundingMatchStep = FundingMatchStep.LINK_INPUT;
  fundingLink: string = '';
  selectedFunding: FundingOpportunity | null = null;
  availableInstitutions: InstitutionMatch[] = [];
  filteredInstitutions: InstitutionMatch[] = [];
  selectedInstitutions: InstitutionMatch[] = [];
  availableResearchers: ResearcherCandidate[] = [];
  filteredResearchers: ResearcherCandidate[] = [];
  selectedTeamMembers: TeamMember[] = [];
  institutionSortBy: InstitutionSortKey = 'smartScore';
  researcherSortBy: ResearcherSortKey = 'expertiseScore';
  institutionSearchQuery: string = '';
  researcherSearchQuery: string = '';
  loadingFunding = false;
  loadingInstitutions = false;
  loadingResearchers = false;

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

  // ========== FUNDING MATCH-MAKER METHODS ==========

  submitFundingLink() {
    if (!this.fundingLink || this.fundingLink.trim() === '') {
      alert('Please enter a funding opportunity link');
      return;
    }

    this.loadingFunding = true;

    // Simulate API call with 2-second delay
    setTimeout(() => {
      this.backendBridge.getMockFundingOpportunities().subscribe(
        (fundings) => {
          if (fundings && fundings.length > 0) {
            this.selectedFunding = fundings[0];
            this.currentFundingStep = FundingMatchStep.SUMMARY;
          }
          this.loadingFunding = false;
        },
        (error) => {
          console.error('Error loading funding opportunities:', error);
          this.loadingFunding = false;
        }
      );
    }, 2000);
  }

  startInstitutionSelection() {
    if (!this.selectedFunding) return;
    this.loadingInstitutions = true;
    this.currentFundingStep = FundingMatchStep.INSTITUTIONS;

    this.backendBridge.getInstitutionMatchesForFunding(
      this.institutionId,
      this.selectedFunding.id,
      this.selectedFunding.topics
    ).subscribe(
      (institutions) => {
        this.availableInstitutions = institutions;
        const lockedInst = this.availableInstitutions.find(i => i.isLocked);
        if (lockedInst) {
          lockedInst.name = this.institutionName;
          this.selectedInstitutions = [lockedInst];
        }
        this.sortInstitutions();
        this.filterInstitutions();
        this.loadingInstitutions = false;
      }
    );
  }

  filterInstitutions() {
    const query = this.institutionSearchQuery.toLowerCase().trim();
    if (query === '') {
      this.filteredInstitutions = [...this.availableInstitutions];
    } else {
      this.filteredInstitutions = this.availableInstitutions.filter(inst =>
        inst.name.toLowerCase().includes(query)
      );
    }
  }

  onInstitutionSearchChange() {
    this.filterInstitutions();
  }

  toggleInstitutionSelection(institution: InstitutionMatch) {
    if (institution.isLocked) return;
    const index = this.selectedInstitutions.findIndex(i => i.id === institution.id);
    if (index > -1) {
      this.selectedInstitutions.splice(index, 1);
    } else if (this.selectedInstitutions.length < 3) {
      this.selectedInstitutions.push(institution);
    }
  }

  isInstitutionSelected(institutionId: string): boolean {
    return this.selectedInstitutions.some(i => i.id === institutionId);
  }

  onInstitutionSortChange(sortKey: InstitutionSortKey) {
    this.institutionSortBy = sortKey;
    this.sortInstitutions();
    this.filterInstitutions();
  }

  sortInstitutions() {
    this.availableInstitutions.sort((a, b) => {
      if (a.isLocked) return -1;
      if (b.isLocked) return 1;
      switch (this.institutionSortBy) {
        case 'previousCollaborations': return b.previousCollaborations - a.previousCollaborations;
        case 'smartScore': return b.smartScore - a.smartScore;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }

  startTeamBuilding() {
    if (this.selectedInstitutions.length < 2) {
      alert('Please select at least 2 institutions');
      return;
    }
    this.loadingResearchers = true;
    this.currentFundingStep = FundingMatchStep.TEAM_BUILDING;

    const institutionIds = this.selectedInstitutions.map(i => i.id);
    this.backendBridge.getResearcherCandidatesForFunding(
      institutionIds,
      this.selectedFunding!.id,
      this.selectedFunding!.topics
    ).subscribe(
      (researchers) => {
        this.availableResearchers = researchers;
        this.sortResearchers();
        this.filterResearchers();
        this.loadingResearchers = false;
      }
    );
  }

  filterResearchers() {
    const query = this.researcherSearchQuery.toLowerCase().trim();
    if (query === '') {
      this.filteredResearchers = [...this.availableResearchers];
    } else {
      this.filteredResearchers = this.availableResearchers.filter(res =>
        res.name.toLowerCase().includes(query) ||
        res.institutionName.toLowerCase().includes(query)
      );
    }
  }

  onResearcherSearchChange() {
    this.filterResearchers();
  }

  toggleResearcherSelection(researcher: ResearcherCandidate) {
    const index = this.selectedTeamMembers.findIndex(tm => tm.researcher.id === researcher.id);
    if (index > -1) {
      this.selectedTeamMembers.splice(index, 1);
    } else {
      this.selectedTeamMembers.push({ researcher: researcher, institutionId: researcher.institutionId });
    }
  }

  isResearcherSelected(researcherId: string): boolean {
    return this.selectedTeamMembers.some(tm => tm.researcher.id === researcherId);
  }

  onResearcherSortChange(sortKey: ResearcherSortKey) {
    this.researcherSortBy = sortKey;
    this.sortResearchers();
    this.filterResearchers();
  }

  sortResearchers() {
    this.availableResearchers.sort((a, b) => {
      switch (this.researcherSortBy) {
        case 'publicationCount': return b.publicationCount - a.publicationCount;
        case 'citationCount': return b.citationCount - a.citationCount;
        case 'expertiseScore': return b.expertiseScore - a.expertiseScore;
        case 'collaborationHistory': return b.collaborationHistory - a.collaborationHistory;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }

  moveToExport() {
    if (this.selectedTeamMembers.length === 0) {
      alert('Please select at least one researcher');
      return;
    }
    this.currentFundingStep = FundingMatchStep.EXPORT;
  }

  exportProposalCSV() {
    // Create CSV content
    let csv = 'Funding Opportunity Proposal Draft\n\n';

    // Funding Information
    csv += 'FUNDING OPPORTUNITY\n';
    csv += `Title,${this.selectedFunding!.title}\n`;
    csv += `ID,${this.selectedFunding!.id}\n`;
    csv += `TRL Range,${this.selectedFunding!.trlMin}-${this.selectedFunding!.trlMax}\n`;
    csv += `Budget Range,${this.formatBudget(this.selectedFunding!.budgetMin)} - ${this.formatBudget(this.selectedFunding!.budgetMax)}\n`;
    csv += `Consortium Size,${this.selectedFunding!.consortiumSize}\n`;
    csv += `Generated,${new Date().toISOString()}\n\n`;

    // Selected Institutions
    csv += 'PARTNER INSTITUTIONS\n';
    csv += 'Institution Name,Previous Collaborations,Smart Score\n';
    this.selectedInstitutions.forEach(inst => {
      csv += `"${inst.name}",${inst.previousCollaborations},${inst.smartScore}\n`;
    });
    csv += '\n';

    // Team Members
    csv += 'TEAM MEMBERS\n';
    csv += 'Researcher Name,Institution,Publications,Citations,Expertise Score,Collaboration History\n';
    this.selectedTeamMembers.forEach(member => {
      const r = member.researcher;
      csv += `"${r.name}","${r.institutionName}",${r.publicationCount},${r.citationCount},${r.expertiseScore},${r.collaborationHistory}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proposal-draft-${this.selectedFunding!.id}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportProposalExcel() {
    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Funding Opportunity
    const fundingData = [
      ['FUNDING OPPORTUNITY'],
      ['Title', this.selectedFunding!.title],
      ['ID', this.selectedFunding!.id],
      ['Abstract', this.selectedFunding!.abstract],
      ['Topics', this.selectedFunding!.topics.join(', ')],
      ['TRL Range', `${this.selectedFunding!.trlMin}-${this.selectedFunding!.trlMax}`],
      ['Budget Range', `${this.formatBudget(this.selectedFunding!.budgetMin)} - ${this.formatBudget(this.selectedFunding!.budgetMax)}`],
      ['Consortium Size', this.selectedFunding!.consortiumSize],
      ['Generated', new Date().toISOString()]
    ];
    const fundingSheet = XLSX.utils.aoa_to_sheet(fundingData);
    XLSX.utils.book_append_sheet(workbook, fundingSheet, 'Funding Opportunity');

    // Sheet 2: Partner Institutions
    const institutionsData: any[][] = [
      ['PARTNER INSTITUTIONS'],
      ['Institution Name', 'Previous Collaborations', 'Smart Score']
    ];
    this.selectedInstitutions.forEach(inst => {
      institutionsData.push([inst.name, inst.previousCollaborations, inst.smartScore]);
    });
    const institutionsSheet = XLSX.utils.aoa_to_sheet(institutionsData);
    XLSX.utils.book_append_sheet(workbook, institutionsSheet, 'Partner Institutions');

    // Sheet 3: Team Members
    const teamData: any[][] = [
      ['TEAM MEMBERS'],
      ['Researcher Name', 'Institution', 'Publications', 'Citations', 'Expertise Score', 'Collaboration History']
    ];
    this.selectedTeamMembers.forEach(member => {
      const r = member.researcher;
      teamData.push([r.name, r.institutionName, r.publicationCount, r.citationCount, r.expertiseScore, r.collaborationHistory]);
    });
    const teamSheet = XLSX.utils.aoa_to_sheet(teamData);
    XLSX.utils.book_append_sheet(workbook, teamSheet, 'Team Members');

    // Download Excel file
    XLSX.writeFile(workbook, `proposal-draft-${this.selectedFunding!.id}-${Date.now()}.xlsx`);
  }

  goBackToSummary() {
    this.currentFundingStep = FundingMatchStep.SUMMARY;
    this.selectedInstitutions = [];
    this.availableInstitutions = [];
    this.filteredInstitutions = [];
    this.selectedTeamMembers = [];
    this.availableResearchers = [];
    this.filteredResearchers = [];
    this.institutionSearchQuery = '';
    this.researcherSearchQuery = '';
  }

  goBackToLinkInput() {
    this.currentFundingStep = FundingMatchStep.LINK_INPUT;
    this.selectedFunding = null;
    this.selectedInstitutions = [];
    this.availableInstitutions = [];
    this.filteredInstitutions = [];
    this.selectedTeamMembers = [];
    this.availableResearchers = [];
    this.filteredResearchers = [];
    this.institutionSearchQuery = '';
    this.researcherSearchQuery = '';
    this.fundingLink = '';
  }

  goBackToInstitutions() {
    this.currentFundingStep = FundingMatchStep.INSTITUTIONS;
    this.selectedTeamMembers = [];
    this.availableResearchers = [];
  }

  goBackToTeamBuilding() {
    this.currentFundingStep = FundingMatchStep.TEAM_BUILDING;
  }

  getScoreStatus(score: number): string {
    if (score >= 90) return 'success';
    if (score >= 75) return 'info';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  formatBudget(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
