export interface MapOptions {
  tile_url: string;
  zoom_level: number;
  markersLayer: boolean;
  heatmapLayer: boolean;
  marker_radius: number;
  marker_color: string;
  marker_stroke: string;
  heat_blur: string;
  heat_radius: string;
  heat_opacity: number;
}

export const defaults: MapOptions = {
  tile_url: '',
  zoom_level: 18,
  markersLayer: false,
  heatmapLayer: true,
  marker_radius: 5,
  marker_color: 'white',
  marker_stroke: 'deepskyblue',
  heat_blur: '15',
  heat_radius: '5',
  heat_opacity: 0.9,
};
