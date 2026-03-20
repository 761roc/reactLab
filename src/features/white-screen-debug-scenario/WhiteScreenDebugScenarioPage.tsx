import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { scenarioTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scenario', value: 'White Screen', detail: '用户打开页面什么都没有，最怕的是“线上偶现、复现不稳”。' },
  { label: 'Focus', value: 'Boot Path', detail: '白屏排查的关键是按启动链路一层层缩小范围，而不是盲猜。' },
  { label: 'Signals', value: 'Network / Console / DOM', detail: '网络、控制台、资源、挂载节点和错误边界是最先看的几层。' },
] as const;

const definitions = [
  { title: '白屏不等于只有 JS 报错', detail: '可能是 HTML 根本没回来、静态资源 404、脚本执行前就被 CSP 挡住、运行时报错、路由死循环，甚至只是内容被样式盖住。' },
  { title: '排查要按启动链路走', detail: '先确认 HTML、再确认静态资源、再确认入口脚本执行、再确认组件树有没有成功挂载。' },
  { title: '控制台和网络面板通常是第一现场', detail: '很多白屏其实 1 分钟内就能在这里看到关键线索。' },
  { title: '错误边界是线上兜底手段，不是根因修复', detail: '它能避免整页崩掉，但仍然要回头修真实异常。' },
  { title: '白屏有时只是看起来白屏', detail: '比如根节点高度塌了、文本颜色和背景相同、全屏 loading 永远不消失。' },
  { title: '线上白屏题一定要带上监控', detail: 'Sentry、埋点、资源错误上报和版本号信息会大大提高定位效率。' },
] as const;

const relations = [
  { title: 'HTML', detail: '入口文档有没有正常返回。', signal: 'Document' },
  { title: '静态资源', detail: 'JS/CSS 是否 404、跨域失败或加载顺序异常。', signal: 'Assets' },
  { title: '入口执行', detail: '应用启动代码有没有在挂载前报错。', signal: 'Bootstrap' },
  { title: '组件挂载', detail: '根组件是否成功渲染，还是被运行时异常打断。', signal: 'Render' },
] as const;

const relationCode = `白屏
-> 看 HTML 是否返回
-> 看 JS/CSS 是否加载成功
-> 看入口脚本是否执行
-> 看根组件是否挂载
-> 看运行时异常和样式覆盖`;

const basics = [
  {
    title: '问题 1：白屏时第一步看什么？',
    answer: '先开 Network 和 Console，看入口 HTML、核心 JS/CSS 是否成功返回，以及控制台有没有立即报错。',
    explanation: '这是最稳的第一步。不要先从业务代码漫无目的地下手。',
    code: `// 重点先看
// 1. index.html 是否 200
// 2. main.js / main.css 是否 200
// 3. Console 是否有 syntax / runtime / chunk load error`,
    codeTitle: 'First Checks',
  },
  {
    title: '问题 2：如果 HTML 能回来，但页面还是空白，常见原因是什么？',
    answer: '常见是入口脚本没加载、脚本执行报错、根节点没挂上、路由重定向异常，或者样式把内容“隐藏”了。',
    explanation: '这题最好体现你知道白屏并不都来自业务组件。',
    code: `const root = document.getElementById('root');

if (!root) {
  throw new Error('Root container not found');
}

createRoot(root).render(<App />);`,
    codeTitle: 'Bootstrap Failure Example',
  },
  {
    title: '问题 3：Chunk 加载失败导致白屏时怎么处理？',
    answer: '通常要先确认构建产物和 CDN 缓存是否错位，再在前端给出刷新兜底或降级提示。',
    explanation: '上线新版本后最常见的白屏之一就是老 HTML 指向新资源或新 HTML 指向旧资源不一致。',
    code: `window.addEventListener('error', (event) => {
  if (String(event.message).includes('Loading chunk')) {
    showReloadModal();
  }
});`,
    codeTitle: 'Chunk Load Fallback',
  },
  {
    title: '问题 4：如果控制台没报错，也可能白屏吗？',
    answer: '可能。比如根节点高度为 0、全屏 loading 没取消、文字颜色与背景一致、内容被 fixed 遮罩层盖住，控制台不一定报错。',
    explanation: '这就是为什么 DOM 和样式层也必须看。',
    code: `#root {
  min-height: 100vh;
}

.appShell {
  color: #0f172a;
  background: #ffffff;
}`,
    codeTitle: 'Check Visual Layer Too',
  },
] as const;

const practical = [
  {
    title: '问题 5：线上偶发白屏，怎么提高排查效率？',
    answer: '加启动链路埋点和错误上报，记录版本号、路由、资源 URL、浏览器信息、首个异常栈和资源错误。',
    explanation: '没有观测数据时，线上白屏排查会非常被动。',
    code: `window.addEventListener('error', (event) => {
  reportStartupError({
    message: event.message,
    filename: event.filename,
    version: APP_VERSION,
    route: location.pathname,
  });
});`,
    codeTitle: 'Startup Error Reporting',
  },
  {
    title: '问题 6：错误边界在白屏场景里怎么用？',
    answer: '用它兜住局部或全局渲染异常，至少给出可见的失败提示和刷新入口，而不是整页空白。',
    explanation: '这是线上体验层面的兜底，不是根因替代。',
    code: `class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FatalFallback onReload={() => location.reload()} />;
    }

    return this.props.children;
  }
}`,
    codeTitle: 'Error Boundary Fallback',
  },
  {
    title: '问题 7：面试里怎么总结白屏排查思路？',
    answer: '按“文档返回、静态资源、入口执行、组件挂载、样式遮挡、线上监控”六层去讲。',
    explanation: '这比直接说“先看报错”完整得多。',
    code: `Document -> Assets -> Bootstrap -> Render -> Visual Layer -> Monitoring`,
    codeTitle: 'Diagnosis Layers',
  },
  {
    title: '问题 8：如果要给一个短句总结，怎么说？',
    answer: '白屏排查不是盯着 React 组件找，而是顺着页面启动链路一层层排，先确认加载，再确认执行，再确认渲染和展示。',
    explanation: '这个总结很适合口头表达，也容易让面试官感受到你有排障经验。',
    code: `先加载 -> 再执行 -> 再渲染 -> 再展示`,
    codeTitle: 'Answer Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：看 Network 和 Console', detail: '确认文档、资源和首个错误。' },
  { title: '第二步：检查根节点和入口执行', detail: '确认应用到底有没有成功启动。' },
  { title: '第三步：检查样式层和遮罩层', detail: '防止“不是没渲染，而是看不见”。' },
  { title: '第四步：回到线上监控和版本信息', detail: '用真实环境数据缩小范围。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：白屏只查业务组件', detail: '入口 HTML、chunk、CSP、样式覆盖都可能是根因。', points: ['先看启动链路', '别只盯组件', '先大后小'] },
  { title: '高频误区 2：只看 console，不看 network', detail: '资源加载失败、chunk 404、跨域失败很多都在网络面板里。', points: ['HTML', 'JS/CSS', '状态码和 URL'] },
  { title: '高频误区 3：线上白屏没有监控信息', detail: '没有版本、路由和错误栈，排查效率会很低。', points: ['错误上报', '资源错误上报', '版本信息'] },
  { title: '高频误区 4：把错误边界当成根因修复', detail: '它能兜底，但不能代替真正修 bug。', points: ['先兜底', '再修根因', '监控继续跟踪'] },
] as const;

const rules = [
  { title: '白屏先查加载链，不先猜业务逻辑', detail: '入口和资源层比组件层更优先。' },
  { title: 'Console 和 Network 一起看', detail: '两个面板缺一不可。' },
  { title: '白屏也要看样式层', detail: '有时只是内容被“藏起来了”。' },
  { title: '线上必须配监控和错误边界', detail: '这样排查和用户体验都更稳。' },
] as const;

export default function WhiteScreenDebugScenarioPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Scenario / Debug"
      title="页面白屏怎么排查"
      lead="白屏是典型的高压场景题，因为它往往发生在线上，而且可能根本不是业务代码本身的问题。最稳的处理方式不是盲猜，而是顺着页面启动链路逐层排查，再用错误上报和版本信息收窄范围。"
      heroCards={heroCards}
      definitionsTitle="块 1：场景定义（先知道白屏可能卡在哪层）"
      definitionsNote="用意：先把入口、资源、执行、渲染和样式这几层分清。"
      definitions={definitions}
      relationsTitle="块 2：排查主线速览"
      relationsNote="用意：把白屏从“现象”拆回页面启动链路。"
      relations={relations}
      relationCodeTitle="White Screen Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础排查问题', note: '用意：先把第一现场怎么查说清。', label: 'First Response', questions: basics },
        { title: '块 4：线上处理问题', note: '用意：再把错误边界、监控和总结答法补全。', label: 'Online Debugging', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：面试和真实排查都可以按这条顺序讲。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把白屏题答得太窄。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆稳定排查主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={scenarioTheme}
    />
  );
}
