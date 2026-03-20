import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { scenarioTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scenario', value: 'System Features', detail: '权限、守卫、埋点、国际化都不是孤立小功能，而是横切全站的基础能力。' },
  { label: 'Focus', value: 'Cross-cutting', detail: '这类题最重要的是边界设计：放在哪层、如何统一接入、如何避免每页重复写。' },
  { label: 'Scope', value: '4 Topics', detail: '权限、路由、埋点、i18n 看似不同，但都很依赖统一约定和基础设施。' },
] as const;

const definitions = [
  { title: '权限系统要区分认证和授权', detail: '先确认用户是谁，再判断他能做什么；登录态和权限点不是一回事。' },
  { title: '路由守卫本质是访问控制和跳转编排', detail: '它决定用户进入某个页面前要经过哪些前置判断。' },
  { title: '埋点系统核心是统一事件模型', detail: '不要每个页面都手写散乱的 event name 和字段。' },
  { title: '国际化不只是文字翻译', detail: '日期、数字、货币、时区、布局长度、文案占位和回退策略都要考虑。' },
  { title: '这四类能力都属于横切关注点', detail: '如果散落到每个页面里单独实现，后面维护成本会很高。' },
  { title: '最关键的是建立统一入口和约定', detail: '权限检查函数、路由元信息、埋点 SDK、i18n provider 都应该统一接入。' },
] as const;

const relations = [
  { title: '权限', detail: '控制“能不能看”和“能不能操作”。', signal: 'Permission' },
  { title: '路由守卫', detail: '控制“什么时候允许进入这个页面”。', signal: 'Route Access' },
  { title: '埋点', detail: '记录“用户做了什么、在哪做、结果如何”。', signal: 'Tracking' },
  { title: '国际化', detail: '决定“用户最终看到什么语言和格式”。', signal: 'Localization' },
] as const;

const relationCode = `用户进入系统
-> 登录态校验
-> 路由守卫判断
-> 页面按权限展示和禁用操作
-> 关键行为统一埋点
-> 文案和格式按 locale 输出`;

const basics = [
  {
    title: '问题 1：权限系统最稳的设计思路是什么？',
    answer: '把权限定义成统一的能力点，由页面和组件通过同一套检查函数消费，而不是到处写 if role === admin。',
    explanation: '这题的核心是“统一权限模型”，不是角色名本身。',
    code: `type PermissionKey =
  | 'order.read'
  | 'order.edit'
  | 'order.export';

function can(user: User, permission: PermissionKey) {
  return user.permissions.includes(permission);
}`,
    codeTitle: 'Unified Permission Check',
  },
  {
    title: '问题 2：路由守卫一般放哪？',
    answer: '放在路由配置和页面入口之间最稳，通过 route meta 声明是否需要登录、需要哪些权限，再统一做跳转决策。',
    explanation: '守卫应该是系统能力，不该散落到每个页面组件里。',
    code: `const routes = [
  { path: '/orders', element: <OrdersPage />, requiresAuth: true, permission: 'order.read' },
];

function GuardedRoute({ route }: { route: AppRoute }) {
  if (route.requiresAuth && !authStore.user) return <Navigate to="/login" replace />;
  if (route.permission && !can(authStore.user, route.permission)) return <Navigate to="/403" replace />;
  return route.element;
}`,
    codeTitle: 'Route Guard With Meta',
  },
  {
    title: '问题 3：埋点系统为什么要统一事件模型？',
    answer: '因为不统一的话，事件名、字段、时机都会越来越乱，数据分析和后续迭代会非常痛苦。',
    explanation: '埋点不是“能发出去就行”，而是“后面能分析、能复用、能约束”。',
    code: `type TrackEvent =
  | { name: 'order_export_click'; page: 'orders'; source: 'toolbar' }
  | { name: 'order_export_success'; page: 'orders'; count: number };

function track(event: TrackEvent) {
  analytics.send(event);
}`,
    codeTitle: 'Typed Analytics Events',
  },
  {
    title: '问题 4：国际化最常见的基础架构是什么？',
    answer: '通常是 locale provider + 文案字典 + 格式化工具，再配合路由、用户设置或浏览器语言做语言选择。',
    explanation: '国际化不是只把中文改成英文，还要处理格式和回退逻辑。',
    code: `const messages = {
  'zh-CN': { 'order.title': '订单中心' },
  'en-US': { 'order.title': 'Orders' },
};

function t(locale: Locale, key: string) {
  return messages[locale]?.[key] ?? messages['en-US'][key] ?? key;
}`,
    codeTitle: 'I18n Dictionary Lookup',
  },
] as const;

const practical = [
  {
    title: '问题 5：权限展示和路由守卫有什么区别？',
    answer: '路由守卫负责能不能进页面，页面内权限控制负责能不能看到某块内容、能不能点某个按钮，它们通常要同时存在。',
    explanation: '很多系统只做了路由守卫，但进入页面后按钮还是全露着，这不够完整。',
    code: `function ExportButton() {
  const allowed = usePermission('order.export');

  if (!allowed) return null;
  return <Button>导出订单</Button>;
}`,
    codeTitle: 'Page-level Permission Rendering',
  },
  {
    title: '问题 6：埋点应该怎么接入，才不至于污染业务代码？',
    answer: '把埋点封装到事件函数、页面 hook 或基础组件层，业务侧只描述事件语义，而不关心底层 SDK 细节。',
    explanation: '这样更容易切换平台，也更容易统一字段。',
    code: `function useOrderTracking() {
  return {
    trackExportClick: () =>
      track({ name: 'order_export_click', page: 'orders', source: 'toolbar' }),
  };
}`,
    codeTitle: 'Tracking Hook',
  },
  {
    title: '问题 7：国际化落地时常见难点有哪些？',
    answer: '文案长度变化导致布局变形、日期货币格式差异、动态插值、服务端和前端语言同步、翻译缺失回退等都很常见。',
    explanation: '这题答出布局和格式问题，会比只说“翻译文案”更成熟。',
    code: `new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date());
new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(1280);`,
    codeTitle: 'Locale-aware Formatting',
  },
  {
    title: '问题 8：面试里怎么把这四块串起来？',
    answer: '可以统一从“横切基础设施”角度讲：权限和守卫负责访问控制，埋点负责行为观测，国际化负责多语言输出，它们都应该通过统一入口接入而不是页面各自实现。',
    explanation: '这样不会显得你在答四道零散的小题。',
    code: `Access Control + Observability + Localization = Cross-cutting Infrastructure`,
    codeTitle: 'System Feature Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先定义统一模型', detail: '权限点、路由 meta、埋点事件名、i18n key 都要先统一。' },
  { title: '第二步：再决定统一接入层', detail: 'provider、guard、sdk 封装和基础 hook 都要有。' },
  { title: '第三步：页面层只消费能力，不重复造轮子', detail: '减少散乱 if 判断和手写事件。' },
  { title: '第四步：补监控、测试和文档', detail: '这类横切能力很依赖规范化。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：权限判断散落到处都是', detail: '没有统一权限模型时，后面会非常难维护。', points: ['统一权限 key', '统一检查函数', '页面和组件共用'] },
  { title: '高频误区 2：只做路由守卫，不做页面内控制', detail: '这样用户进到页面后仍可能看到不该看到的操作。', points: ['路由守卫', '页面显示控制', '操作级权限'] },
  { title: '高频误区 3：埋点自由发挥', detail: '事件名和字段不统一时，数据很难分析。', points: ['统一 schema', '统一 SDK 封装', '稳定字段'] },
  { title: '高频误区 4：国际化只翻译静态文案', detail: '格式、布局、回退和动态文案同样重要。', points: ['日期货币格式', '文案长度', '回退策略'] },
] as const;

const rules = [
  { title: '横切能力先定模型，再做接入', detail: '别先在页面里零散堆逻辑。' },
  { title: '权限要分页面访问和页面内操作', detail: '守卫和展示控制通常都需要。' },
  { title: '埋点要统一事件 schema', detail: '否则后续数据价值会大打折扣。' },
  { title: '国际化不只是翻译文本', detail: '格式和布局也要一起考虑。' },
] as const;

export default function FrontendSystemScenarioPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Scenario / System Design"
      title="权限系统、路由守卫、埋点、国际化"
      lead="这类题经常在面试里被问成四个零散点，但更好的回答方式是把它们看作前端里的横切基础设施。核心不是某个 API，而是统一模型、统一接入和统一约束。"
      heroCards={heroCards}
      definitionsTitle="块 1：场景定义（先把四类横切能力放回统一视角）"
      definitionsNote="用意：先知道它们各自控制什么，以及为什么不能散落实现。"
      definitions={definitions}
      relationsTitle="块 2：系统能力主线速览"
      relationsNote="用意：把访问控制、行为观测和本地化输出串起来。"
      relations={relations}
      relationCodeTitle="Cross-cutting Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础设计问题', note: '用意：先把权限、守卫、埋点、i18n 的基础模型讲清。', label: 'System Basics', questions: basics },
        { title: '块 4：落地治理问题', note: '用意：再把页面控制、SDK 封装和难点补全。', label: 'Implementation', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：设计这类横切能力时，按统一模型到统一接入的顺序来讲。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把横切能力做成页面级散装逻辑。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆这类系统题的稳定答法。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={scenarioTheme}
    />
  );
}
