import { fackeEndpoint } from '../services/chart-data.service';

export const getReports = async (): Promise<any[]> => {
  try {
    const resp = await fackeEndpoint();
    return resp;
  } catch (error) {
    return [];
  }
};
