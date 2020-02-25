import { DataFrame, Field, Vector } from '@grafana/data';

export interface MapOptions {
  center_lat: number;
  center_lon: number;
  tile_url: string;
  zoom_level: number;
  max_zoom: number;
  markersLayer: boolean;
  heatmapLayer: boolean;
  marker_radius: number;
  marker_color: string;
  marker_stroke: string;
  heat_blur: string;
  heat_radius: string;
  heat_opacity: string;
}

export const defaults: MapOptions = {
  center_lat: 48.262725,
  center_lon: 11.66725,
  tile_url: '',
  zoom_level: 18,
  max_zoom: 20,
  markersLayer: false,
  heatmapLayer: true,
  marker_radius: 5,
  marker_color: 'white',
  marker_stroke: 'deepskyblue',
  heat_blur: '15',
  heat_radius: '5',
  heat_opacity: '0.9',
};

interface Buffer extends Vector {
  buffer: any;
}

export interface FieldBuffer extends Field<any, Vector> {
  values: Buffer;
}

export interface Frame extends DataFrame {
  fields: FieldBuffer[];
}
