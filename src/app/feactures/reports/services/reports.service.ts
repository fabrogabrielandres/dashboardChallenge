import { Injectable } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getReports } from '../actions/get-reports';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  reportsQuery = injectQuery(() => ({
    queryKey: ['reports'],
    queryFn: () => getReports(),
    staleTime: Infinity, // nunca se considera "viejo" hasta recargar
    gcTime: Infinity, // nunca limpia el cache mientras esté en memoria
    refetchOnWindowFocus: false, // no vuelve a pedir al cambiar de pestaña
    refetchOnReconnect: false,
  }));
}
