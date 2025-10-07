import { Graph } from '../interfaces/charts.interface';
import { fackeEndpoint } from '../services/chart-data.service';

export const getReports = async (): Promise<Graph[]> => {
  try {
    const resp = await fackeEndpoint();
    return resp;
  } catch (error) {
    return [];
  }
};
