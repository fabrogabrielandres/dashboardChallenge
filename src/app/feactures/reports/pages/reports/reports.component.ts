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
import { GraphData } from '../../interfaces/charts.interface';

interface MyGridsterItem extends GridsterItem {
  title: string;
  type: string;
  data: GraphData;
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

  /** Actualiza el grid activo sin resetear posiciones */
  private updateDisplayedGrid() {
    const visible = this.queryClient.getQueryData<MyGridsterItem[]>(['visibleCards']) || [];
    const hidden = this.queryClient.getQueryData<MyGridsterItem[]>(['hiddenCards']) || [];

    const current = this.isHidden() ? hidden : visible;
    this.dashboard.set(current);
  }

  /** Resetea posiciones y tamaño del grid activo */
  private resetDisplayedGrid() {
    const visible = this.queryClient.getQueryData<MyGridsterItem[]>(['visibleCards']) || [];
    const hidden = this.queryClient.getQueryData<MyGridsterItem[]>(['hiddenCards']) || [];

    const normalized = this.isHidden() ? this.resetPositions(hidden) : this.resetPositions(visible);
    this.dashboard.set(normalized);

    // Guardar el reset en el QueryClient
    if (this.isHidden()) {
      this.queryClient.setQueryData(['hiddenCards'], normalized);
    } else {
      this.queryClient.setQueryData(['visibleCards'], normalized);
    }
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

  /** Cambiar visibilidad de una tarjeta sin resetear el grid */
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
      this.queryClient.setQueryData(['hiddenCards'], updatedHidden);
      this.queryClient.setQueryData(['visibleCards'], updatedVisible);
    } else {
      // actualmente en visibles → mover a ocultas
      updatedVisible = visible.filter(c => c.title !== item.title);
      updatedHidden.push(resized);
      this.queryClient.setQueryData(['visibleCards'], updatedVisible);
      this.queryClient.setQueryData(['hiddenCards'], updatedHidden);
    }

    this.updateDisplayedGrid(); // solo refresca, no resetea
  }

  togglePanel() {
    this.isPanelOpen.update(v => !v);
  }

  /** Cambiar vista de visibles/ocultas */
  setOption(value: boolean) {
    const prev = this.isHidden();
    this.isHidden.set(value);
    this.isPanelOpen.set(false);

    // Solo resetea si cambió de grid
    if (prev !== value) {
      this.resetDisplayedGrid();
    } else {
      this.updateDisplayedGrid(); // solo refresca sin reset
    }
  }
}
