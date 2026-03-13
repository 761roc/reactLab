import { mobxDemoFeature } from '../features/mobx-demo';
import { reduxDemoFeature } from '../features/redux-demo';
import { tailwindDemoFeature } from '../features/tailwind-demo';
import type { FeatureModule } from './feature-types';

export const featureRegistry: FeatureModule[] = [
  tailwindDemoFeature,
  reduxDemoFeature,
  mobxDemoFeature
];

export const defaultFeature = featureRegistry[0];

export function getFeatureById(featureId?: string): FeatureModule | undefined {
  return featureRegistry.find((feature) => feature.id === featureId);
}
