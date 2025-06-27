export const environment = {
  production: false,
  team1Name: 'Colombia',
  team2Name: 'Bolivia',
  team1Flag: 'assets/flags/colombia.png',
  team2Flag: 'assets/flags/bolivia.png',
  // Gradient for Team 1
  team1GradientStart: '#FFFF00',
  team1GradientEnd: '#FF0000',
  // Gradient for Tie
  tieGradientStart: '#808080',
  tieGradientEnd: '#404040',
  // Gradient for Team 2
  team2GradientStart: '#008000',
  team2GradientEnd: '#00FF00',
  // Bar chart configuration
  barChartOptions: {
    responsive: true,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.parsed.x} USD`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value: number) => {
          return `${value} USD`;
        },
        color: '#000',
        font: {
          weight: 'bold'
        }
      }
    },
    // Asegurarse de que las barras tengan un ancho fijo
    barThickness: 30,
    // Añadir espacio entre las barras
    barPercentage: 0.8,
    categoryPercentage: 0.8
  },
  // apiEndpoint: 'https://gyvd9xt7b9.execute-api.us-east-1.amazonaws.com/test'  // Endpoint para desarrollo
  apiEndpoint: 'https://uvji2s0or5.execute-api.us-east-1.amazonaws.com/prod/'
};