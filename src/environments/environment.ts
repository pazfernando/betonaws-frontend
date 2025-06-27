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
  // Bar chart configuration - Configuración simplificada
  barChartOptions: {
    responsive: true,
    indexAxis: 'x',
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'USD'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Apuestas por Equipo'
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value: number) => value > 0 ? `${value}` : ''
      }
    }
  } as const,
  // apiEndpoint: 'https://gyvd9xt7b9.execute-api.us-east-1.amazonaws.com/test'  // Endpoint para desarrollo
  apiEndpoint: 'https://uvji2s0or5.execute-api.us-east-1.amazonaws.com/prod/'
};