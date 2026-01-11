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
      id: 'horizon-ai-2026',
      title: 'Horizon Europe: AI for Healthcare Innovation',
      abstract: 'Development of AI-driven diagnostic tools for early disease detection. Focus on machine learning, medical imaging, and clinical decision support systems.',
      topics: ['artificial intelligence', 'machine learning', 'healthcare', 'medical imaging', 'clinical systems'],
      trlMin: 4,
      trlMax: 7,
      budgetMin: 2000000,
      budgetMax: 5000000,
      consortiumSize: 3,
      deadline: '2026-09-15'
    }];
    return of(mockFundings);
  }

  getInstitutionMatchesForFunding(institutionId: string, fundingId: string, topics: string[]): Observable<any> {
    const mockInstitutions = [
      { id: institutionId, name: 'Current Institution', previousCollaborations: 15, smartScore: 92, isLocked: true },
      { id: 'inst-stanford', name: 'Stanford University', previousCollaborations: 8, smartScore: 88 },
      { id: 'inst-mit', name: 'Massachusetts Institute of Technology', previousCollaborations: 12, smartScore: 91 },
      { id: 'inst-oxford', name: 'University of Oxford', previousCollaborations: 6, smartScore: 85 },
      { id: 'inst-eth', name: 'ETH Zurich', previousCollaborations: 10, smartScore: 87 },
      { id: 'inst-cambridge', name: 'University of Cambridge', previousCollaborations: 9, smartScore: 89 },
      { id: 'inst-harvard', name: 'Harvard University', previousCollaborations: 7, smartScore: 86 },
      { id: 'inst-berkeley', name: 'UC Berkeley', previousCollaborations: 11, smartScore: 84 },
      { id: 'inst-imperial', name: 'Imperial College London', previousCollaborations: 5, smartScore: 83 },
      { id: 'inst-toronto', name: 'University of Toronto', previousCollaborations: 4, smartScore: 80 },
      { id: 'inst-cmu', name: 'Carnegie Mellon University', previousCollaborations: 8, smartScore: 82 },
      { id: 'inst-caltech', name: 'California Institute of Technology', previousCollaborations: 6, smartScore: 81 },
      { id: 'inst-princeton', name: 'Princeton University', previousCollaborations: 5, smartScore: 79 },
      { id: 'inst-yale', name: 'Yale University', previousCollaborations: 4, smartScore: 78 },
      { id: 'inst-chicago', name: 'University of Chicago', previousCollaborations: 7, smartScore: 77 },
      { id: 'inst-columbia', name: 'Columbia University', previousCollaborations: 6, smartScore: 76 },
      { id: 'inst-penn', name: 'University of Pennsylvania', previousCollaborations: 5, smartScore: 75 },
      { id: 'inst-ucl', name: 'University College London', previousCollaborations: 8, smartScore: 82 },
      { id: 'inst-edinburgh', name: 'University of Edinburgh', previousCollaborations: 4, smartScore: 74 },
      { id: 'inst-cornell', name: 'Cornell University', previousCollaborations: 3, smartScore: 73 },
      { id: 'inst-michigan', name: 'University of Michigan', previousCollaborations: 6, smartScore: 72 },
      { id: 'inst-northwestern', name: 'Northwestern University', previousCollaborations: 5, smartScore: 71 },
      { id: 'inst-duke', name: 'Duke University', previousCollaborations: 4, smartScore: 70 },
      { id: 'inst-washington', name: 'University of Washington', previousCollaborations: 7, smartScore: 75 },
      { id: 'inst-melbourne', name: 'University of Melbourne', previousCollaborations: 3, smartScore: 69 },
      { id: 'inst-tsinghua', name: 'Tsinghua University', previousCollaborations: 9, smartScore: 84 },
      { id: 'inst-tokyo', name: 'University of Tokyo', previousCollaborations: 5, smartScore: 76 },
      { id: 'inst-kaist', name: 'KAIST', previousCollaborations: 4, smartScore: 73 }
    ];
    return of(mockInstitutions);
  }

  getResearcherCandidatesForFunding(institutionIds: string[], fundingId: string, topics: string[]): Observable<any> {
    const mockResearchers = [
      { id: 'res-001', name: 'Dr. Sarah Chen', institutionId: 'inst-stanford', institutionName: 'Stanford University', role: 'Senior Researcher', publicationCount: 45, citationCount: 1250, expertiseScore: 94, collaborationHistory: 8 },
      { id: 'res-002', name: 'Prof. Michael Brown', institutionId: 'inst-mit', institutionName: 'Massachusetts Institute of Technology', role: 'Principal Investigator', publicationCount: 67, citationCount: 2100, expertiseScore: 96, collaborationHistory: 12 },
      { id: 'res-003', name: 'Dr. Emily Watson', institutionId: 'inst-oxford', institutionName: 'University of Oxford', role: 'Postdoctoral Researcher', publicationCount: 38, citationCount: 980, expertiseScore: 89, collaborationHistory: 5 },
      { id: 'res-004', name: 'Dr. James Liu', institutionId: 'inst-stanford', institutionName: 'Stanford University', role: 'Research Scientist', publicationCount: 52, citationCount: 1580, expertiseScore: 92, collaborationHistory: 10 },
      { id: 'res-005', name: 'Prof. Anna Schmidt', institutionId: 'inst-eth', institutionName: 'ETH Zurich', role: 'Principal Investigator', publicationCount: 78, citationCount: 2450, expertiseScore: 97, collaborationHistory: 15 },
      { id: 'res-006', name: 'Dr. David Kim', institutionId: 'inst-kaist', institutionName: 'KAIST', role: 'Assistant Professor', publicationCount: 41, citationCount: 1180, expertiseScore: 88, collaborationHistory: 7 },
      { id: 'res-007', name: 'Prof. Maria Garcia', institutionId: 'inst-cambridge', institutionName: 'University of Cambridge', role: 'Associate Professor', publicationCount: 63, citationCount: 1920, expertiseScore: 95, collaborationHistory: 11 },
      { id: 'res-008', name: 'Dr. Robert Johnson', institutionId: 'inst-harvard', institutionName: 'Harvard University', role: 'Senior Researcher', publicationCount: 49, citationCount: 1340, expertiseScore: 91, collaborationHistory: 9 },
      { id: 'res-009', name: 'Prof. Li Wei', institutionId: 'inst-tsinghua', institutionName: 'Tsinghua University', role: 'Full Professor', publicationCount: 56, citationCount: 1670, expertiseScore: 93, collaborationHistory: 10 },
      { id: 'res-010', name: 'Dr. Sophie Martin', institutionId: 'inst-imperial', institutionName: 'Imperial College London', role: 'Research Fellow', publicationCount: 44, citationCount: 1210, expertiseScore: 90, collaborationHistory: 8 },
      { id: 'res-011', name: 'Prof. Ahmed Hassan', institutionId: 'inst-berkeley', institutionName: 'UC Berkeley', role: 'Principal Investigator', publicationCount: 71, citationCount: 2280, expertiseScore: 96, collaborationHistory: 13 },
      { id: 'res-012', name: 'Dr. Jennifer Lee', institutionId: 'inst-toronto', institutionName: 'University of Toronto', role: 'Postdoctoral Researcher', publicationCount: 39, citationCount: 1050, expertiseScore: 87, collaborationHistory: 6 },
      { id: 'res-013', name: 'Prof. Thomas Anderson', institutionId: 'inst-cmu', institutionName: 'Carnegie Mellon University', role: 'Full Professor', publicationCount: 65, citationCount: 1980, expertiseScore: 94, collaborationHistory: 12 },
      { id: 'res-014', name: 'Dr. Laura Rossi', institutionId: 'inst-oxford', institutionName: 'University of Oxford', role: 'Research Scientist', publicationCount: 42, citationCount: 1140, expertiseScore: 88, collaborationHistory: 7 },
      { id: 'res-015', name: 'Prof. John Williams', institutionId: 'inst-caltech', institutionName: 'California Institute of Technology', role: 'Associate Professor', publicationCount: 69, citationCount: 2150, expertiseScore: 95, collaborationHistory: 14 },
      { id: 'res-016', name: 'Dr. Nina Patel', institutionId: 'inst-stanford', institutionName: 'Stanford University', role: 'Assistant Professor', publicationCount: 47, citationCount: 1290, expertiseScore: 90, collaborationHistory: 8 },
      { id: 'res-017', name: 'Prof. Carlos Rodriguez', institutionId: 'inst-mit', institutionName: 'Massachusetts Institute of Technology', role: 'Principal Investigator', publicationCount: 73, citationCount: 2320, expertiseScore: 97, collaborationHistory: 15 },
      { id: 'res-018', name: 'Dr. Yuki Tanaka', institutionId: 'inst-tokyo', institutionName: 'University of Tokyo', role: 'PhD Student', publicationCount: 40, citationCount: 1090, expertiseScore: 86, collaborationHistory: 6 },
      { id: 'res-019', name: 'Prof. Helena Novak', institutionId: 'inst-cambridge', institutionName: 'University of Cambridge', role: 'Full Professor', publicationCount: 61, citationCount: 1850, expertiseScore: 93, collaborationHistory: 11 },
      { id: 'res-020', name: 'Dr. Marcus Fischer', institutionId: 'inst-eth', institutionName: 'ETH Zurich', role: 'Senior Researcher', publicationCount: 48, citationCount: 1360, expertiseScore: 91, collaborationHistory: 9 },
      { id: 'res-021', name: 'Prof. Priya Sharma', institutionId: 'inst-harvard', institutionName: 'Harvard University', role: 'Associate Professor', publicationCount: 58, citationCount: 1720, expertiseScore: 92, collaborationHistory: 10 },
      { id: 'res-022', name: 'Dr. Daniel Cohen', institutionId: 'inst-princeton', institutionName: 'Princeton University', role: 'Postdoctoral Researcher', publicationCount: 36, citationCount: 940, expertiseScore: 85, collaborationHistory: 5 },
      { id: 'res-023', name: 'Prof. Isabella Ferrari', institutionId: 'inst-yale', institutionName: 'Yale University', role: 'Assistant Professor', publicationCount: 54, citationCount: 1620, expertiseScore: 91, collaborationHistory: 9 },
      { id: 'res-024', name: 'Dr. Kevin O\'Brien', institutionId: 'inst-chicago', institutionName: 'University of Chicago', role: 'Research Fellow', publicationCount: 43, citationCount: 1190, expertiseScore: 88, collaborationHistory: 7 },
      { id: 'res-025', name: 'Prof. Mei Zhang', institutionId: 'inst-tsinghua', institutionName: 'Tsinghua University', role: 'Full Professor', publicationCount: 62, citationCount: 1890, expertiseScore: 94, collaborationHistory: 12 },
      { id: 'res-026', name: 'Dr. Oliver Schmidt', institutionId: 'inst-columbia', institutionName: 'Columbia University', role: 'PhD Student', publicationCount: 37, citationCount: 1010, expertiseScore: 86, collaborationHistory: 6 },
      { id: 'res-027', name: 'Prof. Rachel Adams', institutionId: 'inst-penn', institutionName: 'University of Pennsylvania', role: 'Associate Professor', publicationCount: 59, citationCount: 1780, expertiseScore: 93, collaborationHistory: 11 },
      { id: 'res-028', name: 'Dr. Pierre Dubois', institutionId: 'inst-ucl', institutionName: 'University College London', role: 'Research Scientist', publicationCount: 46, citationCount: 1270, expertiseScore: 89, collaborationHistory: 8 },
      { id: 'res-029', name: 'Prof. Aisha Muhammad', institutionId: 'inst-edinburgh', institutionName: 'University of Edinburgh', role: 'Senior Researcher', publicationCount: 50, citationCount: 1450, expertiseScore: 90, collaborationHistory: 9 },
      { id: 'res-030', name: 'Dr. Henrik Larsson', institutionId: 'inst-cornell', institutionName: 'Cornell University', role: 'Postdoctoral Researcher', publicationCount: 35, citationCount: 920, expertiseScore: 84, collaborationHistory: 5 },
      { id: 'res-031', name: 'Prof. Sophia Papadopoulos', institutionId: 'inst-michigan', institutionName: 'University of Michigan', role: 'Full Professor', publicationCount: 55, citationCount: 1640, expertiseScore: 92, collaborationHistory: 10 },
      { id: 'res-032', name: 'Dr. Lucas Silva', institutionId: 'inst-northwestern', institutionName: 'Northwestern University', role: 'Research Fellow', publicationCount: 41, citationCount: 1150, expertiseScore: 87, collaborationHistory: 7 },
      { id: 'res-033', name: 'Prof. Catherine Blanc', institutionId: 'inst-duke', institutionName: 'Duke University', role: 'Associate Professor', publicationCount: 57, citationCount: 1700, expertiseScore: 93, collaborationHistory: 11 },
      { id: 'res-034', name: 'Dr. Rajesh Kumar', institutionId: 'inst-washington', institutionName: 'University of Washington', role: 'Assistant Professor', publicationCount: 44, citationCount: 1230, expertiseScore: 89, collaborationHistory: 8 },
      { id: 'res-035', name: 'Prof. Emma Wilson', institutionId: 'inst-melbourne', institutionName: 'University of Melbourne', role: 'Senior Researcher', publicationCount: 51, citationCount: 1510, expertiseScore: 90, collaborationHistory: 9 },
      { id: 'res-036', name: 'Dr. Alexander Ivanov', institutionId: 'inst-imperial', institutionName: 'Imperial College London', role: 'Research Scientist', publicationCount: 48, citationCount: 1380, expertiseScore: 91, collaborationHistory: 9 },
      { id: 'res-037', name: 'Prof. Fatima Al-Rashid', institutionId: 'inst-berkeley', institutionName: 'UC Berkeley', role: 'Principal Investigator', publicationCount: 66, citationCount: 2050, expertiseScore: 95, collaborationHistory: 13 },
      { id: 'res-038', name: 'Dr. Sebastian Meyer', institutionId: 'inst-cmu', institutionName: 'Carnegie Mellon University', role: 'Postdoctoral Researcher', publicationCount: 39, citationCount: 1070, expertiseScore: 87, collaborationHistory: 6 },
      { id: 'res-039', name: 'Prof. Victoria Chang', institutionId: 'inst-caltech', institutionName: 'California Institute of Technology', role: 'Full Professor', publicationCount: 64, citationCount: 1970, expertiseScore: 94, collaborationHistory: 12 },
      { id: 'res-040', name: 'Dr. Nathan Park', institutionId: 'inst-kaist', institutionName: 'KAIST', role: 'Research Fellow', publicationCount: 42, citationCount: 1160, expertiseScore: 88, collaborationHistory: 7 }
    ];
    return of(mockResearchers);
  }

}
