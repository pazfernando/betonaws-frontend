import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BetService } from './bet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
})
export class BetComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  team1Name = environment.team1Name;
  team2Name = environment.team2Name;

  statsValues: { [key: string]: number } = { ballenita: 0, both: 0, playas: 0 };
  winner: string = 'both';
  mount: number = 0;
  processing = false;

  barChartValuePlugin = {
    id: 'barChartValuePlugin',
    afterDatasetsDraw(chart: any, args: any, options: any) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar: any, index: number) => {
          const data = Math.trunc(dataset.data[index]);
          ctx.fillStyle = '#000'; // Color del texto
          ctx.font = '12px Arial'; // Fuente del texto
          const position = bar.tooltipPosition();
          ctx.fillText(data, position.x, position.y - 5);
        });
      });
    },
  };

  public barChartLegend = true;
  barChartPlugins: ChartConfiguration<'bar'>['plugins'] = [this.barChartValuePlugin];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [environment.team1Name, 'Empate', environment.team2Name],
    datasets: [
      {
        data: [this.statsValues['ballenita'], this.statsValues['both'], this.statsValues['playas']],
        label: 'Bets USD',
      }
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top', // Opcional: 'top', 'bottom', 'left', 'right'
        labels: {
          font: {
            size: 12, // Tamaño de fuente de las etiquetas de la leyenda
          },
          color: '#000', // Color de las etiquetas de la leyenda
        },
      },
      tooltip: {
        enabled: true, // Habilita las tooltips si las necesitas
      },
    },
  };

  constructor(private betService: BetService) { }

  ngOnInit(): void {
    if (this.chart) {
      this.chart.legend = this.barChartLegend;
      this.chart.plugins = this.barChartPlugins;
      this.chart.data = this.barChartData;
      this.chart.options = this.barChartOptions;
    }

    this.update_chart();
  }

  ngAfterViewInit(): void {
    this.setChartGradient();
  }

  ngOnDestroy(): void { }

  setChartGradient(): void {
    if (this.chart?.chart?.ctx && this.chart?.chart?.chartArea) {
      const chart = this.chart.chart;
      const { ctx, chartArea } = chart;

      const gradient1 = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient1.addColorStop(0, environment.team1GradientStart);
      gradient1.addColorStop(1, environment.team1GradientEnd);

      const gradient2 = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient2.addColorStop(0, environment.tieGradientStart);
      gradient2.addColorStop(1, environment.tieGradientEnd);

      const gradient3 = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient3.addColorStop(0, environment.team2GradientStart);
      gradient3.addColorStop(1, environment.team2GradientEnd);

      this.barChartData.datasets[0].backgroundColor = [gradient1, gradient2, gradient3];
      this.chart.update();
    }
  }

  bet = () => {
    console.log('TODO send to API gateway');
    this.processing = true;
    this.betService
      .pushBet(this.winner, this.mount)
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => {
          console.error(e);
          this.processing = false;
        },
        complete: () => {
          console.info('bet complete.');
          this.update_chart();
          this.processing = false;
        }
      });
  };

  update_chart = () => {
    let pos = 0;
    let proms$ = new Array();
    ['ballenita', 'both', 'playas'].forEach((_winner) => {
      let prom$ = this.betService.getStats(_winner);
      proms$.push(prom$);
      prom$.then((_res) => {
        console.log(_winner + ' -> ' + _res.sum + ', pos=' + pos);
        this.statsValues[_winner] = _res.sum;
      });
    });
    Promise.all(proms$).then((_values) => {
      this.barChartData.datasets[0].data = [this.statsValues['ballenita'], this.statsValues['both'], this.statsValues['playas']];
      console.log(this.barChartData.datasets[0].data);
      this.chart?.update();
    });
  }
}

