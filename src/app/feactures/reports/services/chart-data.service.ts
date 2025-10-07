export function fackeEndpoint(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const charts = [
        {
          id: 1,
          type: 'bar',
          title: 'Riesgos por Categoría',
          data: barData(),
        },
        {
          id: 2,
          type: 'pie',
          title: 'Distribución de Riesgos',
          data: pieData(),
        },
        {
          id: 3,
          type: 'line',
          title: 'Evolución Temporal',
          data: lineData(),
        },
        {
          id: 4,
          type: 'radar',
          title: 'Comparativa Departamental',
          data: radarData(),
        },
        {
          id: 5,
          type: 'scatter',
          title: 'Matriz de Riesgos',
          data: scatterData(),
        },
        {
          id: 6,
          type: 'gauge',
          title: 'Nivel Global de Riesgo',
          data: gaugeData(),
        },
        {
          id: 7,
          type: 'heatmap',
          title: 'Mapa de Calor',
          data: heatmapData(),
        },
        {
          id: 8,
          type: 'bar',
          title: 'Costos por Riesgo',
          data: barData(true),
        },
        {
          id: 9,
          type: 'line',
          title: 'Riesgos Emergentes',
          data: lineData(true),
        },
        {
          id: 10,
          type: 'pie',
          title: 'Tipos de Riesgo',
          data: pieData(true),
        },
      ];
      resolve(charts);
    }, 1000);
  });
}

function barData(alt = false) {
  return {
    xAxis: {
      type: 'category',
      data: ['Legal', 'Financiero', 'Operativo', 'Reputacional', 'Tecnológico'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: alt ? [25, 60, 40, 70, 50] : [50, 80, 60, 90, 30],
        type: 'bar',
        itemStyle: { color: alt ? '#22c55e' : '#3b82f6' },
      },
    ],
  };
}

function pieData(alt = false) {
  return {
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 35, name: 'Alto' },
          { value: 25, name: 'Medio' },
          { value: 15, name: 'Bajo' },
          { value: 25, name: alt ? 'Crítico' : 'Controlado' },
        ],
      },
    ],
  };
}

function lineData(alt = false) {
  return {
    xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May'] },
    yAxis: { type: 'value' },
    series: [
      {
        data: alt ? [10, 40, 30, 60, 70] : [20, 50, 35, 80, 90],
        type: 'line',
        smooth: true,
        lineStyle: { color: alt ? '#facc15' : '#ef4444' },
      },
    ],
  };
}

function radarData() {
  return {
    radar: {
      indicator: [
        { name: 'Legal', max: 100 },
        { name: 'Finanzas', max: 100 },
        { name: 'IT', max: 100 },
        { name: 'Operaciones', max: 100 },
        { name: 'RRHH', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [{ value: [80, 90, 70, 85, 75], name: 'Riesgos 2025' }],
      },
    ],
  };
}

function scatterData() {
  return {
    xAxis: { name: 'Probabilidad', min: 0, max: 5 },
    yAxis: { name: 'Impacto', min: 0, max: 5 },
    series: [
      {
        type: 'scatter',
        data: [
          [1, 2],
          [2, 4],
          [3, 3],
          [4, 5],
          [5, 4],
        ],
        itemStyle: { color: '#ef4444' },
      },
    ],
  };
}

function gaugeData() {
  return {
    series: [
      {
        type: 'gauge',
        progress: { show: true },
        detail: { valueAnimation: true, formatter: '{value}%' },
        data: [{ value: 65, name: 'Nivel' }],
      },
    ],
  };
}

function heatmapData() {
  const data = [];
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 6; j++)
      data.push([i, j, Math.round(Math.random() * 10)]);
  return {
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E', 'F'] },
    yAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6'] },
    visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal' },
    series: [
      {
        name: 'Riesgos',
        type: 'heatmap',
        data,
        emphasis: { itemStyle: { shadowBlur: 10 } },
      },
    ],
  };
}
