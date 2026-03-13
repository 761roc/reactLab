import { jotaiDemoFeature } from '../features/jotai-demo';
import { mobxDemoFeature } from '../features/mobx-demo';
import { recoilDemoFeature } from '../features/recoil-demo';
import { reduxDemoFeature } from '../features/redux-demo';
import { tailwindDemoFeature } from '../features/tailwind-demo';
import { zustandDemoFeature } from '../features/zustand-demo';
import type { FeatureModule } from './feature-types';

export const featureRegistry: FeatureModule[] = [
  tailwindDemoFeature,
  reduxDemoFeature,
  mobxDemoFeature,
  zustandDemoFeature,
  recoilDemoFeature,
  jotaiDemoFeature
];

export const defaultFeature = featureRegistry[0];

export function getFeatureById(featureId?: string): FeatureModule | undefined {
  return featureRegistry.find((feature) => feature.id === featureId);
}
