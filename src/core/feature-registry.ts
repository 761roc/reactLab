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
import { interviewHistoryZhongkeyunshengInterfaceTypeFeature } from "../features/interview-history-zhongkeyunsheng-interface-type";
import { interviewHistoryZhongkeyunshengTwoWayBindingFeature } from "../features/interview-history-zhongkeyunsheng-react-two-way-binding";
import { interviewHistoryZhongkeyunshengMicroFrontendStyleFeature } from "../features/interview-history-zhongkeyunsheng-micro-frontend-style-isolation";
import { interviewHistoryZhongkeyunshengReact18ConcurrencyFeature } from "../features/interview-history-zhongkeyunsheng-react18-concurrency";
import { interviewHistoryZhongkeyunshengWebPerfAnalysisFeature } from "../features/interview-history-zhongkeyunsheng-web-performance-analysis";
import { interviewHistoryZhongkeyunshengStateSchemeFeature } from "../features/interview-history-zhongkeyunsheng-global-state-schemes";
import { interviewHistoryZhongkeyunshengCollabDesignFeature } from "../features/interview-history-zhongkeyunsheng-collab-component-design";
import { interviewHistoryZhongkeyunshengAntdFormFeature } from "../features/interview-history-zhongkeyunsheng-antd-custom-form";
import { interviewHistoryZhongkeyunshengAsyncEvolutionFeature } from "../features/interview-history-zhongkeyunsheng-async-evolution";
import { interviewHistoryZhongkeyunshengCrossPlatformFeature } from "../features/interview-history-zhongkeyunsheng-cross-platform-evaluation";
import { interviewHistoryZhongkeyunshengUnionSafetyFeature } from "../features/interview-history-zhongkeyunsheng-union-safety";
import { interviewHistoryZhongkeyunshengGenericsFeature } from "../features/interview-history-zhongkeyunsheng-generics";
import { interviewHistoryZhongkeyunshengUseStateFeature } from "../features/interview-history-zhongkeyunsheng-usestate";
import { jotaiDemoFeature } from "../features/jotai-demo";
import { listPerformanceScenarioFeature } from "../features/list-performance-scenario";
import { mobxDemoFeature } from "../features/mobx-demo";
import { moduleSystemSummaryFeature } from "../features/module-system-summary";
import { moduleToolsSummaryFeature } from "../features/module-tools-summary";
import { reactContextDemoFeature } from "../features/react-context-demo";
import { reactConcurrencySummaryFeature } from "../features/react-concurrency-summary";
import { reactCoreHooksSummaryFeature } from "../features/react-core-hooks-summary";
import { reactCustomHookSummaryFeature } from "../features/react-custom-hook-summary";
import { reactMechanismDiffKeyFeature } from "../features/react-mechanism-diff-key";
import { reactEffectLifecycleSummaryFeature } from "../features/react-effect-lifecycle-summary";
import { reactMechanismEffectLayoutFeature } from "../features/react-mechanism-effect-vs-layout-effect";
import { reactFlowDemoFeature } from "../features/reactflow-demo";
import { reactFlowJsonFlowFeature } from "../features/reactflow-json-flow";
import { reactMechanismHooksTopLevelFeature } from "../features/react-mechanism-hooks-top-level";
import { reactMechanismLargeListFeature } from "../features/react-mechanism-large-list-optimization";
import { reactMechanismMemoFamilyFeature } from "../features/react-mechanism-memo-family";
import { reactPerformanceSummaryFeature } from "../features/react-performance-summary";
import { reactQueryDemoFeature } from "../features/react-query-demo";
import { reactMechanismRenderOrderFeature } from "../features/react-mechanism-render-order";
import { reactRenderingMechanicsSummaryFeature } from "../features/react-rendering-mechanics-summary";
import { reactMechanismRouteStateFeature } from "../features/react-mechanism-route-state-preservation";
import { reactMechanismSetStateFlowFeature } from "../features/react-mechanism-setstate-flow";
import { reactStateCommunicationSummaryFeature } from "../features/react-state-communication-summary";
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
import { vueCommonApiSummaryFeature } from "../features/vue-common-api-summary";
import { vueCoreConceptsSummaryFeature } from "../features/vue-core-concepts-summary";
import { vueInterviewTopicsSummaryFeature } from "../features/vue-interview-topics-summary";
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
  reactStateCommunicationSummaryFeature,
  reactCoreHooksSummaryFeature,
  reactEffectLifecycleSummaryFeature,
  reactRenderingMechanicsSummaryFeature,
  reactConcurrencySummaryFeature,
  reactCustomHookSummaryFeature,
  reactPerformanceSummaryFeature,
  reactMechanismSetStateFlowFeature,
  reactMechanismHooksTopLevelFeature,
  reactMechanismDiffKeyFeature,
  reactMechanismEffectLayoutFeature,
  reactMechanismRenderOrderFeature,
  reactMechanismMemoFamilyFeature,
  reactMechanismRouteStateFeature,
  reactMechanismLargeListFeature,
  interviewHistoryZhongkeyunshengUseStateFeature,
  interviewHistoryZhongkeyunshengInterfaceTypeFeature,
  interviewHistoryZhongkeyunshengGenericsFeature,
  interviewHistoryZhongkeyunshengUnionSafetyFeature,
  interviewHistoryZhongkeyunshengTwoWayBindingFeature,
  interviewHistoryZhongkeyunshengMicroFrontendStyleFeature,
  interviewHistoryZhongkeyunshengReact18ConcurrencyFeature,
  interviewHistoryZhongkeyunshengWebPerfAnalysisFeature,
  interviewHistoryZhongkeyunshengStateSchemeFeature,
  interviewHistoryZhongkeyunshengCollabDesignFeature,
  interviewHistoryZhongkeyunshengAntdFormFeature,
  interviewHistoryZhongkeyunshengAsyncEvolutionFeature,
  interviewHistoryZhongkeyunshengCrossPlatformFeature,
  vueCoreConceptsSummaryFeature,
  vueCommonApiSummaryFeature,
  vueInterviewTopicsSummaryFeature,
];

export const featureRegistry: FeatureModule[] = features.map((feature) => ({
  ...feature,
  guide: featureGuides[feature.id],
}));

export const defaultFeature = featureRegistry[0];

export function getFeatureById(featureId?: string): FeatureModule | undefined {
  return featureRegistry.find((feature) => feature.id === featureId);
}
