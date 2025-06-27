import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BetService } from './bet.service';
import { environment } from 'src/environments/environment';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
})
export class BetComponent implements OnInit, OnDestroy, AfterViewInit {
  environment = environment; // Hacer el entorno disponible en la plantilla
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  team1Name = environment.team1Name;
  team2Name = environment.team2Name;

  statsValues: { [key: string]: number } = { ballenita: 0, both: 0, playas: 0 };
  winner: string = 'both';
  mount: number = 0;
  processing = false;

  // Eliminamos el plugin personalizado ya que usaremos chartjs-plugin-datalabels

  public barChartLegend = true;
  barChartPlugins: any[] = [ChartDataLabels];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [environment.team1Name, 'Empate', environment.team2Name],
    datasets: [
      {
        data: [this.statsValues['ballenita'], this.statsValues['both'], this.statsValues['playas']],
        label: 'USD',
        backgroundColor: [
          environment.team1GradientEnd,
          environment.tieGradientEnd,
          environment.team2GradientEnd
        ],
        borderColor: '#000',
        borderWidth: 1,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };

  // Usamos las opciones del entorno
  barChartOptions = environment.barChartOptions;

  constructor(private betService: BetService) { }

  ngOnInit(): void {
    // Forzar la actualización del gráfico
    setTimeout(() => {
      this.update_chart();
    }, 0);
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
    const proms$ = ['ballenita', 'both', 'playas'].map((_winner) => {
      return this.betService.getStats(_winner).then((_res) => {
        console.log(`${_winner} -> ${_res.sum}`);
        this.statsValues[_winner] = _res.sum;
        return _res.sum;
      });
    });

    Promise.all(proms$).then((values) => {
      console.log('Valores actualizados:', values);
      
      // Crear un nuevo objeto de datos para forzar la actualización
      const newData = [...values];
      
      // Actualizar los datos del gráfico
      if (this.chart && this.chart.data && this.chart.data.datasets) {
        this.chart.data.datasets[0].data = newData;
        this.chart.update();
      }
    }).catch(error => {
      console.error('Error al actualizar el gráfico:', error);
    });
  }
}

