import { Router } from '@angular/router';
import { FundingBridgeService, ProjectPrompt } from './../../../shared/funding-bridge.service';
import { Component, OnInit } from '@angular/core';
import { Prompt } from '../../../shared/funding/funding-prompt/funding-prompt.component';
import { NbDialogService } from '@nebular/theme';
import { query } from '@angular/animations';

type Date = {
  year: number;
  month: number;
  day: number
}
export type FundingData = {
  title: string;
  id: number;
  description : string;
  semantic_score: number;
  budget_max : number | null;
  budget_min : number | null;
  deadline: Date;
  trl_max : number | null;
  trl_min : number | null;
}

type FundingDTO = {
  title: string;
  id: number;
  description : string;
  semantic_score: number;
  budget_max : number | null;
  budget_min : number | null;
  deadline: string | null;
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
  results : FundingDTO[],
  total_matches: number,
  page_number: number,
  page_size: number
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
      query : project.query,
      research_areas : project.research_areas
    }
    this.doRequest();
  }

  doRequest(){
    let obs = this.fundingBackend.getMatchedFundings()
    obs.subscribe((data: FundingResponse) => {
      this.fundings = [];
      for (let funding of data.results) {
        console.log(funding)
        let parsedFunding :FundingData = {
          budget_max : funding.budget_max,
          budget_min : funding.budget_min,
          deadline: {
            year:   funding.deadline ? parseInt(funding.deadline.split('-')[0]) : 0,
            month:  funding.deadline ? parseInt(funding.deadline.split('-')[1]) : 0,
            day:    funding.deadline ? parseInt(funding.deadline.split('-')[2]) : 0
          },
          description : funding.description,
          id:       funding.id,
          title:    funding.title,
          trl_max : funding.trl_max,
          trl_min : funding.trl_min,
          semantic_score: Math.round(funding.semantic_score * 100),
        }
        this.fundings.push(parsedFunding)
      }

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
