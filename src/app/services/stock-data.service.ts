import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient) { }


  testBackend(){
    return this.http.get<string> (
      environment.apiPath + "/stock"
    )
  }
}
