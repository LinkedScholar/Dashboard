import { Component, OnInit } from '@angular/core';
import { FundingBridgeService } from '../../../shared/funding-bridge.service';
import { Tag } from '../../../shared/funding/tag/tag.component';
import { NbMenuItem } from '@nebular/theme';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';


type ProjectDTO = {
  title: string
  description: string,
  program: string,
  topic_id: string,
  budget_min: number | null,
  budget_max: number | null,
  deadline: string | null,
  eligibility: string | null,
  keywords: string,
  research_areas: string | null,
  trl_min: number | null,
  trl_max: number | null,
  consortium_size_min: number | null,
  consortium_size_max: number | null,
  project_id: number,
  acronym: string,
  framework_programme: string | null,
  funding_scheme: string | null,
  legal_basis: string | null,
  start_date: string | null,
  end_date: string,
  status: string,
  grant_doi: string | null,
  master_call: string | null,
  sub_call: string | null,
  ec_signature_date: string | null,
  total_cost: number | null
}

type Date = {
  day: number
  month: number
  year: number
}

type Project = {
  title: string
  description: string,
  program: string,
  topic_id: string,
  budget_min: number | null,
  budget_max: number | null,
  deadline: Date | null,
  eligibility: string | null,
  keywords: string[],
  research_areas: string[],
  trl_min: number | null,
  trl_max: number | null,
  consortium_size_min: number | null,
  consortium_size_max: number | null,
  project_id: number,
  acronym: string,
  framework_programme: string | null,
  funding_scheme: string | null,
  legal_basis: string | null,
  start_date: Date | null,
  end_date: string,
  status: string,
  grant_doi: string | null,
  master_call: string | null,
  sub_call: string | null,
  ec_signature_date: Date | null,
  total_cost: number | null
}



type ProjectsResponse = {
  data: {
    projects: ProjectDTO[]
  }
  success: boolean
}

@Component({
  selector: 'ls-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  
  projects: ProjectDTO[] = []


  constructor(private fundingBackend: FundingBridgeService, private router: Router) {}

  ngOnInit(): void {
    this.fundingBackend.getSampleProjects().subscribe((data: ProjectsResponse) => {
      this.projects = data.data.projects;
      console.log(this.projects);
    });

  }

  DTOtoProject(dto: ProjectDTO) : Project{

    let stringDeadline = dto.deadline;
    let deadline = stringDeadline ? this.stringToDate(stringDeadline) : null;

    return {
      title: dto.title,
      description: dto.description,
      program: dto.program,
      topic_id: dto.topic_id,
      budget_min: dto.budget_min,
      budget_max: dto.budget_max,
      deadline: deadline,
      eligibility: dto.eligibility,
      keywords: this.splitStringByCharacter(dto.keywords, ','),
      research_areas: this.splitStringByCharacter(dto.research_areas, ','),
      trl_min: dto.trl_min,
      trl_max: dto.trl_max,
      consortium_size_min: dto.consortium_size_min,
      consortium_size_max: dto.consortium_size_max,
      project_id: dto.project_id,
      acronym: dto.acronym,
      framework_programme: dto.framework_programme,
      funding_scheme: dto.funding_scheme,
      legal_basis: dto.legal_basis,
      start_date: dto.start_date ? this.stringToDate(dto.start_date) : null,
      end_date: dto.end_date,
      status: dto.status,
      grant_doi: dto.grant_doi || null, 
      master_call: dto.master_call || null, 
      sub_call: dto.sub_call || null,
      ec_signature_date: dto.ec_signature_date ? this.stringToDate(dto.ec_signature_date) : null,
      total_cost: dto.total_cost || null,
    }
  }

  stringToDate(stringDate: string) : Date{
    return {
      day: parseInt(stringDate.slice(8, 10)),
      month: parseInt(stringDate.slice(5, 7)),
      year: parseInt(stringDate.slice(0, 4))
    }
  }

  splitStringByCharacter(string: string, character: string) : string[]{
    return string.split(character);
  }
  
}
