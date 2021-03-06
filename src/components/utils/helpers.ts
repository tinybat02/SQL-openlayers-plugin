import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Frame } from '../../types';
import { Circle, Style, Fill, Stroke, Text } from 'ol/style';

const processData = (data: Frame) => {
  const dataPoints: Feature[] = [];

  for (let i = 0; i < data.length; i++) {
    // dataPoints.push(
    //   new Feature({
    //     geometry: new Point(fromLonLat([data.fields[2].values.buffer[i], data.fields[1].values.buffer[i]])),
    //   })
    // );
    const pointFeature = new Feature(new Point(fromLonLat([data.fields[2].values.buffer[i], data.fields[1].values.buffer[i]])));
    pointFeature.set('time', data.fields[3].values.buffer[i]);
    pointFeature.set('user', data.fields[4].values.buffer[i]);
    pointFeature.setStyle(
      new Style({
        image: new Circle({
          radius: data.fields[5].values.buffer[i],
          fill: new Fill({ color: 'rgba(73,168,222,0.3)' }),
          stroke: new Stroke({
            color: '#fff',
            width: 1,
          }),
        }),
        text: new Text({
          stroke: new Stroke({
            color: '#fff',
            width: 1,
          }),
          font: '13px Calibri,sans-serif',
          text: data.fields[4].values.buffer[i],
          offsetY: -10,
        }),
      })
    );
    dataPoints.push(pointFeature);
  }
  const vectorSource = new VectorSource({
    features: dataPoints,
  });
  return vectorSource;
};

export { processData };
