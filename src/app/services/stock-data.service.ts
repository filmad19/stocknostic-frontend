import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import * as protobuf from "protobufjs";
import {Stock} from "../shared/Stock";
import {PricePoint} from "../shared/PricePoint";
import {UserService} from "./user.service";
import {StockWebsocket} from "../shared/StockWebsocket";
import { UpdateStockListService} from "./update-stock-list.service";

const {Buffer} = require("buffer/")

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient,
              private userService: UserService,
              private updateStockListService: UpdateStockListService) {
  }

  webSocket: WebSocket | null = null;



  // webSocket() {
  //   let ws = new WebSocket('wss://streamer.finance.yahoo.com');
  //
  //   protobuf.load('/assets/YPricingData.proto', (error, root) => {
  //     if(error || root == undefined){
  //       return console.log(error)
  //     }
  //
  //     const Yaticker = root.lookupType("yaticker");
  //
  //     ws.onopen = function open() {
  //       console.log('connected');
  //
  //       ws.send(JSON.stringify({
  //         subscribe: ['BTC-USD']
  //       }));
  //     };
  //
  //     ws.onclose = function close() {
  //       console.log('disconnected');
  //     };
  //
  //     ws.onmessage = function incoming(message) {
  //       console.log('comming message')
  //
  //       console.log(Yaticker.decode(new Buffer(message.data, 'base64')))
  //     };
  //   });
  // }

  openWebSocket(stocklist: Stock[]) {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }

    let symbolList = stocklist.map(stock => stock.symbol);

    this.webSocket = new WebSocket('wss://streamer.finance.yahoo.com');

    const ws = this.webSocket
    const updateStockListService = this.updateStockListService;

    protobuf.load('/assets/YPricingData.proto', (error, root) => {
      if(error || root == undefined){
        return console.log(error)
      }

      const Yaticker = root.lookupType("yaticker");

      ws.onopen = function open() {
        console.log('connected');

        ws.send(JSON.stringify({
          subscribe: symbolList
        }));
      };

      ws.onclose = function close() {
        console.log('disconnected');
      };

      ws.onmessage = function incoming(message) {
        let webStock: StockWebsocket | any = Yaticker.decode(new Buffer(message.data, 'base64')).toJSON();

        let selectedStock: Stock | undefined = stocklist.find(stock => stock.symbol == webStock.id)


        if(selectedStock != null) {
          selectedStock.currentPrice = webStock.price
          updateStockListService.eventEmitter.emit(selectedStock);
        }
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

  getRsi(symbol: string){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());
    let params = new HttpParams().set("symbol", symbol);

    return this.http.get<PricePoint> (
      environment.apiPath + "/indicator/rsi",{params, headers}
    )
  }
}
