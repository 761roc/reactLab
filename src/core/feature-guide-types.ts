export type GuideCodeLanguage = 'tsx' | 'ts' | 'js' | 'css' | 'bash';

export interface FeatureGuideCode {
  language: GuideCodeLanguage;
  title?: string;
  snippet: string;
}

export interface FeatureGuideBlock {
  title: string;
  summary: string;
  bullets?: string[];
  code?: FeatureGuideCode;
}

export interface FeatureGuide {
  heading: string;
  description: string;
  blocks: FeatureGuideBlock[];
}
