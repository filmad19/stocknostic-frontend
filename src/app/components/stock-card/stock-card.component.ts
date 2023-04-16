import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {ChartConfiguration, ChartOptions} from "chart.js";

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss'],
})
export class StockCardComponent  implements OnInit {

  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(private stockDataService: StockDataService) {}

  @ViewChild('chart') canvasRef: ElementRef | any;
  // private ctx: CanvasRenderingContext2D | any;



  // ngAfterViewInit
  ngOnInit() {
    // this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.stockDataService.getStockData('BTCUSDT', "1m").subscribe(response => {
      // response = response.slice(0, 10);
      this.chartLabels = response.map((entry: any) => entry[0]%100_000/10_000);
      this.chartData = response.map((entry: any) => entry[1]);
      console.log("lables")
      console.log(this.chartLabels)
      console.log("lablesd")
      console.log(this.chartData)

      // const gradient = this.ctx.createLinearGradient(0, 0, 0, 450);
      // gradient.addColorStop(0, 'rgba(74, 20, 140, 0.1)');
      // gradient.addColorStop(0.5, 'rgba(74, 20, 140, 0.05)');
      // gradient.addColorStop(1, 'rgba(74, 20, 140, 0)');


      this.lineChartData = {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.chartData,
            label: 'AAPL',
            fill: true,
            tension: 0.5,
            borderColor: '#4a148c',
            borderWidth: 2,
            // backgroundColor: 'green',
            pointRadius: 0,
          },
        ],
        options: {
          aspectRatio: 3,
          plugins: {
            title: {
              display: true,
              text: 'BTC/USDT Price Chart',
              font: {
                size: 20,
                weight: 'bold',
              }
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
                font: {
                  size: 16,
                  weight: 'bold',
                }
              },
              grid: {
                display: true,
                color: '#bdbdbd',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)',
                font: {
                  size: 16,
                  weight: 'bold',
                }
              },
              grid: {
                display: true,
                color: '#bdbdbd',
              },
            }
          },
          scripts: [
            "node_modules/chart.js/dist/Chart.min.js"
          ],
          allowedCommonJsDependencies: [
            "chart.js"
          ]
        }
      };
    });
  }



  public lineChartData: ChartConfiguration<'line'>['data'] | any;
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;


}
