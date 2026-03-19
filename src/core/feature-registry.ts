import { closureThisSummaryFeature } from "../features/closure-this-summary";
import { designPatternsFeature } from "../features/design-patterns";
import { jotaiDemoFeature } from "../features/jotai-demo";
import { mobxDemoFeature } from "../features/mobx-demo";
import { reactContextDemoFeature } from "../features/react-context-demo";
import { reactFlowDemoFeature } from "../features/reactflow-demo";
import { reactFlowJsonFlowFeature } from "../features/reactflow-json-flow";
import { reactQueryDemoFeature } from "../features/react-query-demo";
import { notionEditorFeature } from "../features/notion-editor";
import { responsiveWebDemoFeature } from "../features/responsive-web-demo";
import { recoilDemoFeature } from "../features/recoil-demo";
import { reduxDemoFeature } from "../features/redux-demo";
import { shadcnDemoFeature } from "../features/shadcn-demo";
import { tailwindDemoFeature } from "../features/tailwind-demo";
import { valtioDemoFeature } from "../features/valtio-demo";
import { zustandDemoFeature } from "../features/zustand-demo";
import { featureGuides } from "./feature-guides";
import type { FeatureModule } from "./feature-types";

const features: FeatureModule[] = [
  tailwindDemoFeature,
  responsiveWebDemoFeature,
  reactQueryDemoFeature,
  reactContextDemoFeature,
  reduxDemoFeature,
  mobxDemoFeature,
  zustandDemoFeature,
  recoilDemoFeature,
  jotaiDemoFeature,
  valtioDemoFeature,
  notionEditorFeature,
  shadcnDemoFeature,
  reactFlowDemoFeature,
  reactFlowJsonFlowFeature,
  designPatternsFeature,
  closureThisSummaryFeature,
];

export const featureRegistry: FeatureModule[] = features.map((feature) => ({
  ...feature,
  guide: featureGuides[feature.id],
}));

export const defaultFeature = featureRegistry[0];

export function getFeatureById(featureId?: string): FeatureModule | undefined {
  return featureRegistry.find((feature) => feature.id === featureId);
}
