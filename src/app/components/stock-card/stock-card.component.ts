import {Component, NgModule, OnInit} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {StockDetailViewComponent} from "./stock-detail-view/stock-detail-view.component";
import {Router, RouterModule} from "@angular/router";
import {navigate} from "ionicons/icons";

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss'],
})


export class StockCardComponent  implements OnInit {
  stock_detail_view = StockDetailViewComponent;
  constructor(
    private stockDataService: StockDataService,
  ) { }

  ngOnInit() {
    this.stockDataService.testBackend().subscribe(test => {
      console.log(test)
    });
  }
}


