import { ReactNode } from 'react';
import BarBasic from './Chart/Bar/BarBasic';
import LineBasic from './Chart/Line/LineBasic';

const COMPONENT_MAP = new Map<
  ComponentData.TComponentSelfType,
  {
    defaultConfig: object;
    configComponent: ReactNode;
    render: ReactNode;
  }
>();

COMPONENT_MAP.set(BarBasic.type, BarBasic);
COMPONENT_MAP.set(LineBasic.type, LineBasic);

export function getComponentByType(component: ComponentData.TComponentData) {
  return COMPONENT_MAP.get(component.componentType);
}

export function getComponentDefaultConfigByType(
  componentType: ComponentData.TComponentSelfType,
) {
  return COMPONENT_MAP.get(componentType)?.defaultConfig || {};
}

export function getComponentRenderByType(
  componentType: ComponentData.TComponentSelfType,
) {
  return COMPONENT_MAP.get(componentType)?.render;
}

export function getComponentConfigComponentByType(
  componentType: ComponentData.TComponentSelfType,
) {
  return COMPONENT_MAP.get(componentType)?.configComponent;
}
