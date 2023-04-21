import { Component, OnInit } from '@angular/core';
import {RouterModule} from "@angular/router";
import {StockDetailCardComponent} from "../stock-detail-card/stock-detail-card.component";

@Component({
  selector: 'app-stock-detail-view',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],

})

export class StockListItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
