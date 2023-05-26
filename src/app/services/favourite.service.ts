import { Injectable } from '@angular/core';
import {Stock} from "../shared/Stock";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(private http: HttpClient,
              private userService: UserService) { }

  toggleLiked(stock: Stock){
    if(stock.liked){
      this.removeStockFromFavourite(stock.symbol).subscribe(response => {
        console.log(response)
      })
    } else if(!stock.liked){
      this.addStockToFavourite(stock.symbol).subscribe(response => {
        console.log(response)
      })
    }
  }

  private addStockToFavourite(stockSymbol: string){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());

    return this.http.post<Stock[]> (
      environment.apiPath + "/favourite", {stockSymbol}, {headers}
    )
  }

  private removeStockFromFavourite(stockSymbol: string){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());
    let params = new HttpParams().set("symbol", stockSymbol);

    return this.http.delete<Stock[]> (
      environment.apiPath + "/favourite", {params, headers}
    )
  }
}
