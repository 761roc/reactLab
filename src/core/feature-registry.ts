import { babelSummaryFeature } from "../features/babel-summary";
import { apiConcurrencyScenarioFeature } from "../features/api-concurrency-scenario";
import { browserCacheSummaryFeature } from "../features/browser-cache-summary";
import { browserCrossOriginSummaryFeature } from "../features/browser-cross-origin-summary";
import { browserEventsSummaryFeature } from "../features/browser-events-summary";
import { browserRenderingSummaryFeature } from "../features/browser-rendering-summary";
import { browserSecuritySummaryFeature } from "../features/browser-security-summary";
import { browserStorageSummaryFeature } from "../features/browser-storage-summary";
import { browserUrlLifecycleFeature } from "../features/browser-url-lifecycle";
import { componentLibraryScenarioFeature } from "../features/component-library-scenario";
import { componentRefactorScenarioFeature } from "../features/component-refactor-scenario";
import { closureThisSummaryFeature } from "../features/closure-this-summary";
import { copyReferenceSummaryFeature } from "../features/copy-reference-summary";
import { designPatternsFeature } from "../features/design-patterns";
import { engineeringOptimizationSummaryFeature } from "../features/engineering-optimization-summary";
import { engineeringWorkflowSummaryFeature } from "../features/engineering-workflow-summary";
import { es6CollectionsSummaryFeature } from "../features/es6-collections-summary";
import { eventLoopSummaryFeature } from "../features/event-loop-summary";
import { frontendSystemScenarioFeature } from "../features/frontend-system-scenario";
import { functionalUtilsSummaryFeature } from "../features/functional-utils-summary";
import { jotaiDemoFeature } from "../features/jotai-demo";
import { listPerformanceScenarioFeature } from "../features/list-performance-scenario";
import { mobxDemoFeature } from "../features/mobx-demo";
import { moduleSystemSummaryFeature } from "../features/module-system-summary";
import { moduleToolsSummaryFeature } from "../features/module-tools-summary";
import { reactContextDemoFeature } from "../features/react-context-demo";
import { reactFlowDemoFeature } from "../features/reactflow-demo";
import { reactFlowJsonFlowFeature } from "../features/reactflow-json-flow";
import { reactQueryDemoFeature } from "../features/react-query-demo";
import { notionEditorFeature } from "../features/notion-editor";
import { packageManagerSummaryFeature } from "../features/package-manager-summary";
import { prototypeChainSummaryFeature } from "../features/prototype-chain-summary";
import { responsiveWebDemoFeature } from "../features/responsive-web-demo";
import { recoilDemoFeature } from "../features/recoil-demo";
import { reduxDemoFeature } from "../features/redux-demo";
import { shadcnDemoFeature } from "../features/shadcn-demo";
import { tailwindDemoFeature } from "../features/tailwind-demo";
import { treeShakingSummaryFeature } from "../features/tree-shaking-summary";
import { typescriptInterviewSummaryFeature } from "../features/typescript-interview-summary";
import { valtioDemoFeature } from "../features/valtio-demo";
import { viteWebpackSummaryFeature } from "../features/vite-webpack-summary";
import { whiteScreenDebugScenarioFeature } from "../features/white-screen-debug-scenario";
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
  prototypeChainSummaryFeature,
  eventLoopSummaryFeature,
  copyReferenceSummaryFeature,
  es6CollectionsSummaryFeature,
  functionalUtilsSummaryFeature,
  moduleSystemSummaryFeature,
  browserUrlLifecycleFeature,
  browserCacheSummaryFeature,
  browserRenderingSummaryFeature,
  browserEventsSummaryFeature,
  browserCrossOriginSummaryFeature,
  browserStorageSummaryFeature,
  browserSecuritySummaryFeature,
  viteWebpackSummaryFeature,
  treeShakingSummaryFeature,
  babelSummaryFeature,
  typescriptInterviewSummaryFeature,
  packageManagerSummaryFeature,
  engineeringWorkflowSummaryFeature,
  engineeringOptimizationSummaryFeature,
  moduleToolsSummaryFeature,
  listPerformanceScenarioFeature,
  whiteScreenDebugScenarioFeature,
  apiConcurrencyScenarioFeature,
  componentRefactorScenarioFeature,
  componentLibraryScenarioFeature,
  frontendSystemScenarioFeature,
];

export const featureRegistry: FeatureModule[] = features.map((feature) => ({
  ...feature,
  guide: featureGuides[feature.id],
}));

export const defaultFeature = featureRegistry[0];

export function getFeatureById(featureId?: string): FeatureModule | undefined {
  return featureRegistry.find((feature) => feature.id === featureId);
}
