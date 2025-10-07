import { Component, Input } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-chart-viewer',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './chart-viewer.component.html',
  styleUrls: ['./chart-viewer.component.css'],
})
export class ChartViewerComponent {
  @Input() title: string = '';
  @Input() options: any = {};
  @Input() type: string = '';
}
