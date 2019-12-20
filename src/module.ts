// @ts-ignore
import { PanelPlugin } from '@grafana/ui';
import { MapOptions, defaults } from './types';
import { MainPanel } from './components/MainPanel';
import { PanelEditor } from './components/PanelEditor';

export const plugin = new PanelPlugin<MapOptions>(MainPanel).setDefaults(defaults).setEditor(PanelEditor);
