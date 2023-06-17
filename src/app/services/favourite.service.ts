import { Injectable } from '@angular/core';
import {Stock} from "../shared/Stock";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserService} from "./user.service";

/*
* Matthias Filzmaier
* 21.04.2023
* stocknostic
*/

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(private http: HttpClient,
              private userService: UserService) { }


  addStockToFavourite(stock: Stock){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());

    return this.http.post<Stock[]> (
      environment.apiPath + "/favourite", {symbol: stock.symbol, companyName: stock.companyName}, {headers}
    )
  }

  removeStockFromFavourite(stockSymbol: string){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());
    let params = new HttpParams().set("symbol", stockSymbol);

    return this.http.delete<Stock[]> (
      environment.apiPath + "/favourite", {params, headers}
    )
  }
}
