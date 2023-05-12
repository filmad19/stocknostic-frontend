import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Stock} from "../../shared/Stock";
import {ModalController} from "@ionic/angular";
import {StockDetailCardComponent} from "../stock-detail-card/stock-detail-card.component";
import {StockDataService} from "../../services/stock-data.service";

@Component({
  selector: 'app-stock-list-item',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],

})

export class StockListItemComponent implements OnInit {
  @Input() stock: Stock | any;

  constructor(private router: Router,
              private modalController: ModalController,
              private stockDataService: StockDataService, ) { }

  ngOnInit() {

  }

  toggleLike() {
    this.stockDataService.toggleLiked(this.stock);
    this.stock.liked = !this.stock.liked;
  }

  async openModal() {
    console.log(this.stock)
    const modal = await this.modalController.create({
      component: StockDetailCardComponent,
      componentProps: {
        stock: this.stock
      }
    });
    return await modal.present();
  }
}
