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


  constructor(private router: Router) { }

  ngOnInit() {}

  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  goToDetailedComponent() {
    this.router.navigate(['/app-stock-detail-card']);
  }
}
