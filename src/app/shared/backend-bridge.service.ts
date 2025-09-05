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
        // You can add validation or more complex transformations here
        return response as PaperData[];
      })
    );
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

}
