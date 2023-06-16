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

  @Output() eventEmitter: EventEmitter<Stock> = new EventEmitter();

  constructor() { }
}
