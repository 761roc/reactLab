import { jotaiDemoFeature } from '../features/jotai-demo';
import { mobxDemoFeature } from '../features/mobx-demo';
import { reactContextDemoFeature } from '../features/react-context-demo';
import { reactQueryDemoFeature } from '../features/react-query-demo';
import { recoilDemoFeature } from '../features/recoil-demo';
import { reduxDemoFeature } from '../features/redux-demo';
import { tailwindDemoFeature } from '../features/tailwind-demo';
import { valtioDemoFeature } from '../features/valtio-demo';
import { zustandDemoFeature } from '../features/zustand-demo';
import type { FeatureModule } from './feature-types';

export const featureRegistry: FeatureModule[] = [
  tailwindDemoFeature,
  reactQueryDemoFeature,
  reactContextDemoFeature,
  reduxDemoFeature,
  mobxDemoFeature,
  zustandDemoFeature,
  recoilDemoFeature,
  jotaiDemoFeature,
  valtioDemoFeature
];

export const defaultFeature = featureRegistry[0];

export function getFeatureById(featureId?: string): FeatureModule | undefined {
  return featureRegistry.find((feature) => feature.id === featureId);
}
