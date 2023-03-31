import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient) { }

  private baseUrl = "http://localhost:8080/api/stock";


  testBackend(){
    return this.http.get<string> (
      this.baseUrl
    )
  }
}
