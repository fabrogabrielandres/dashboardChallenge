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

  // TanStack Query para cargar los datos (solo una vez)
  reportsQuery = this.reportsService.reportsQuery;

  // Signal local editable que se inicializa con los datos del query
  dashboard = signal<MyGridsterItem[]>([]);

  // Computed para loading y error
  loading = computed(() => this.reportsQuery.isLoading());
  error = computed(() => this.reportsQuery.error());

  // Configuración del grid
  options: GridsterConfig = {
    draggable: { enabled: true, stop: () => this.saveLayout() },
    resizable: { enabled: true, stop: () => this.saveLayout() },
    pushItems: true,
    swap: true,
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
    // Inicializamos dashboard solo una vez con los datos del servicio
    effect(() => {
      const data = this.reportsQuery.data();
      if (data && this.dashboard().length === 0) {
        this.dashboard.set([...data]);
      }
    });
  }

  /** Guardar los cambios en el grid localmente y en el cache de TanStack */
  saveLayout() {
    const updatedLayout = [...this.dashboard()];
    this.dashboard.set(updatedLayout);

    // También actualizamos el cache de TanStack (sin refetch)
    this.queryClient.setQueryData(['reports'], updatedLayout);
  }

  /** Eliminar una tarjeta */
  removeCard(index: number) {
    const updated = this.dashboard().filter((_, i) => i !== index);
    this.dashboard.set(updated);
    this.queryClient.setQueryData(['reports'], updated);
  }

  /** Agregar una nueva tarjeta */
  addCard() {
    const newCard: MyGridsterItem = {
      cols: 2,
      rows: 2,
      y: 0,
      x: 0,
      title: `Nuevo ${this.dashboard().length + 1}`,
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

    const updated = [...this.dashboard(), newCard];
    this.dashboard.set(updated);
    this.queryClient.setQueryData(['reports'], updated);
  }

   isHidden = signal(true); // true = “No mostrar”, false = “Mostrar”
  isPanelOpen = signal(false); // controla si el panel está desplegado

  togglePanel() {
    this.isPanelOpen.update(open => !open);
  }

  setOption(value: boolean) {
    this.isHidden.set(value);
    this.isPanelOpen.set(false); // cierra el panel al seleccionar
  }
}
