import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Stock} from "../../shared/Stock";
import {ModalController} from "@ionic/angular";
import {StockDetailCardComponent} from "../stock-detail-card/stock-detail-card.component";
import {StockDataService} from "../../services/stock-data.service";
import {PricePoint} from "../../shared/PricePoint";
import {FavouriteService} from "../../services/favourite.service";
import {UpdateStockListService} from "../../services/update-stock-list.service";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-stock-list-item',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DecimalPipe]
})
/*
* Stefan Ghergheles
* 14.05.2023
* stocknostic
*/

export class StockListItemComponent implements OnInit {
  stockPercentageGain: string = '';
  percentageStyle: string = 'font-bold text-right'

  @Input() stock: Stock | any;

  constructor(private router: Router,
              private modalController: ModalController,
              private stockDataService: StockDataService,
              private favouriteService: FavouriteService,
              private updateStockListService: UpdateStockListService,
              private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    this.setInitialPrices()

    // detect changes to the price and recalculate the percentage gain/loss
    this.updateStockListService.priceWebsocketEvent.subscribe(selectedStock => {
      if(selectedStock === this.stock){
        this.stock.currentPrice = selectedStock.currentPrice.toFixed(2);
        this.calcPercentage()
        this.cdr.detectChanges()
      }
    });

    // detect changes if the liked state is changing (list does not rerender if stock is liked in the detailed view)
    this.updateStockListService.likedEvent.subscribe(selectedStock => {
      if(selectedStock === this.stock){
        this.cdr.detectChanges();
      }
    });
  }

  setInitialPrices(){ //sets price
    //set the current price to the latest in the list
    let data = this.stock.pricePointDtoList.map((entry: PricePoint) => entry.close);
    if(data[data.length - 1] != null){
      this.stock.currentPrice = data[data.length - 1].toFixed(2);
    } else {
      this.stock.currentPrice = this.stock.previousClosePrice
    }
    this.calcPercentage()
  }

  calcPercentage(){ //calcs percentage
    let difference: number = (this.stock.currentPrice - this.stock.previousClosePrice);
    let percent: number =  (difference / this.stock.previousClosePrice) * 100;
    this.stockPercentageGain = percent.toFixed(2);

    //format percentage
    if (percent < 0){ //percentage color
      this.percentageStyle = 'font-bold text-right text-red-700'
    }else {
      this.percentageStyle = 'font-bold text-right text-green-500'
    }
  }

  toggleLike() {//removes and adds stock to favourite
    // add or remove stock of the favourite list
    if(this.stock.liked){
      this.favouriteService.removeStockFromFavourite(this.stock.symbol).subscribe()
    } else if(!this.stock.liked){
      this.favouriteService.addStockToFavourite(this.stock).subscribe()
    }

    this.stock.liked = !this.stock.liked;
  }

  async openModal() { //opens the detail view
    const modal = await this.modalController.create({
      component: StockDetailCardComponent,
      componentProps: { // sends stock and percentage gain to detail
        stock: this.stock,
        stockPercentageGain: this.stockPercentageGain
      }
    });
    return await modal.present(); //opens modal
  }

}
