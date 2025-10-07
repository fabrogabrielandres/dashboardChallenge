export interface Graph {
  id: number;
  type: string; // 'bar' | 'line' | 'pie' | etc.
  title: string;
  data: GraphData;
}

export interface GraphData {
  xAxis?: Axis;
  yAxis?: Axis;
  series: Series[];
  radar?: Radar;
  visualMap?: VisualMap;
}

export interface Axis {
  type?: AxisType;
  data?: string[];
  name?: string;
  min?: number;
  max?: number;
}

export enum AxisType {
  Category = 'category',
  Value = 'value',
}

export interface Series {
  data: (number[] | number | Datum)[];
  type: string;
  name?: string;
  itemStyle?: Style;
  radius?: string;
  smooth?: boolean;
  lineStyle?: Style;
  progress?: Progress;
  detail?: Detail;
  emphasis?: Emphasis;
}

export interface Datum {
  value: number[] | number;
  name: string;
}

export interface Style {
  color: string;
  shadowBlur?: number;
}

export interface Progress {
  show: boolean;
}

export interface Detail {
  valueAnimation: boolean;
  formatter: string;
}

export interface Emphasis {
  itemStyle: Style;
}

export interface Radar {
  indicator: Indicator[];
}

export interface Indicator {
  name: string;
  max: number;
}

export interface VisualMap {
  min: number;
  max: number;
  calculable: boolean;
  orient: string;
}
