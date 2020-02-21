import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { PanelProps } from '@grafana/data';
import { MapOptions, FieldBuffer, Frame } from '../types';
import 'ol/ol.css';
import { Map, View } from 'ol';
import XYZ from 'ol/source/XYZ';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Heatmap from 'ol/layer/Heatmap';
import Control from 'ol/control/Control';
import { defaults, DragPan, MouseWheelZoom } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import nanoid from 'nanoid';
import { processData } from './utils/helpers';
import '../style/MainPanel.css';

interface Props extends PanelProps<MapOptions> {}

export class MainPanel extends PureComponent<Props> {
  id = 'id' + nanoid();
  map: Map;
  randomTile: TileLayer;
  markersLayer: VectorLayer;
  heatmapLayer: Heatmap;

  componentDidMount() {
    const {
      tile_url,
      zoom_level,
      max_zoom,
      heatmapLayer,
      markersLayer,
      marker_radius,
      marker_color,
      marker_stroke,
      heat_radius,
      heat_blur,
      heat_opacity,
    } = this.props.options;

    const fields = this.props.data.series[0].fields as FieldBuffer[];

    const carto = new TileLayer({
      source: new XYZ({
        url: 'https://{1-4}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      }),
    });

    if (fields[2].values.buffer.length === 0) {
      this.map = new Map({
        interactions: defaults({ dragPan: false, mouseWheelZoom: false }).extend([
          new DragPan({
            condition: platformModifierKeyOnly,
          }),
          new MouseWheelZoom({
            condition: platformModifierKeyOnly,
          }),
        ]),
        layers: [carto],
        view: new View({
          center: fromLonLat([11.66725, 48.262725]),
          zoom: zoom_level,
        }),
        target: this.id,
      });
    } else {
      this.map = new Map({
        interactions: defaults({ dragPan: false, mouseWheelZoom: false }).extend([
          new DragPan({
            condition: platformModifierKeyOnly,
          }),
          new MouseWheelZoom({
            condition: platformModifierKeyOnly,
          }),
        ]),
        layers: [carto],
        view: new View({
          center: fromLonLat([fields[2].values.buffer[0], fields[1].values.buffer[0]]),
          zoom: zoom_level,
          maxZoom: max_zoom,
        }),
        target: this.id,
      });
    }

    if (tile_url !== '') {
      this.randomTile = new TileLayer({
        source: new XYZ({
          url: tile_url,
        }),
        zIndex: 1,
      });
      this.map.addLayer(this.randomTile);
    }

    const vectorSource = processData(this.props.data.series[0] as Frame);

    if (markersLayer) {
      this.markersLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 2,
        style: new Style({
          image: new CircleStyle({
            radius: marker_radius,
            fill: new Fill({ color: marker_color }),
            stroke: new Stroke({
              color: marker_stroke,
              width: 1,
            }),
          }),
        }),
      });
      this.map.addLayer(this.markersLayer);
    }

    if (heatmapLayer) {
      this.heatmapLayer = new Heatmap({
        source: vectorSource,
        blur: parseInt(heat_blur, 10),
        radius: parseInt(heat_radius, 10),
        opacity: parseFloat(heat_opacity),
        zIndex: 2,
      });
      this.map.addLayer(this.heatmapLayer);
    }
    const jsx = (
      <select defaultValue={markersLayer ? 'markersLayer' : 'heatmapLayer'} onChange={this.handleSwitch}>
        <option value="markersLayer">Markers</option>
        <option value="heatmapLayer">Heat Map</option>
      </select>
    );
    const div = document.createElement('div');
    div.className = 'ol-control ol-custom-control';
    ReactDOM.render(jsx, div);
    const ctl = new Control({ element: div });
    this.map.addControl(ctl);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series[0] !== this.props.data.series[0]) {
      const { markersLayer, marker_radius, marker_color, marker_stroke, heatmapLayer, heat_blur, heat_radius, heat_opacity } = this.props.options;

      const prevFields = prevProps.data.series[0].fields as FieldBuffer[];
      const newFields = this.props.data.series[0].fields as FieldBuffer[];
      if (prevFields[1].values.buffer.length === 0 && newFields[1].values.buffer.length !== 0) {
        this.map.getView().animate({
          center: fromLonLat([newFields[2].values.buffer[0], newFields[1].values.buffer[0]]),
          duration: 2000,
        });
      }

      //remove existing layers
      this.map.removeLayer(this.markersLayer);
      this.map.removeLayer(this.heatmapLayer);

      const vectorSource = processData(this.props.data.series[0] as Frame);

      if (markersLayer) {
        this.markersLayer = new VectorLayer({
          source: vectorSource,
          zIndex: 2,
          style: new Style({
            image: new CircleStyle({
              radius: marker_radius,
              fill: new Fill({ color: marker_color }),
              stroke: new Stroke({
                color: marker_stroke,
                width: 1,
              }),
            }),
          }),
        });
        this.map.addLayer(this.markersLayer);
      }

      if (heatmapLayer) {
        this.heatmapLayer = new Heatmap({
          source: vectorSource,
          blur: parseInt(heat_blur, 10),
          radius: parseInt(heat_radius, 10),
          opacity: parseFloat(heat_opacity),
          zIndex: 2,
        });
        this.map.addLayer(this.heatmapLayer);
      }
    }

    if (prevProps.options.markersLayer !== this.props.options.markersLayer && this.props.options.markersLayer) {
      this.map.removeLayer(this.heatmapLayer);

      const { marker_radius, marker_color, marker_stroke } = this.props.options;
      const vectorSource = processData(this.props.data.series[0] as Frame);

      this.markersLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 2,
        style: new Style({
          image: new CircleStyle({
            radius: marker_radius,
            fill: new Fill({ color: marker_color }),
            stroke: new Stroke({
              color: marker_stroke,
              width: 1,
            }),
          }),
        }),
      });
      this.map.addLayer(this.markersLayer);
    }

    if (prevProps.options.heatmapLayer !== this.props.options.heatmapLayer && this.props.options.heatmapLayer) {
      this.map.removeLayer(this.markersLayer);

      const { heat_radius, heat_blur, heat_opacity } = this.props.options;
      const vectorSource = processData(this.props.data.series[0] as Frame);

      this.heatmapLayer = new Heatmap({
        source: vectorSource,
        blur: parseInt(heat_blur, 10),
        radius: parseInt(heat_radius, 10),
        opacity: parseFloat(heat_opacity),
        zIndex: 2,
      });
      this.map.addLayer(this.heatmapLayer);
    }

    if (prevProps.options.tile_url !== this.props.options.tile_url) {
      if (this.randomTile) {
        this.map.removeLayer(this.randomTile);
      }

      if (this.props.options.tile_url !== '') {
        this.randomTile = new TileLayer({
          source: new XYZ({
            url: this.props.options.tile_url,
          }),
          zIndex: 1,
        });
        this.map.addLayer(this.randomTile);
      }
    }

    if (prevProps.options.zoom_level !== this.props.options.zoom_level) {
      this.map.getView().setZoom(this.props.options.zoom_level);
    }

    if (
      prevProps.options.heat_radius !== this.props.options.heat_radius ||
      prevProps.options.heat_blur !== this.props.options.heat_blur ||
      prevProps.options.heat_opacity !== this.props.options.heat_opacity
    ) {
      if (this.props.options.heatmapLayer) {
        const { heat_radius, heat_blur, heat_opacity } = this.props.options;

        this.heatmapLayer.setRadius(parseInt(heat_radius, 10));
        this.heatmapLayer.setBlur(parseInt(heat_blur, 10));
        this.heatmapLayer.setOpacity(parseFloat(heat_opacity));
      }
    }

    if (
      prevProps.options.marker_radius !== this.props.options.marker_radius ||
      prevProps.options.marker_color !== this.props.options.marker_color ||
      prevProps.options.marker_stroke !== this.props.options.marker_stroke
    ) {
      if (this.props.options.markersLayer) {
        const { marker_radius, marker_color, marker_stroke } = this.props.options;
        this.map.removeLayer(this.markersLayer);

        this.markersLayer.setStyle(
          new Style({
            image: new CircleStyle({
              radius: marker_radius,
              fill: new Fill({ color: marker_color }),
              stroke: new Stroke({
                color: marker_stroke,
                width: 1,
              }),
            }),
          })
        );
        this.map.addLayer(this.markersLayer);
      }
    }
  }

  handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options, onOptionsChange } = this.props;
    if (e.target.value === 'markersLayer') {
      onOptionsChange({
        ...options,
        markersLayer: true,
        heatmapLayer: false,
      });
    }
    if (e.target.value === 'heatmapLayer') {
      onOptionsChange({
        ...options,
        markersLayer: false,
        heatmapLayer: true,
      });
    }
  };

  render() {
    return <div id={this.id} style={{ width: '100%', height: '100%' }}></div>;
  }
}
