import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '10', detail: '代码分割、懒加载、预加载、缓存、资源压缩、监控与构建优化。' },
  { label: 'Core', value: 'Fast + Stable', detail: '工程优化不是单一指标冲刺，而是体积、速度、稳定性一起平衡。' },
  { label: 'Scenes', value: 'Build / Runtime', detail: '有些优化发生在构建阶段，有些发生在资源加载和运行时。' },
] as const;

const definitions = [
  { title: '代码分割是把代码拆成更小的 chunk', detail: '这样用户不必在首屏一次性下载所有功能。' },
  { title: '懒加载是按需要再加载资源', detail: '它通常建立在代码分割基础上，但更强调加载时机。' },
  { title: '预加载和预取是在“提前准备”资源', detail: '一个更偏当前高优先级，一个更偏未来可能会用到。' },
  { title: '缓存优化让重复访问更便宜', detail: '包括浏览器缓存、CDN 缓存和接口缓存策略。' },
  { title: '资源优化不仅是 JS', detail: '图片、字体、CSS、source map、第三方脚本都可能成为体积瓶颈。' },
  { title: '监控是优化闭环的一部分', detail: '没有数据就很难判断优化有没有真的起作用。' },
] as const;

const relations = [
  { title: '构建期优化', detail: '压缩、拆包、摇树、资源内联阈值等。', signal: 'Build Time' },
  { title: '加载期优化', detail: '懒加载、预加载、缓存、CDN、HTTP 策略。', signal: 'Load Time' },
  { title: '运行期优化', detail: '减少长任务、虚拟列表、按需渲染、避免重复请求。', signal: 'Runtime' },
  { title: '观测与回归', detail: '通过指标和分析工具持续验证效果。', signal: 'Measure' },
] as const;

const relationCode = `优化目标
-> 降首屏成本
-> 降重复访问成本
-> 降运行时阻塞
-> 用监控验证结果`;

const basics = [
  {
    title: '问题 1：工程化里最常见的优化方向有哪些？',
    answer: '可以从构建产物、资源加载、运行时执行和可观测性四层来答。',
    explanation: '这样比零散罗列术语更像真实工程思路。',
    code: `构建期 -> tree shaking / 压缩 / 拆包
加载期 -> lazy / preload / cache
运行期 -> 虚拟列表 / 批处理 / 防抖
观测 -> bundle report / web vitals`,
    codeTitle: 'Optimization Layers',
  },
  {
    title: '问题 2：代码分割和懒加载分别在解决什么？',
    answer: '代码分割解决“怎么拆”，懒加载解决“什么时候再加载”。',
    explanation: '这是优化题的高频对比点，最好一句话就分开。',
    code: `const ReportPage = lazy(() => import('./ReportPage'));`,
    codeTitle: 'Lazy Route Example',
  },
  {
    title: '问题 3：为什么首屏不该一次性把所有图表、编辑器都打进主包？',
    answer: '因为这些重量级依赖会抬高首屏下载、解析和执行成本，很多用户一开始根本用不到。',
    explanation: '优化题重点不是“技术上能不能”，而是“用户当下需不需要”。',
    code: `if (user.opensAdvancedPanel) {
  import('./charts');
}`,
    codeTitle: 'Load Heavy Code Later',
  },
  {
    title: '问题 4：除了代码分割，还有哪些构建期优化常见？',
    answer: 'tree shaking、压缩、移除未用 polyfill、优化 source map、提取公共依赖、资源 hash 命名都很常见。',
    explanation: '构建期优化最好别只会说拆包。',
    code: `build: {
  sourcemap: false,
  minify: 'esbuild',
}`,
    codeTitle: 'Build Options',
  },
  {
    title: '问题 5：资源加载层还能做什么？',
    answer: '可以做 CDN、强缓存、预加载关键资源、图片格式优化、字体子集化、第三方脚本延后加载。',
    explanation: '工程优化很多时候不是 JS 独角戏。',
    code: `<link rel="preload" href="/fonts/app.woff2" as="font" crossorigin />`,
    codeTitle: 'Preload Key Asset',
  },
] as const;

const practical = [
  {
    title: '问题 6：大页面为什么适合按路由和功能块拆包？',
    answer: '因为用户一次通常只进入一小部分功能，按路由或业务块拆能明显减少首次成本。',
    explanation: '拆包不是越碎越好，而是按访问路径合理拆。',
    code: `const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));`,
    codeTitle: 'Route-based Splitting',
  },
  {
    title: '问题 7：懒加载一定越多越好吗？',
    answer: '不是。拆得太碎会增加请求数和调度成本，关键是按访问概率和体积收益去平衡。',
    explanation: '优化题一定要体现“收益和成本”的权衡。', 
    code: `// 重组件懒加载很值
const RichEditor = lazy(() => import('./RichEditor'));

// 很小且高频的基础组件没必要拆太碎`,
    codeTitle: 'Split With Tradeoff',
  },
  {
    title: '问题 8：运行时还能做哪些优化？',
    answer: '减少重复请求、长列表虚拟化、事件防抖节流、分片执行重任务、避免无意义重渲染都很常见。',
    explanation: '这能把优化题从构建层延伸到用户真实交互层。',
    code: `const onSearch = debounce(fetchUsers, 250);
const rows = useVirtualRows(data);`,
    codeTitle: 'Runtime Optimization',
  },
  {
    title: '问题 9：怎么验证优化真的生效？',
    answer: '看包体积报告、网络瀑布图、Web Vitals、真实用户监控和关键路径时长，而不是只靠感觉。',
    explanation: '工程优化没有验证就很容易沦为表演。',
    code: `LCP
CLS
INP
主包体积
首屏请求数`,
    codeTitle: 'Metrics Checklist',
  },
  {
    title: '问题 10：这一类题最后怎么答得更完整？',
    answer: '按“构建期、加载期、运行期、监控验证”四层收尾，同时补一句优化要服务业务路径而不是盲目追指标。',
    explanation: '这样整页内容会形成闭环。',
    code: `构建 -> 产物更小
加载 -> 首屏更轻
运行 -> 交互更顺
监控 -> 结果可验证`,
    codeTitle: 'Optimization Answer Loop',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先确认瓶颈在构建、加载还是运行时', detail: '不同层的问题优化手段完全不同。' },
  { title: '第二步：看是否存在明显的重量级依赖前置加载', detail: '编辑器、图表、富媒体资源最常见。' },
  { title: '第三步：再看缓存和资源策略', detail: '重复访问慢很多时候不是代码本身，而是缓存没设计好。' },
  { title: '第四步：用指标验证，而不是靠主观体感', detail: '体感可以参考，但不能当唯一依据。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把优化只理解成“把包做小”', detail: '运行时卡顿、请求策略不合理、第三方脚本阻塞同样常见。', points: ['构建', '加载', '运行', '监控'] },
  { title: '高频误区 2：懒加载越多越好', detail: '拆得过碎也会增加调度和请求成本。', points: ['按访问路径拆', '按体积收益拆', '别盲目碎片化'] },
  { title: '高频误区 3：优化后不验证', detail: '没有指标支撑，很难知道到底是收益还是副作用。', points: ['bundle report', 'web vitals', '真实监控'] },
  { title: '高频误区 4：只盯 JS，不看图片字体第三方资源', detail: '很多首屏问题其实出在资源策略上。', points: ['图片格式', '字体', '第三方脚本'] },
] as const;

const rules = [
  { title: '先定位瓶颈层级，再选优化手段', detail: '别一上来就机械套懒加载。' },
  { title: '代码分割解决怎么拆，懒加载解决何时加载', detail: '这句最适合高频对比题。' },
  { title: '优化必须看业务路径', detail: '不是所有功能都值得首屏加载。' },
  { title: '最终一定回到指标验证', detail: '没有验证就没有完整闭环。' },
] as const;

export default function EngineeringOptimizationSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / Optimization"
      title="工程化优化专题"
      lead="工程化优化不是只会说代码分割和懒加载。更完整的思路应该把构建期、加载期、运行期和监控验证串起来，然后根据真实业务路径决定优化优先级。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把几类优化分层）"
      definitionsNote="用意：先知道优化到底发生在哪一层。"
      definitions={definitions}
      relationsTitle="块 2：优化主线速览"
      relationsNote="用意：把构建、加载、运行和验证串成闭环。"
      relations={relations}
      relationCodeTitle="Optimization Loop"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把代码分割、懒加载和构建优化答稳。', label: 'Optimization Basics', questions: basics },
        { title: '块 4：工程实践问题', note: '用意：再把拆包策略、运行时优化和指标验证落到真实场景。', label: 'Practical Optimization', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到性能和工程优化题时按瓶颈层级来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把优化题里最容易走偏的点提前拆掉。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆工程优化的闭环主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={engineeringTheme}
    />
  );
}
