import { Component, computed, inject } from '@angular/core';
import {
  GridsterModule,
  GridsterConfig,
  GridsterItem,
} from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../services/reports.service';
import { ChartViewerComponent } from '../../components/chart-viewer/chart-viewer.component';
import { NgxEchartsModule } from 'ngx-echarts';

interface MyGridsterItem extends GridsterItem {
  title: string;
  type: string; // 'bar', 'pie', etc.
  data: any; // datos para ECharts
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    GridsterModule,
    ChartViewerComponent,
    NgxEchartsModule,
  ],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  options: GridsterConfig = {
    draggable: { enabled: true, stop: () => this.recalculateGrid() },
    resizable: { enabled: true, stop: () => this.recalculateGrid() },
    pushItems: true, // move other items automatically
    swap: true, // let change position of items
    compactType: 'compactUp&Left', // reorganize items to the top and left , aboid empty spaces
    margin: 10,
    minCols: 12,
    maxCols: 12,
    minRows: 1,
    maxRows: 12,
    defaultItemCols: 2,
    defaultItemRows: 2,
    rowHeight: 150, // hight of each row
  };

  dashboard: MyGridsterItem[] = [];
  private reportsService = inject(ReportsService);

  reportsQuery = this.reportsService.reportsQuery;

  charts = computed(() => this.reportsQuery.data() ?? []);
  loading = computed(() => this.reportsQuery.isLoading());
  error = computed(() => this.reportsQuery.error());

  constructor() {
    const chartMock = {
      title: 'Riesgos por Categoría',
      type: 'bar',
      data: {
        xAxis: {
          type: 'category',
          data: [
            'Legal',
            'Financiero',
            'Operativo',
            'Reputacional',
            'Tecnológico',
          ],
        },
        yAxis: { type: 'value' },
        series: [
          {
            data: [50, 80, 60, 90, 30],
            type: 'bar',
            itemStyle: { color: '#3b82f6' },
          },
        ],
      },
    };

    // repetir 10 veces
    for (let i = 0; i < 10; i++) {
      this.dashboard.push({
        cols: 2,
        rows: 2,
        y: 0,
        x: i % 12,
        title: chartMock.title,
        type: chartMock.type,
        data: chartMock.data,
      });
    }
  }

  addCard() {
    const id = this.dashboard.length + 1;
    this.dashboard.push({
      cols: 2,
      rows: 2,
      y: 0,
      x: 0,
      title: `Nuevo ${id}`,
      type: 'bar',
      data: {
        xAxis: {
          type: 'category',
          data: [
            'Legal',
            'Financiero',
            'Operativo',
            'Reputacional',
            'Tecnológico',
          ],
        },
        yAxis: { type: 'value' },
        series: [
          {
            data: [50, 80, 60, 90, 30],
            type: 'bar',
            itemStyle: { color: '#3b82f6' },
          },
        ],
      },
    });
    this.recalculateGrid();
  }

  removeCard(index: number) {
    this.dashboard.splice(index, 1);
    this.recalculateGrid();
  }

  recalculateGrid() {
    this.dashboard = [...this.dashboard];
  }

  chartData = {
    id: 1,
    type: 'bar',
    title: 'Riesgos por Categoría',
    data: {
      xAxis: {
        type: 'category',
        data: [
          'Legal',
          'Financiero',
          'Operativo',
          'Reputacional',
          'Tecnológico',
        ],
      },
      yAxis: { type: 'value' },
      series: [
        {
          data: [50, 80, 60, 90, 30],
          type: 'bar',
          itemStyle: { color: '#3b82f6' },
        },
      ],
    },
  };
}
