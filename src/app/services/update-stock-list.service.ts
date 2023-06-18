import {EventEmitter, Injectable, Output} from '@angular/core';
import {Stock} from "../shared/Stock";

/*
* Matthias Filzmaier
* 14.06.2023
* stocknostic
*/

@Injectable({
  providedIn: 'root'
})
export class UpdateStockListService {

  //event emmitter to update the prices received by the websocket
  @Output() priceWebsocketEvent: EventEmitter<Stock> = new EventEmitter();

  @Output() likedEvent: EventEmitter<Stock> = new EventEmitter();

  constructor() { }
}
