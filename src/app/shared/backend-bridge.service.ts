import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendBridgeService {

  constructor( private http: HttpClient) {}

  findBestMatches(query: string) {
    console.log(query)
    const postData = {
      query: query
    };

    let result : any = [];
    return this.http.post('/api/autocomplete_options', postData);
  }

}
