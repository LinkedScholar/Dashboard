import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaperData } from '../ls/searcher/person-profile/person-profile.component';
import { map } from 'rxjs/operators';

export type ProjectPrompt = {
  title: string;
  description: string;
  keywords: string;
  research_areas: string;
};

@Injectable({
  providedIn: 'root'
})
export class FundingBridgeService {

  constructor( private http: HttpClient) {}

  currentProject: ProjectPrompt | undefined;

  getSampleProjects() {

    return this.http.get('/funding-api/projects');
  }

  getPersonBasicData(personId: string) {
    return this.http.get(`/api/person/${personId}`);
  }

  getPersonResearchInteres(personId: string) {
    return this.http.get(`/api/person_interests/${personId}`);
  }

  getConnectivity(authors: string[]) {

    const postData = {
      authors: authors
    };

    let result : any = [];
    return this.http.post('/api/authors_conectivity', postData);
  }

  searchResult(query: string, option: string, sort: string, page: number) {
    const obj = {
      q: query,
      t: option,
      target: 'researcher',
      page: page,
      s: sort
    };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/search?${queryString}`;
    return this.http.get(fullUrl);
  }

  getBestType(query: string) {
    return this.http.get(`api/getBestType/${query}`)
  }

  setPrompt(title: string, description: string, keywords: string[], research_areas: string[]) {
    this.currentProject = {
      title: title,
      description: description,
      keywords: keywords.join(', '),
      research_areas: research_areas.join(', ')
    }
  }

  getMatchedFundings() {
    if (!this.currentProject) {
      return;
    }
    const postData = this.currentProject;
    return this.http.post('/funding-api/match/project?limit=10', postData);
  }

  getCurrentProject() {
    return this.currentProject;
  }
}
