export interface Graphs {
  Graphs: Graph[];
}

export interface Graph {
  id: number;
  type: string;
  title: string;
  data: Data;
  x: number;
  y: number;
  cols: number;
  rows: number;
}

export interface Data {
  xAxis?: Axis;
  yAxis?: Axis;
  series: Series[];
  radar?: Radar;
  visualMap?: VisualMap;
}

export interface Radar {
  indicator: Indicator[];
}

export interface Indicator {
  name: string;
  max: number;
}

export interface Series {
  data: Array<number[] | DatumClass | number>;
  type: string;
  itemStyle?: Style;
  radius?: string;
  smooth?: boolean;
  lineStyle?: Style;
  progress?: Progress;
  detail?: Detail;
  name?: string;
  emphasis?: Emphasis;
}

export interface DatumClass {
  value: number[] | number;
  name: string;
}

export interface Detail {
  valueAnimation: boolean;
  formatter: string;
}

export interface Emphasis {
  itemStyle: ItemStyle;
}

export interface ItemStyle {
  shadowBlur: number;
}

export interface Style {
  color: string;
}

export interface Progress {
  show: boolean;
}

export interface VisualMap {
  min: number;
  max: number;
  calculable: boolean;
  orient: string;
}

export interface Axis {
  type?: Type;
  data?: string[];
  name?: string;
  min?: number;
  max?: number;
}

export enum Type {
  Category = 'category',
  Value = 'value',
}
