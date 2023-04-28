import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Stock} from "../../shared/Stock";
import {ModalController} from "@ionic/angular";
import {StockDetailCardComponent} from "../stock-detail-card/stock-detail-card.component";

@Component({
  selector: 'app-stock-list-item',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],

})

export class StockListItemComponent implements OnInit {
  @Input() stock: Stock | any;
  favourites: Stock[] = [];

  constructor(private router: Router,
              private modalController: ModalController ) { }

  ngOnInit() {

  }

  toggleLike() {
    this.stock.liked = !this.stock.liked;

    if (this.stock.liked){
      this.favourites.push(this.stock);
    }else {
      this.favourites.splice(this.stock);
    }
  }

  // async goToDetailedComponent() {
  //   this.router.navigate(['/app-stock-detail-card'], { state: { data: this.stock } });
  //
  // //   const modal = await this.modalCtrl.create({
  // //     component: StockDetailCardComponent,
  // //   });
  // //
  // //   modal.present();
  // //
  // //   const { data, role } = await modal.onWillDismiss();
  // }

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
