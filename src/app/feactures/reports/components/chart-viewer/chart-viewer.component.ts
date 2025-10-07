import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  RadarComponent,
  ToolboxComponent,
} from 'echarts/components';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  HeatmapChart,
  RadarChart,
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  RadarComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  HeatmapChart,
  RadarChart,
  CanvasRenderer,
]);

@Component({
  selector: 'app-chart-viewer',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './chart-viewer.component.html',
  styleUrls: ['./chart-viewer.component.css'],
})
export class ChartViewerComponent implements OnInit {
  @Input() title!: string;
  @Input() options!: any;
  @Input() type!: string;

  chartOptions: any;

  ngOnInit() {
    // Opcional: puedes agregar configuración global aquí
    this.chartOptions = this.options;
  }
}
