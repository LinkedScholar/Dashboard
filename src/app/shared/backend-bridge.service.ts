import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaperData } from '../ls/searcher/person-profile/person-profile.component';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendBridgeService {

  constructor( private http: HttpClient) {}

  findBestMatches(query: string) {
    const postData = {
      query: query
    };

    let result : any = [];
    return this.http.post('/api/autocomplete_options', postData);
  }

  getPersonBasicData(personId: string) {
    return this.http.get(`/api/person/${personId}`);
  }

  getInstitutionBasicData(institutionId: string) {
    return this.http.get(`/api/institution/${institutionId}`);
  }

  getInstitutionBasicDataFiltered(institutionId: string, filter: string) {
    const obj = { query: filter };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/institution_filtered/${institutionId}?${queryString}`;
    return this.http.get(fullUrl);
  }

  getPersonResearchInteres(personId: string) {
    return this.http.get(`/api/person_interests/${personId}`);
  }

  getInstitutionResearchInterest(institutionId: string) {
    return this.http.get(`/api/institution_interests/${institutionId}`);
  }

  getInstitutionTopResearchers(institutionId: string, researchArea: string) {
    const obj = { ra: researchArea };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/institution_top_researchers/${institutionId}?${queryString}`;
    return this.http.get(fullUrl);
  }

  getCoInstitutions(institutionId: string) {
    return this.http.get(`/api/institution_coinstitutions/${institutionId}`);
  }

  getCoInstitutionsFiltered(institutionId: string, filter: string) {

    const obj = { query: filter };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/institution_coinstitutions_filtered/${institutionId}?${queryString}`;

    return this.http.get(fullUrl);
  }

  getCoInstitutionMatrix(institutionId: string) {
    return this.http.get(`/api/institution_matrix/${institutionId}`);
  }
  getCoInstitutionMatrixFiltered(institutionId: string, filter: string ) {
    const obj = { query: filter };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/institution_matrix_filtered/${institutionId}?${queryString}`;
    return this.http.get(fullUrl);
  }

  getInstitutionPubsOverTime(institutionId: string) {
    return this.http.get(`/api/institution_pubs_over_time/${institutionId}`);
  }

  getInstitutionCitationsOverTime(institutionId: string) {
    return this.http.get(`/api/institution_citations_over_time/${institutionId}`);
  }

  getInstitutionPubsOverTimeFiltered(institutionId: string, filter: string) {
    const obj = { query: filter };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/institution_pubs_over_time_filtered/${institutionId}?${queryString}`;
    return this.http.get(fullUrl);
  }

  getInstitutionCitationsOverTimeFiltered(institutionId: string, filter: string) {
    const obj = { query: filter };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/institution_citations_over_time_filtered/${institutionId}?${queryString}`;
    return this.http.get(fullUrl);
  }

  getInstitutionOverview(institutionId: string) {
    return this.http.get(`/api/institution_overview/${institutionId}`);
  }

  getPersonPapers(personId: string, skip: number = 0) : Observable<PaperData[]>{
    const obj = {skip: skip};
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/person_papers/${personId}?${queryString}`;  
    return this.http.get(fullUrl).pipe(
      map(response => {
        return response as PaperData[];
      })
    );
  }
  getInstitutionPapers(personId: string, skip: number = 0, filter: string) : Observable<PaperData[]>{
    const obj = {
      skip: skip,
      filter: filter
    };
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/institution_papers_filtered/${personId}?${queryString}`;  
    return this.http.get(fullUrl).pipe(
      map(response => {
        return response as PaperData[];
      })
    );
  }

  getPersonNetwork(personId: string) {
    return this.http.get(`/api/getPersonNetwork/${personId}`);
  }

  getCoAuthors(personId: string, skip: number = 0) {
    const obj = {skip: skip};
    const httpParams = new HttpParams({ fromObject: obj });
    const queryString = httpParams.toString(); // 
    const fullUrl = `/api/person_coauthors/${personId}?${queryString}`;  
    return this.http.get(fullUrl);
  }

  getCoAuthorMatrix(personId: string) {
    return this.http.get('/api/person_coauthor_matrix/' + personId);
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

  // Funding Match-Maker Methods
  getMockFundingOpportunities(): Observable<any> {
    const mockFundings = [{
      id: 'HORIZON-CL6-2027-01-ZEROPOLLUTION-02',
      title: 'Developing effective air quality planning strategies through innovative multi-scale modelling',
      abstract: `This Horizon Europe call seeks proposals to advance air quality modelling capabilities across multiple spatial and temporal scales, from regional to street-level resolution. The core challenge is that current models struggle to accurately capture complex interactions between different scales and urban environments, limiting their usefulness for effective air quality planning and public health protection.
Successful proposals should develop integrated multi-scale modelling chains with two-way nesting capabilities, improve urban canopy parameterisation to account for how buildings and vegetation influence pollution, and create validated micro-scale models for assessing hotspot locations. The work should reach Technology Readiness Level 5 and produce practical guidelines for decision-makers developing Air Quality Plans and Roadmaps under the revised Ambient Air Quality Directive.
A key requirement is addressing the vulnerability dimension—recognising that children, older people, those with lower socioeconomic status, and people with underlying health conditions are disproportionately affected by air pollution. Proposals should provide recommendations on linking air quality data with social and spatial inequality assessments.
The call emphasises building on existing initiatives including FAIRMODE and AQUILA communities, utilising research infrastructures like ACTRIS, ensuring data is FAIR-compliant, and preparing outputs for potential integration into the Copernicus Atmosphere Monitoring Service. Collaboration with ESA's FuturEO programme and international partners is encouraged. The Joint Research Centre may participate in funded consortia to support harmonised modelling approaches and best practice development.`,
      topics: ['Air Quality Modelling', 'Public Health', 'Data Science / Computational Modelling'],
      trlMin: 4,
      trlMax: 6,
      budgetMin: 9800000,
      budgetMax: 24000000,
      consortiumSize: 3,
      deadline: '22 September 2027'
    }];
    return of(mockFundings);
  }

  getInstitutionMatchesForFunding(institutionId: string, fundingId: string, topics: string[]): Observable<any> {
    const mockInstitutions = [
      { id: 'inst-tuwien', name: 'TU Wien', previousCollaborations: 0, smartScore: 92, isLocked: true },
      { id: 'inst-polito', name: 'Politecnico di Torino', previousCollaborations: 6, smartScore: 82 },
      { id: 'inst-zhaw', name: 'Zurich University of Applied Sciences', previousCollaborations: 6, smartScore: 79 },
      { id: 'inst-dtu', name: 'Technical University of Denmark', previousCollaborations: 3, smartScore: 85 },
      { id: 'inst-surrey', name: 'University of Surrey', previousCollaborations: 3, smartScore: 78 },
      { id: 'inst-hannover', name: 'Leibniz University Hannover', previousCollaborations: 5, smartScore: 80 },
      { id: 'inst-lut', name: 'LUT University', previousCollaborations: 5, smartScore: 77 },
      { id: 'inst-ntua', name: 'National Technical University of Athens', previousCollaborations: 5, smartScore: 81 },
      { id: 'inst-ait', name: 'AIT Austrian Institute of Technology', previousCollaborations: 12, smartScore: 90 },
      { id: 'inst-bosch', name: 'Bosch Rexroth AG', previousCollaborations: 6, smartScore: 82 }
    ];
    return of(mockInstitutions);
  }

  getResearcherCandidatesForFunding(institutionIds: string[], fundingId: string, topics: string[]): Observable<any> {
    const mockResearchers = [
      // TU Wien (4 researchers) - real names from Institute of Materials Chemistry / Chemical Technologies and Analytics
      { id: 'res-040', name: 'Prof. Hinrich Grothe', institutionId: 'inst-tuwien', institutionName: 'TU Wien', role: 'Full Professor', publicationCount: 213, citationCount: 10367, expertiseScore: 93, collaborationHistory: 0 },
      { id: 'res-041', name: 'Dr. Dominik Stolzenburg', institutionId: 'inst-tuwien', institutionName: 'TU Wien', role: 'Senior Researcher', publicationCount: 91, citationCount: 2992, expertiseScore: 89, collaborationHistory: 0 },
      { id: 'res-042', name: 'Prof. Anne Kasper-Giebl', institutionId: 'inst-tuwien', institutionName: 'TU Wien', role: 'Full Professor', publicationCount: 111, citationCount: 8431, expertiseScore: 91, collaborationHistory: 0 },
      { id: 'res-043', name: 'Dr. Lubna Dada', institutionId: 'inst-tuwien', institutionName: 'TU Wien', role: 'Senior Researcher', publicationCount: 91, citationCount: 2992, expertiseScore: 88, collaborationHistory: 0 },
      // Politecnico di Torino (3 researchers) - real names from DAUIN department
      { id: 'res-001', name: 'Prof. Stefano Di Carlo', institutionId: 'inst-polito', institutionName: 'Politecnico di Torino', role: 'Full Professor', publicationCount: 40, citationCount: 4600, expertiseScore: 91, collaborationHistory: 10 },
      { id: 'res-002', name: 'Prof. Alessandro Savino', institutionId: 'inst-polito', institutionName: 'Politecnico di Torino', role: 'Associate Professor', publicationCount: 35, citationCount: 1600	, expertiseScore: 87, collaborationHistory: 7 },
      { id: 'res-003', name: 'Prof. Erasmo Carrera', institutionId: 'inst-polito', institutionName: 'Politecnico di Torino', role: 'Full Professor', publicationCount: 180, citationCount: 39700, expertiseScore: 84, collaborationHistory: 5 },
      // Zurich University of Applied Sciences (3 researchers) - real names
      { id: 'res-004', name: 'Dr. Jacinta Edebeli', institutionId: 'inst-zhaw', institutionName: 'Zurich University of Applied Sciences', role: 'Senior Researcher', publicationCount: 31, citationCount: 559, expertiseScore: 79, collaborationHistory: 6 },
      { id: 'res-005', name: 'Dr. Tobias Schripp', institutionId: 'inst-zhaw', institutionName: 'Zurich University of Applied Sciences', role: 'Senior Researcher', publicationCount: 102, citationCount: 3838, expertiseScore: 85, collaborationHistory: 6 },
      { id: 'res-044', name: 'Dr. Bruno Neininger', institutionId: 'inst-zhaw', institutionName: 'Zurich University of Applied Sciences', role: 'Senior Researcher', publicationCount: 51, citationCount: 2270, expertiseScore: 82, collaborationHistory: 6 },
      // Technical University of Denmark (3 researchers) - real names
      { id: 'res-006', name: 'Prof. Lars Dittmann', institutionId: 'inst-dtu', institutionName: 'Technical University of Denmark', role: 'Full Professor', publicationCount: 67, citationCount: 4400, expertiseScore: 94, collaborationHistory: 12 },
      { id: 'res-007', name: 'Prof. Søren Linderoth', institutionId: 'inst-dtu', institutionName: 'Technical University of Denmark', role: 'Head of Department', publicationCount: 303, citationCount: 8305, expertiseScore: 88, collaborationHistory: 8 },
      { id: 'res-008', name: 'Prof. Claus Hélix-Nielsen', institutionId: 'inst-dtu', institutionName: 'Technical University of Denmark', role: 'Head of Department', publicationCount: 70, citationCount: 8260, expertiseScore: 82, collaborationHistory: 4 },
      // University of Surrey (2 researchers) - real names
      { id: 'res-010', name: 'Prof. Sir Martin Sweeting', institutionId: 'inst-surrey', institutionName: 'University of Surrey', role: 'Distinguished Professor', publicationCount: 350, citationCount: 4925, expertiseScore: 86, collaborationHistory: 7 },
      // Leibniz University Hannover (2 researchers) - real names
      { id: 'res-011', name: 'Prof. Udo Nackenhorst', institutionId: 'inst-hannover', institutionName: 'Leibniz University Hannover', role: 'Full Professor', publicationCount: 75, citationCount: 3250, expertiseScore: 92, collaborationHistory: 11 },
      // LUT University (2 researchers) - real names (Highly Cited Researchers)
      { id: 'res-013', name: 'Prof. Christian Breyer', institutionId: 'inst-lut', institutionName: 'LUT University', role: 'Full Professor', publicationCount: 550, citationCount: 33900, expertiseScore: 88, collaborationHistory: 8 },
      { id: 'res-014', name: 'Prof. Behnam M. Ivatloo', institutionId: 'inst-lut', institutionName: 'LUT University', role: 'Full Professor', publicationCount: 450, citationCount: 26550, expertiseScore: 83, collaborationHistory: 5 },
     // National Technical University of Athens (3 researchers) - real names
      { id: 'res-018', name: 'Prof. Dimitrios C. Rakopoulos', institutionId: 'inst-ntua', institutionName: 'National Technical University of Athens', role: 'Full Professor', publicationCount: 150, citationCount: 11700, expertiseScore: 87, collaborationHistory: 7 },
      { id: 'res-019', name: 'Prof. Nikos Lagaros', institutionId: 'inst-ntua', institutionName: 'National Technical University of Athens', role: 'Vice Rector', publicationCount: 550, citationCount: 9700, expertiseScore: 82, collaborationHistory: 4 },
      // AIT Austrian Institute of Technology (3 researchers) - real names
      { id: 'res-024', name: 'Prof. Stefano Passerini', institutionId: 'inst-ait', institutionName: 'AIT Austrian Institute of Technology', role: 'Principal Scientist', publicationCount: 450, citationCount: 81470, expertiseScore: 95, collaborationHistory: 14 },
      { id: 'res-025', name: 'Dr. Ivan Barisic', institutionId: 'inst-ait', institutionName: 'AIT Austrian Institute of Technology', role: 'Principal Investigator', publicationCount: 80, citationCount: 1030, expertiseScore: 90, collaborationHistory: 9 },
      { id: 'res-026', name: 'Dr. Rainer Hainberger', institutionId: 'inst-ait', institutionName: 'AIT Austrian Institute of Technology', role: 'Principal Investigator', publicationCount: 230, citationCount: 1900, expertiseScore: 86, collaborationHistory: 6 },
      // Bosch Rexroth AG (2 researchers) - real name for leadership
      { id: 'res-033', name: 'Dr. Claudia Schwarz', institutionId: 'inst-bosch', institutionName: 'Bosch Rexroth AG', role: 'Senior Research Scientist', publicationCount: 0, citationCount: 0, expertiseScore: 87, collaborationHistory: 8 }
    ];
    return of(mockResearchers);
  }

}
