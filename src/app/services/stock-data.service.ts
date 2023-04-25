import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import * as protobuf from "protobufjs";

const {Buffer} = require("buffer/")

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient) {
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

    return this.http.get<any> (
      environment.apiPath + "/stock/search", {params}
    )
  }

  getStockPriceHistory(symbol: string, interval: { interval: string, range: string }) {
    // /stock/history/AAPL?interval=1h&range=5d"
    let params = new HttpParams().set("interval", interval.interval).set("range", interval.range);
    return this.http.get<any>(
      environment.apiPath + "/stock/history/" + symbol, {params}
    );
  }
}
