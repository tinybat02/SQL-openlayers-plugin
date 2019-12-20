import React, { useState } from 'react';
import { FormField, PanelOptionsGroup } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { MapOptions } from '../types';

export const PanelEditor: React.FC<PanelEditorProps<MapOptions>> = ({ options, onOptionsChange }) => {
  const [inputs, setInputs] = useState(options);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onOptionsChange(inputs);
  };

  const showMarkers = () => {
    if (options.markersLayer) {
      onOptionsChange({
        ...options,
        markersLayer: false,
      });
    } else {
      onOptionsChange({
        ...options,
        markersLayer: true,
        heatmapLayer: false,
      });
    }
  };

  const showHeatMap = () => {
    if (options.heatmapLayer) {
      onOptionsChange({
        ...options,
        heatmapLayer: false,
      });
    } else {
      onOptionsChange({
        ...options,
        heatmapLayer: true,
        markersLayer: false,
      });
    }
  };

  return (
    <PanelOptionsGroup>
      <div className="editor-row">
        <div className="section gf-form-group">
          <h5 className="section-heading">Map Visual Options</h5>
          <FormField
            label="Additional Tile"
            labelWidth={10}
            inputWidth={80}
            type="text"
            name="tile_url"
            value={inputs.tile_url}
            onChange={handleChange}
          />
          <FormField
            label="Initial Zoom"
            labelWidth={10}
            inputWidth={40}
            type="number"
            name="zoom_level"
            value={inputs.zoom_level}
            onChange={handleChange}
          />
          <div className="gf-form">
            <label className="gf-form-label width-10">Markers</label>
            <div className="gf-form-switch" onClick={showMarkers}>
              <input type="checkbox" checked={options.markersLayer} />
              <span className="gf-form-switch__slider"></span>
            </div>
          </div>
          <div className="gf-form">
            <label className="gf-form-label width-10">Heat Map</label>
            <div className="gf-form-switch" onClick={showHeatMap}>
              <input type="checkbox" checked={options.heatmapLayer} />
              <span className="gf-form-switch__slider"></span>
            </div>
          </div>
        </div>

        <div className="section gf-form-group">
          <h5 className="section-heading">Marker Settings</h5>
          <FormField
            label="Marker radius"
            labelWidth={10}
            inputWidth={80}
            type="text"
            name="marker_radius"
            value={inputs.marker_radius}
            onChange={handleChange}
          />
          <FormField
            label="Marker color"
            labelWidth={10}
            inputWidth={80}
            type="text"
            name="marker_color"
            value={inputs.marker_color}
            onChange={handleChange}
          />
          <FormField
            label="Marker stroke"
            labelWidth={10}
            inputWidth={80}
            type="text"
            name="marker_stroke"
            value={inputs.marker_stroke}
            onChange={handleChange}
          />
        </div>

        <div className="section gf-form-group">
          <h5 className="section-heading">Heatmap Settings</h5>
          <FormField
            label="Heat radius"
            labelWidth={10}
            inputWidth={80}
            type="number"
            name="heat_radius"
            value={inputs.heat_radius}
            onChange={handleChange}
          />
          <FormField
            label="Heat blur"
            labelWidth={10}
            inputWidth={80}
            type="number"
            name="heat_blur"
            value={inputs.heat_blur}
            onChange={handleChange}
          />
          <FormField
            label="Heat opacity"
            labelWidth={10}
            inputWidth={80}
            type="number"
            name="heat_opacity"
            value={inputs.heat_opacity}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn btn-outline-primary" onClick={handleSubmit}>
        Submit
      </button>
    </PanelOptionsGroup>
  );
};
