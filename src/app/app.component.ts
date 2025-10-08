import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { CommonModule } from '@angular/common';
echarts.use([BarChart, GridComponent, CanvasRenderer]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [provideEchartsCore({ echarts })],
})
export class AppComponent {}
