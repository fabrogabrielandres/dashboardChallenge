import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridsterModule,
  GridsterConfig,
  GridsterItem,
} from 'angular-gridster2';
import { ReportsService } from '../../services/reports.service';
import { ChartViewerComponent } from '../../components/chart-viewer/chart-viewer.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { QueryClient } from '@tanstack/angular-query-experimental';

interface MyGridsterItem extends GridsterItem {
  title: string;
  type: string;
  data: any;
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
  private reportsService = inject(ReportsService);
  private queryClient = inject(QueryClient);

  reportsQuery = this.reportsService.reportsQuery;

  dashboard = signal<MyGridsterItem[]>([]);

  loading = computed(() => this.reportsQuery.isLoading());
  error = computed(() => this.reportsQuery.error());

  // false = mostrar visibles, true = mostrar ocultas
  isHidden = signal(false);
  isPanelOpen = signal(false);

  options: GridsterConfig = {
    draggable: { enabled: true, stop: () => this.saveLayout() },
    resizable: { enabled: true, stop: () => this.saveLayout() },
    pushItems: true,
    swap: false,
    compactType: 'compactUp&Left',
    margin: 10,
    minCols: 12,
    maxCols: 12,
    minRows: 12,
    maxRows: 12,
    defaultItemCols: 3,
    defaultItemRows: 3,
    rowHeight: 150,
  };

  constructor() {
    effect(() => {
      const data = this.reportsQuery.data();
      if (data && !this.queryClient.getQueryData(['visibleCards'])) {
        this.queryClient.setQueryData(['visibleCards'], [...data]);
        this.queryClient.setQueryData(['hiddenCards'], []);
      }
      this.updateDisplayedGrid();
    });

    effect(() => {
      this.updateDisplayedGrid();
    });
  }

  /** Resetea posiciones y tamaño */
  private resetPositions(cards: MyGridsterItem[]): MyGridsterItem[] {
    return cards.map((card, index) => ({
      ...card,
      x: (index * 3) % 12,
      y: Math.floor((index * 3) / 12) * 3,
      cols: 3,
      rows: 3,
    }));
  }

  /** Actualiza el grid activo y formatea solo este */
  private updateDisplayedGrid() {
    const visible = this.queryClient.getQueryData<MyGridsterItem[]>(['visibleCards']) || [];
    const hidden = this.queryClient.getQueryData<MyGridsterItem[]>(['hiddenCards']) || [];

    // Formatea el grid activo para que aparezca ordenado
    const normalized = this.isHidden() ? this.resetPositions(hidden) : this.resetPositions(visible);
    this.dashboard.set(normalized);
  }

  saveLayout() {
    const current = [...this.dashboard()];
    if (this.isHidden()) {
      this.queryClient.setQueryData(['hiddenCards'], current);
    } else {
      this.queryClient.setQueryData(['visibleCards'], current);
    }
  }

  removeCard(index: number) {
    const updated = this.dashboard().filter((_, i) => i !== index);
    this.dashboard.set(updated);
    this.saveLayout();
  }

  toggleCardVisibility(item: MyGridsterItem) {
    const visible = this.queryClient.getQueryData<MyGridsterItem[]>(['visibleCards']) || [];
    const hidden = this.queryClient.getQueryData<MyGridsterItem[]>(['hiddenCards']) || [];
    const resized = { ...item, cols: 3, rows: 3 };

    let updatedVisible = [...visible];
    let updatedHidden = [...hidden];

    if (this.isHidden()) {
      // actualmente en ocultas → mover a visibles
      updatedHidden = hidden.filter(c => c.title !== item.title);
      updatedVisible.push(resized);
      this.queryClient.setQueryData(['hiddenCards'], updatedHidden); // NO resetear
      this.queryClient.setQueryData(['visibleCards'], updatedVisible); // solo el activo se resetea
    } else {
      updatedVisible = visible.filter(c => c.title !== item.title);
      updatedHidden.push(resized);
      this.queryClient.setQueryData(['visibleCards'], updatedVisible);
      this.queryClient.setQueryData(['hiddenCards'], updatedHidden);
    }

    this.updateDisplayedGrid(); // resetear solo el grid activo
  }

  isCardHidden(card: MyGridsterItem): boolean {
    const hidden = this.queryClient.getQueryData<MyGridsterItem[]>(['hiddenCards']) || [];
    return hidden.some(h => h.title === card.title);
  }

  togglePanel() {
    this.isPanelOpen.update(v => !v);
  }

  setOption(value: boolean) {
    this.isHidden.set(value);
    this.isPanelOpen.set(false);
    // Cada vez que cambias de grid, formatea ambos
    this.updateDisplayedGrid();
  }
}
