import { Router } from '@angular/router';
import { FundingBridgeService, ProjectPrompt } from './../../../shared/funding-bridge.service';
import { Component, OnInit } from '@angular/core';
import { Prompt } from '../../../shared/funding/funding-prompt/funding-prompt.component';
import { NbDialogService } from '@nebular/theme';

type Date = {
  year: number;
  month: number;
  day: number
}
export type FundingData = {
  budget_max : number | null;
  budget_min : number | null;
  consortium_size_max : number | null;
  consortium_size_min : number | null;
  deadline: Date;
  description : string;
  detail_url : string;
  id: number;
  keywords: string[];
  program: string;
  research_areas: string[];
  title: string;
  topic_id: string;
  trl_max : number | null;
  trl_min : number | null;
  combined_score: number;
  constraints_details: any;
  constraints_score: number;
  semantic_score: number;
  match_explanation: string
}

type FundingDTO = {
  budget_max : number | null;
  budget_min : number | null;
  consortium_size_max : number | null;
  consortium_size_min : number | null;
  deadline: string | null;
  description : string;
  detail_url : string;
  id: number;
  keywords: string;
  program: string;
  research_areas: string;
  title: string;
  topic_id: string;
  trl_max : number | null;
  trl_min : number | null;
}

type FundingMatch = {
  combined_score: number;
  constraints_details: any;
  constraints_score: number;
  semantic_score: number;
  match_explanation: string;
  funding: FundingDTO
}

type NormalizedQuery = {
  budget_requirement: number | null;
  description: string;
  keywords: string;
  name: string;
  research_areas: string;
  team_size: number | null;
  trl_level: number | null;
}

type FundingResponseData = {
  matches: FundingMatch[],
  normalized_query : NormalizedQuery;
  project: ProjectPrompt;
  total_matches: number 
}

type FundingResponse = {
  data : FundingResponseData,
  success: boolean
}

@Component({
  selector: 'ls-matched-fundings',
  templateUrl: './matched-fundings.component.html',
  styleUrls: ['./matched-fundings.component.scss']
})
export class MatchedFundingsComponent implements OnInit{

  fundings : FundingData[] = []
  initialProject : any;

  constructor(
    private fundingBackend: FundingBridgeService,
    private router: Router,
    private dialogService: NbDialogService,
  ) { }

  

  ngOnInit(): void {
    let project = this.fundingBackend.getCurrentProject();
    this.initialProject = {
      description : project.description,
      keywords : project.keywords.split(', '),
      research_areas : project.research_areas.split(', ')
    }
    this.doRequest();
  }

  doRequest(){
    let obs = this.fundingBackend.getMatchedFundings()
    if (!obs) this.router.navigate(['/ls']);
    obs.subscribe((data: FundingResponse) => {
      this.fundings = [];
      if (!data.success) this.router.navigate(['/ls']);
      
      for (let funding of data.data.matches) {
        let parsedFunding :FundingData = {
          budget_max : funding.funding.budget_max,
          budget_min : funding.funding.budget_min,
          consortium_size_max : funding.funding.consortium_size_max,
          consortium_size_min : funding.funding.consortium_size_min,
          deadline: {
            year:   funding.funding.deadline ? parseInt(funding.funding.deadline.split('-')[0]) : 0,
            month:  funding.funding.deadline ? parseInt(funding.funding.deadline.split('-')[1]) : 0,
            day:    funding.funding.deadline ? parseInt(funding.funding.deadline.split('-')[2]) : 0
          },
          description : funding.funding.description,
          detail_url :  funding.funding.detail_url,
          id:       funding.funding.id,
          keywords: funding.funding.keywords ? funding.funding.keywords.split(',') : [],
          program:  funding.funding.program,
          research_areas: funding.funding.research_areas ? funding.funding.research_areas.split(',') : [],
          title:    funding.funding.title,
          topic_id: funding.funding.topic_id,
          trl_max : funding.funding.trl_max,
          trl_min : funding.funding.trl_min,
          combined_score: Math.round(funding.combined_score * 100),
          constraints_details: funding.constraints_details,
          constraints_score: Math.round(funding.constraints_score * 100),
          semantic_score: Math.round(funding.semantic_score * 100),
          match_explanation: funding.match_explanation
        }
        this.fundings.push(parsedFunding)
      }

      console.log(this.fundings);
    })
  }

  status( value: number) {
    if (value <= 25) {
      return 'danger';
    } else if (value <= 50) {
      return 'warning';
    } else if (value <= 75) {
      return 'info';
    } else {
      return 'success';
    }
  }

  prompt(result : Prompt) {
    this.fundingBackend.setPrompt("", result.description, result.keywords, result.researchAreas);
    this.doRequest();
  }

}
