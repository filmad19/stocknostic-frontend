import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {ChartConfiguration, ChartOptions} from 'chart.js';
import {Interval} from "../../shared/Interval";
import {Router} from "@angular/router";
import {Stock} from "../../shared/Stock";
import {PricePoint} from "../../shared/PricePoint";
import {ModalController} from "@ionic/angular";
import {FavouriteService} from "../../services/favourite.service";
import {UserService} from "../../services/user.service";
import {UpdateStockListService} from "../../services/update-stock-list.service";
import {IndicatorService} from "../../services/indicator.service";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-stock-detail-card',
  templateUrl: './stock-detail-card.component.html',
  styleUrls: ['./stock-detail-card.component.scss'],
  providers: [DecimalPipe]
})
/*
  Stefan Ghergheles
  14.05.2023
 */
export class StockDetailCardComponent implements OnInit {
  currentInterval = Interval.day;
  closePrices: number[] = []

  percentageStyle: string = '';
  recommendationStyle: string = ''
  recomendationDesc: string = ''
  graphColor: string = '';

  date: string = '';
  showDate = false;
  divDateStyle = 'flex text-xs flex-row justify-center visible'
  unformattedLabel = [];
  oversoldLimit = 30;
  overboughtLimit = 70;

  button1 = 'solid'
  button2 = 'outline'
  button3 = 'outline'
  button4 = 'outline'
  button5 = 'outline'
  button6 = 'outline'
  button7 = 'outline'


  constructor(private stockDataService: StockDataService,
              private router: Router,
              private modalCtrl: ModalController,
              private modalController: ModalController,
              private favouriteService: FavouriteService,
              private updateStockListService: UpdateStockListService,
              private userService: UserService,
              private indicatorService: IndicatorService,
              private cdr: ChangeDetectorRef) {
  }

  stock: Stock | any;
  recommendation: string | any;
  stockPercentageGain: string | any;


  @ViewChild('canva') canvasRef: ElementRef | any;

  ngOnInit() {
    // get rsi configuration
    this.stockDataService.getRsi(this.stock.symbol).subscribe(response => {
      this.recommendation = response.rsi.toFixed(2);
      this.getRsiConfig(); //gets RSI
    });

    // recalculate the percentage gain/loss
    this.updateStockListService.priceWebsocketEvent.subscribe(selectedStock => {
      if(selectedStock === this.stock){
        this.stock.currentPrice = selectedStock.currentPrice
        this.calcPercentage()
        this.cdr.detectChanges()
      }
    });
  }

  ngAfterViewInit() {
    let ctx = this.canvasRef.nativeElement.getContext('2d');

    this.stockDataService.getStockPriceHistory(this.stock.symbol, this.currentInterval).subscribe(response => {
      this.chartLabels = response.map((entry: PricePoint) => entry.timestamp); //gets stockhistory

      if (this.currentInterval != Interval.day) { //for labels
        this.formatLabels(false);
      } else {
        this.formatLabels(true);
      }

      this.closePrices = response.map((entry: PricePoint) => entry.close);
      this.calcPercentage()
      // const gradient = ctx.createLinearGradient(0, 0, 0, 450);
      // gradient.addColorStop(0, 'rgb(0,255,0)');
      // gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

      this.chartData = [
        {
          label: this.stock.currency,
          data: this.closePrices,

          pointHitRadius: 15, // expands the hover 'detection' area
          pointHoverRadius: 8, // grows the point when hovered
          pointRadius: 0,

          borderColor: this.graphColor, // main line color aka $midnight-medium from @riapacheco/yutes/seasonal.scss
          pointBackgroundColor: this.graphColor,
          // pointHoverBackgroundColor: '$success',

          borderWidth: 2, // main line width
          hoverBorderWidth: 0, // borders on points
          pointBorderWidth: 0, // removes POINT borders
          tension: 0.3, // makes line more squiggly

          // backgroundColor: gradient,

          scripts: "node_modules/chart.js/dist/Chart.min.js",
          allowedCommonJsDependencies: "chart.js",
        }
      ];
    });
  }


  chartLabels: string[] | any;
  chartData: ChartConfiguration<'line'>['data'] | any;
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        // ⤵️ tooltip main styles
        backgroundColor: 'white',
        displayColors: false, // removes unnecessary legend
        padding: 10,

        // ⤵️ title
        titleColor: '#2D2F33',
        titleFont: {
          size: 18
        },

        // ⤵️ body
        bodyColor: '#2D2F33',
        bodyFont: {
          size: 13
        }
      }
    },
  };

  dismissModal() {
    this.modalController.dismiss(); //metod for closing detailed view
  }

  toggleLike() {
    if (this.stock.liked) {
      this.favouriteService.removeStockFromFavourite(this.stock.symbol).subscribe() //adds or removes stock from favourite
    } else if (!this.stock.liked) {
      this.favouriteService.addStockToFavourite(this.stock).subscribe(response => {
        //load the rsi config, because the config is only available when the stock is liked
        this.getRsiConfig();
      })
    }

    this.stock.liked = !this.stock.liked;
    this.updateStockListService.likedEvent.emit(this.stock);
  }

  interval(interval: string) {
    //method for interval buttons (graph buttons)
    this.button1 = 'outline'
    this.button2 = 'outline'
    this.button3 = 'outline'
    this.button4 = 'outline'
    this.button5 = 'outline'
    this.button6 = 'outline'
    this.button7 = 'outline'

    switch (interval) {
      case 'week':
        this.currentInterval = Interval.week;
        this.showDate = false;
        this.button2 = 'solid'
        break;

      case 'month':
        this.currentInterval = Interval.month;
        this.showDate = false;
        this.button3 = 'solid'

        break;

      case 'month3':
        this.currentInterval = Interval.month3;
        this.showDate = false;
        this.button4 = 'solid'

        break;

      case 'year':
        this.currentInterval = Interval.year;
        this.showDate = false;
        this.button5 = 'solid'

        break;

      case 'year5':
        this.currentInterval = Interval.year5;
        this.showDate = false;
        this.button6 = 'solid'

        break;

      case 'year20':
        this.currentInterval = Interval.year20;
        this.showDate = false;
        this.button7 = 'solid'
        break;

      default:
        this.currentInterval = Interval.day;
        this.showDate = true;
        this.button1 = 'solid'
        break;
    }

    if (this.showDate) { //displays date when user presses on day graphbutton
      this.divDateStyle = 'flex text-xs flex-row justify-center visible'
    } else {
      this.divDateStyle = 'flex text-xs flex-row justify-center invisible'
    }
    this.ngAfterViewInit()

  }

  formatLabels(day: boolean) { //method for formating labels of graph
    const formattedLabels: string[] = [];
    let index: number;
    this.unformattedLabel = this.chartLabels; // gets the unformatted labels example for a label 12-07-2023T10:30

    if (!day) {//if graph of day
      index = 0;
    } else {
      index = 1;
    }

    for (const label of this.chartLabels) {
      const formattedLabel = label.split("T")[index]; //splits the label on T
      this.date = label.split("T")[0]; //gets the date incase the user selects the date button
      formattedLabels.push(formattedLabel); //put formated label on list
    }

    this.chartLabels = formattedLabels; //sets the formatted labels
  }

  calcPercentage() {
    let previousePrice = this.stock.previousClosePrice

    if (this.currentInterval != Interval.day) {
      //the previousClosePrice is yesterday's closing price,
      // so for 1 month the first element of the list has to be taken for percentage gain
      previousePrice = this.closePrices[0]
    }

    //percentage calculation
    let difference: number = (this.stock.currentPrice - previousePrice);
    let percent: number = (difference / previousePrice) * 100;
    this.stockPercentageGain = percent.toFixed(2);

    //styling the gain/loss
    if (percent < 0) {
      this.percentageStyle = 'text-red-700'
      this.graphColor = "red"
    } else {
      this.percentageStyle = 'text-green-500'
      this.graphColor = "green"
    }
  }


  getRsiConfig() {
    //get the rsi configuration parameters
    this.indicatorService.getRsiConfiguration(this.stock.symbol).subscribe(response => {
      this.overboughtLimit = response.overbought;
      this.oversoldLimit = response.oversold;
      this.setRecommendation();
    });
  }

  setRsiConfig() {
    this.indicatorService.setRsiConfiguration(this.oversoldLimit, this.overboughtLimit, this.stock.symbol).subscribe(response => {
      this.setRecommendation(); //sends RSI to Backend and set the Information
    });
  }

  setRecommendation() {
    if (this.recommendation < this.oversoldLimit) { //formating function with tailwind css code
      this.recomendationDesc = "buy"
      this.recommendationStyle = 'font-bold text-green-500 ml-auto'
    } else if (this.recommendation > this.overboughtLimit) {
      this.recomendationDesc = "sell"
      this.recommendationStyle = 'font-bold text-red-700 ml-auto'
    } else {
      this.recomendationDesc = "hold"
      this.recommendationStyle = 'font-bold text-grey-500 ml-auto'
    }
  }
}
