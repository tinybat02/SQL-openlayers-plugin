import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Frame } from '../../types';

const processData = (data: Frame) => {
  const dataPoints: Feature[] = [];

  for (let i = 0; i < data.length; i++) {
    dataPoints.push(
      new Feature({
        geometry: new Point(fromLonLat([data.fields[2].values.buffer[i], data.fields[1].values.buffer[i]])),
      })
    );
  }
  const vectorSource = new VectorSource({
    features: dataPoints,
  });
  return vectorSource;
};

export { processData };
