import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaperData } from '../ls/searcher/person-profile/person-profile.component';
import { map } from 'rxjs/operators';

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

  getPersonResearchInteres(personId: string) {
    return this.http.get(`/api/person_interests/${personId}`);
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

}
