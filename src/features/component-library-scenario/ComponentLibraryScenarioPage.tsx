import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { scenarioTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scenario', value: 'Component Library', detail: '目标不是堆一套按钮，而是建立复用边界、视觉统一和可维护 API。' },
  { label: 'Focus', value: 'Foundation First', detail: '先做设计 token、基础组件和文档，再谈大面积推广。' },
  { label: 'Layers', value: 'Token / Primitive / Pattern', detail: '组件库通常要分层，不然很快会变成“大杂烩 UI 仓库”。' },
] as const;

const definitions = [
  { title: '组件库不是组件堆积', detail: '真正可复用的库要有稳定 API、统一视觉语义、可访问性、文档、测试和版本策略。' },
  { title: '最先做的是基础设施而不是全部业务组件', detail: '设计 token、主题、Button、Input、Dialog、Table 这类基础能力通常比业务卡片更值得先做。' },
  { title: '分层很重要', detail: '通常可以分成 token、primitive/headless、业务 pattern 三层，避免底层和业务强绑。' },
  { title: 'API 设计要围绕常见使用路径', detail: '一个组件支持太多稀有场景，很容易把 API 做得难懂又难维护。' },
  { title: '无障碍和可测试性要前置', detail: '键盘交互、aria、焦点管理和稳定选择器，不该等上线后再补。' },
  { title: '推广落地需要文档和迁移策略', detail: '没有文档、示例和 codemod，再好的组件库也很难被团队真正用起来。' },
] as const;

const relations = [
  { title: 'Token', detail: '颜色、字号、圆角、间距和阴影等统一设计变量。', signal: 'Foundation' },
  { title: 'Primitive', detail: 'Button、Input、Dialog 这类低层组件承接统一交互和样式语义。', signal: 'Base API' },
  { title: 'Pattern', detail: 'SearchForm、FilterPanel、DataTable 等更贴业务的组合层。', signal: 'Composition' },
  { title: '文档与发布', detail: '示例、测试、版本变更和迁移说明决定推广效率。', signal: 'Adoption' },
] as const;

const relationCode = `Token
-> Primitive / Headless Components
-> Pattern Components
-> Documentation / Testing / Release
-> Team Adoption`;

const basics = [
  {
    title: '问题 1：如果让你从零设计一套组件库，先做什么？',
    answer: '先做 token 和基础组件能力，再选 3 到 5 个最高频场景组件作为试点，而不是一下子铺满所有页面组件。',
    explanation: '这题重点在节奏感，不是把清单拉得很长。',
    code: `export const tokens = {
  color: {
    primary: '#0f172a',
    accent: '#2563eb',
  },
  radius: {
    sm: '8px',
    md: '12px',
  },
};`,
    codeTitle: 'Token First',
  },
  {
    title: '问题 2：组件库为什么要分层？',
    answer: '因为底层组件强调稳定和通用，业务组件强调贴场景。如果全混在一起，后面 API 和视觉语义会越来越乱。',
    explanation: '分层是组件库可持续演进的关键。',
    code: `tokens/
primitives/
patterns/
docs/`,
    codeTitle: 'Layered Structure',
  },
  {
    title: '问题 3：组件 API 怎么设计才更稳？',
    answer: '围绕高频使用路径设计默认值和组合方式，少暴露低价值开关，多保留语义化参数和扩展槽位。',
    explanation: '组件库 API 最怕“什么都能配，结果谁都不会用”。',
    code: `type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
};`,
    codeTitle: 'Focused API Surface',
  },
  {
    title: '问题 4：为什么常说要做 headless 或 primitive 层？',
    answer: '因为很多交互能力如弹窗、下拉、焦点管理和可访问性是通用的，样式和业务布局可以在更上层灵活组合。',
    explanation: '这能让交互逻辑复用，而视觉可以按品牌或业务再包一层。',
    code: `function DialogRoot(props: DialogRootProps) {
  return (
    <Portal>
      <Overlay />
      <Content>{props.children}</Content>
    </Portal>
  );
}`,
    codeTitle: 'Primitive Layer',
  },
] as const;

const practical = [
  {
    title: '问题 5：组件库如何保证一致性和可访问性？',
    answer: '靠 token、统一交互规范、aria 语义、键盘支持、焦点管理、视觉回归测试和文档示例一起保证。',
    explanation: '组件库质量不是“长得像”就够了，交互和可访问性也要一致。',
    code: `button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}`,
    codeTitle: 'A11y and Focus Style',
  },
  {
    title: '问题 6：如何让组件库真正被团队用起来？',
    answer: '要给清晰的文档、示例、使用规范、升级说明，最好还有 playground、Storybook 和迁移脚本。',
    explanation: '推广失败很多时候不是组件不好，而是接入成本太高。',
    code: `pnpm storybook
pnpm test
pnpm build`,
    codeTitle: 'Adoption Tooling',
  },
  {
    title: '问题 7：怎么逐步替换旧页面里的散装组件？',
    answer: '从高频基础组件和新需求开始替换，给旧组件做适配层或 codemod，避免一次性全站大迁移。',
    explanation: '这题考的是落地策略，不是理想架构。',
    code: `export function LegacyButtonAdapter(props: LegacyButtonProps) {
  return (
    <Button variant={mapVariant(props.type)} loading={props.pending}>
      {props.label}
    </Button>
  );
}`,
    codeTitle: 'Adapter for Migration',
  },
  {
    title: '问题 8：面试里怎么总结这个题？',
    answer: '从“先建 token 和基础层、再设计稳定 API、再补文档测试、最后用渐进迁移推动落地”这条主线来答。',
    explanation: '这样更像真的带过组件库，而不只是写过几个按钮。',
    code: `Foundation -> API -> A11y/Test -> Docs -> Adoption`,
    codeTitle: 'Library Design Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先定组件库边界和目标用户', detail: '是给业务团队用，还是给设计系统与多项目共用。' },
  { title: '第二步：先做 token 和基础层', detail: '统一视觉和交互语义。' },
  { title: '第三步：用高频场景组件验证 API', detail: '别一开始就铺太大。' },
  { title: '第四步：配文档、测试和迁移策略', detail: '这样库才能真正落地。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：一开始就做很多业务组件', detail: '没有基础层支撑时，后面很容易碎片化。', points: ['先 token', '先基础组件', '先试点'] },
  { title: '高频误区 2：API 过度灵活', detail: '选项太多会让组件难学、难测、难维护。', points: ['围绕高频路径', '合理默认值', '保留语义化扩展'] },
  { title: '高频误区 3：忽略无障碍和文档', detail: '这样组件库很难在真实团队里长期使用。', points: ['aria', '键盘', '文档示例', '测试'] },
  { title: '高频误区 4：全量替换旧页面', detail: '迁移风险高，也容易拖慢业务节奏。', points: ['渐进替换', '适配层', 'codemod'] },
] as const;

const rules = [
  { title: '组件库先做基础设施，不先做大而全', detail: 'token 和基础组件比业务组件更应该先打牢。' },
  { title: 'API 为高频路径服务', detail: '让默认使用最顺手。' },
  { title: '无障碍、测试、文档要前置', detail: '这些不是上线后再补的附属品。' },
  { title: '落地靠渐进迁移', detail: '推广策略决定组件库是否真的被使用。' },
] as const;

export default function ComponentLibraryScenarioPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Scenario / Component Library"
      title="如何设计一套可复用组件库"
      lead="这类题真正考的是体系化能力。不是问你会不会写 Button，而是问你能不能设计出一套有边界、有层次、可复用、可演进、还能被团队真正用起来的组件体系。"
      heroCards={heroCards}
      definitionsTitle="块 1：场景定义（先知道组件库不只是组件集合）"
      definitionsNote="用意：先把 token、分层、API 和落地推广放进同一张图里。"
      definitions={definitions}
      relationsTitle="块 2：组件库主线速览"
      relationsNote="用意：把基础层、组合层和推广层串起来。"
      relations={relations}
      relationCodeTitle="Library Design Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础设计问题', note: '用意：先把起步顺序、分层和 API 设计讲清。', label: 'Foundation', questions: basics },
        { title: '块 4：落地推广问题', note: '用意：再把无障碍、迁移和团队 adoption 补全。', label: 'Adoption', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：设计和推广组件库都能按这条线展开。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把组件库题答成“做几个公共组件”。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆设计组件库的稳定主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={scenarioTheme}
    />
  );
}
