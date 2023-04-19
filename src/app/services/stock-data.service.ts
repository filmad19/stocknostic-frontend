import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient) { }


  getAllStocks(){
    return this.http.get<any> (
      environment.apiPath + "/stock"
    )
  }

  getStockData(symbol: string, interval: string) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`
    return this.http.get<any>(url);
  }
}
