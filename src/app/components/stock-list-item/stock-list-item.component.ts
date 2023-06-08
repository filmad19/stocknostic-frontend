import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Stock} from "../../shared/Stock";
import {ModalController} from "@ionic/angular";
import {StockDetailCardComponent} from "../stock-detail-card/stock-detail-card.component";
import {StockDataService} from "../../services/stock-data.service";
import {PricePoint} from "../../shared/PricePoint";
import {FavouriteService} from "../../services/favourite.service";

@Component({
  selector: 'app-stock-list-item',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],

})

export class StockListItemComponent implements OnInit {
  stockPercentageGain: string = '';
  percentageStyle: string = 'font-bold text-right'

  @Input() stock: Stock | any;

  constructor(private router: Router,
              private modalController: ModalController,
              private stockDataService: StockDataService,
              private favouriteService: FavouriteService) { }


  ngOnInit() {
    this.calcPercentage()
  }

  calcPercentage(){
    let data = this.stock.pricePointDtoList.map((entry: PricePoint) => entry.close);

    console.log(this.stock.symbol)
    console.log("Last Price: ", this.stock.previousClosePrice)
    console.log("current Price: ", data[data.length - 1])

    let difference: number = (data[data.length - 1] - this.stock.previousClosePrice);
    let percent: number =  (difference / this.stock.previousClosePrice) * 100;
    this.stockPercentageGain = percent.toFixed(2);

    if (percent < 0){
      this.percentageStyle = 'font-bold text-right text-red-700'
    }else {
      this.percentageStyle = 'font-bold text-right text-green-500'
    }
  }

  toggleLike() {
    this.favouriteService.toggleLiked(this.stock);
    this.stock.liked = !this.stock.liked;
  }

  async openModal() {
    console.log(this.stock)
    const modal = await this.modalController.create({
      component: StockDetailCardComponent,
      componentProps: {
        stock: this.stock,
        stockPercentageGain: this.stockPercentageGain
      }
    });
    return await modal.present();
  }
}
