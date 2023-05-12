import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import * as protobuf from "protobufjs";
import {Stock} from "../shared/Stock";
import {PricePoint} from "../shared/PricePoint";
import {UserService} from "./user.service";

const {Buffer} = require("buffer/")

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient,
              private userService: UserService) {
  }

  webSocket() {
    let ws = new WebSocket('wss://streamer.finance.yahoo.com');

    protobuf.load('/assets/YPricingData.proto', (error, root) => {
      if(error || root == undefined){
        return console.log(error)
      }

      const Yaticker = root.lookupType("yaticker");

      ws.onopen = function open() {
        console.log('connected');

        ws.send(JSON.stringify({
          subscribe: ['BTC-USD']
        }));
      };

      ws.onclose = function close() {
        console.log('disconnected');
      };

      ws.onmessage = function incoming(message) {
        console.log('comming message')

        console.log(Yaticker.decode(new Buffer(message.data, 'base64')))
      };
    });
  }


  searchStocks(searchString: string){
    let params = new HttpParams().set("q", searchString);
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());


    return this.http.get<Stock[]> (
      environment.apiPath + "/stock/search", {params, headers}
    )
  }

  getStockPriceHistory(symbol: string, interval: { interval: string, range: string }) {
    let params = new HttpParams().set("interval", interval.interval).set("range", interval.range);
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());

    return this.http.get<PricePoint[]>(
      environment.apiPath + "/stock/history/" + symbol, {params, headers}
    );
  }

  getFavouriteStocks(){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());

    return this.http.get<Stock[]> (
      environment.apiPath + "/favourite",{headers}
    )
  }

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
