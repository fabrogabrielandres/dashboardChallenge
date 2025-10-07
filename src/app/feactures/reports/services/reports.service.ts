import { Injectable } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getReports } from '../actions/get-reports';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  reportsQuery = injectQuery(() => ({
    queryKey: ['reports'],
    queryFn: () => getReports(),
  }));
}
