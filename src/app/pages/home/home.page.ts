import { Component, OnInit } from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {Stock} from "../../shared/Stock";



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  searchResults: Stock[] = [];

  constructor(private stockDataService: StockDataService) { }

  ngOnInit() {
    // this.stockDataService.webSocket();
  }


  searchStock($event: any) {
    this.stockDataService.searchStocks($event.target.value).subscribe(response => {
        this.searchResults = response;
    })
  }

  displayFavourites(){
    console.log("favourites")
  }
}
