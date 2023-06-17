import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import * as protobuf from "protobufjs";
import {Stock} from "../shared/Stock";
import {PricePoint} from "../shared/PricePoint";
import {UserService} from "./user.service";
import {StockWebsocketPojo} from "../shared/StockWebsocketPojo";
import { UpdateStockListService} from "./update-stock-list.service";

const {Buffer} = require("buffer/")

/*
* Matthias Filzmaier
* 21.04.2023
* stocknostic
*/

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient,
              private userService: UserService,
              private updateStockListService: UpdateStockListService) {
  }

  webSocket: WebSocket | null = null;

  //this function is made with the help of a Tutorial
  // the Yahoo Finance websocket is not public and therefore encrypted
  openWebSocket(stocklist: Stock[]) {

    // if there is an active websocket, close it
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }

    // get symbols from all displayed stocks in the list of the home screen
    let symbolList = stocklist.map(stock => stock.symbol);

    // open a new websocket
    this.webSocket = new WebSocket('wss://streamer.finance.yahoo.com');

    // workaround because there is no this. object inside the protofub.load
    const ws = this.webSocket
    const updateStockListService = this.updateStockListService;

    // load the decryption file
    protobuf.load('/assets/YPricingData.proto', (error, root) => {
      if(error || root == undefined){
        return console.log(error)
      }

      //define type for decryption
      const Yaticker = root.lookupType("yaticker");

      ws.onopen = function open() {
        console.log('connected');

        //subscribe to all stocks in the list to get current prices
        ws.send(JSON.stringify({
          subscribe: symbolList
        }));
      };

      ws.onclose = function close() {
        console.log('disconnected');
      };

      //if a new message is recieved
      ws.onmessage = function incoming(message) {
        //decode message into object
        let webStock: StockWebsocketPojo | any = Yaticker.decode(new Buffer(message.data, 'base64')).toJSON();

        // find the corresponding stock of the list
        let selectedStock: Stock | undefined = stocklist.find(stock => stock.symbol == webStock.id)


        if(selectedStock != null) {
          selectedStock.currentPrice = webStock.price
          // use eventEmitter to notify the list component or the detailed view component to update the price
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
