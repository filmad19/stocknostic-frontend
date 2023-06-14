import {EventEmitter, Injectable, Output} from '@angular/core';
import {Stock} from "../shared/Stock";

@Injectable({
  providedIn: 'root'
})
export class UpdateStockListService {

  @Output() eventEmitter: EventEmitter<Stock> = new EventEmitter();

  constructor() { }
}
