import { Component, computed, inject } from '@angular/core';
import {
  GridsterModule,
  GridsterConfig,
  GridsterItem,
} from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../services/reports.service';

interface MyGridsterItem extends GridsterItem {
  title: string;
  image: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, GridsterModule],
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
    // create cards
    for (let i = 1; i <= 10; i++) {
      this.dashboard.push({
        cols: 2,
        rows: 2,
        y: 0,
        x: (i - 1) % 12,
        title: `Reporte ${i}`,
        image: `https://picsum.photos/seed/${i}/600/400`,
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
      image: `https://picsum.photos/seed/${id}/600/400`,
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
}
