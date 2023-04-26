import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stock-list-item',
  templateUrl: './stock-list-item.component.html',
  styleUrls: ['./stock-list-item.component.scss'],

})

export class StockListItemComponent implements OnInit {
  icon_style = 'heart-outline'
  @Input() isLiked: boolean = false;
  @Input() result: any;
  favourites: any = [];

  constructor(private router: Router) { }

  ngOnInit() {

  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.result.liked = this.isLiked;
    if (this.result.liked){
      this.favourites.push(this.result);
    }else {
      this.favourites.splice(this.result);
    }
    console.log("favourites" + this.favourites)
    console.log(this.result)
  }

  goToDetailedComponent() {
    this.router.navigate(['/app-stock-detail-card'], { state: { data: this.result } });
  }
}
