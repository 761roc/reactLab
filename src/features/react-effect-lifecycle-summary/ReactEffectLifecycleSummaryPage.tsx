import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { reactInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Effect', value: 'Side Effects', detail: 'useEffect 处理的是同步渲染之外的副作用，比如订阅、请求、计时器和 DOM 同步。' },
  { label: 'Focus', value: 'After Commit', detail: 'Effect 的核心时机是 commit 之后，而不是 render 过程中。' },
  { label: 'Risk', value: 'Cleanup', detail: '订阅泄漏、重复请求、定时器残留、旧闭包，很多坑都和清理逻辑有关。' },
] as const;

const definitions = [
  { title: 'useEffect 主要处理副作用，不是用来写所有业务逻辑', detail: '它适合订阅、请求、日志、命令式 DOM 同步、定时器等和外部世界交互的事情。' },
  { title: 'Effect 在组件提交到 DOM 之后执行', detail: '因此它和渲染阶段不同，不应该在 effect 里做会阻塞首帧的大量同步计算。' },
  { title: 'cleanup 会在下一次 effect 执行前和组件卸载时触发', detail: '这也是取消订阅、清定时器、abort 请求的关键位置。' },
  { title: '依赖数组决定 effect 何时重新运行', detail: '不是“写不写都行”，而是 effect 用到了什么响应式值，就应正确声明依赖。' },
  { title: 'Strict Mode 下开发环境 effect 可能被额外执行一次', detail: '这是为了帮助发现不安全的副作用逻辑，不代表生产环境一定双跑。' },
  { title: '中高级 React 更强调 effect 最小化', detail: '能在 render 阶段纯计算得到的东西，不要硬塞进 effect。' },
] as const;

const relations = [
  { title: 'Render', detail: '纯计算和 JSX 产出，不应该做副作用。', signal: 'Pure Phase' },
  { title: 'Commit', detail: 'DOM 更新完成，effect 才开始接管。', signal: 'After Commit' },
  { title: 'Cleanup', detail: '在下次 effect 前或卸载时清理旧副作用。', signal: 'Dispose Old Work' },
  { title: 'Dependencies', detail: '描述 effect 依赖哪些响应式值。', signal: 'Re-run Control' },
] as const;

const relationCode = `render
-> commit DOM
-> run effect
-> state/props change
-> cleanup previous effect
-> run next effect`;

const basics = [
  {
    title: '问题 1：effect 什么时候执行？',
    answer: 'useEffect 在组件渲染并提交到 DOM 之后执行，所以它不属于 render 阶段。',
    explanation: '这句是最基础也最关键的时机描述。',
    code: `function UserPanel({ userId }: { userId: string }) {
  useEffect(() => {
    console.log('effect after commit', userId);
  }, [userId]);

  return <section>{userId}</section>;
}`,
    codeTitle: 'Effect Runs After Commit',
  },
  {
    title: '问题 2：cleanup 什么时候触发？',
    answer: '它会在下一次 effect 重新执行前先跑一遍旧 cleanup，也会在组件卸载时执行。',
    explanation: '很多人只记得卸载，其实依赖变化触发的“先清后跑”同样重要。',
    code: `useEffect(() => {
  const timer = window.setInterval(tick, 1000);

  return () => {
    clearInterval(timer);
  };
}, [tick]);`,
    codeTitle: 'Cleanup Before Re-run',
  },
  {
    title: '问题 3：请求为什么常要在 cleanup 里取消？',
    answer: '因为用户切页、参数变化或组件卸载后，旧请求返回的数据可能已经过时，取消它可以减少资源浪费和结果覆盖。',
    explanation: '这不仅是避免 warning，更是控制正确性。',
    code: `useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal });

  return () => controller.abort();
}, [userId]);`,
    codeTitle: 'Abort Request on Cleanup',
  },
  {
    title: '问题 4：为什么依赖数组经常出问题？',
    answer: '因为 effect 闭包会捕获当前渲染时的值，如果依赖没声明完整，就容易读到旧值或逻辑不同步。',
    explanation: 'effect 题和闭包题经常是连在一起的。',
    code: `useEffect(() => {
  if (count > 3) {
    report(count);
  }
}, [count]);`,
    codeTitle: 'Depend on What You Read',
  },
] as const;

const practical = [
  {
    title: '问题 5：为什么说很多 effect 其实可以不要？',
    answer: '因为很多所谓“effect 逻辑”本质只是派生值或同步计算，完全可以在 render 阶段用变量或 useMemo 表达，不必再多一层副作用。',
    explanation: '这是 React 官方现在特别强调的方向，也是中高级面试常见补充点。',
    code: `// 不需要 effect
const fullName = \`\${user.firstName} \${user.lastName}\`;`,
    codeTitle: 'Derive in Render Instead of Effect',
  },
  {
    title: '问题 6：Strict Mode 下 effect 双执行怎么解释？',
    answer: '开发环境下 React 会额外执行一轮 mount + cleanup + mount，帮助你发现不安全的副作用，比如重复订阅、非幂等请求等。',
    explanation: '面试里说出“帮助发现副作用问题”这层目的，会更完整。',
    code: `useEffect(() => {
  subscribe();
  return () => unsubscribe();
}, []);`,
    codeTitle: 'Strict Mode Needs Idempotent Effects',
  },
  {
    title: '问题 7：什么时候该用 useLayoutEffect？',
    answer: '当你需要在浏览器绘制前同步读取布局或做测量、滚动位置修正这类事情时才更合适，但要谨慎，因为它更容易阻塞渲染。',
    explanation: '这是 effect 时机题的常见延伸。',
    code: `useLayoutEffect(() => {
  const height = ref.current?.getBoundingClientRect().height;
  syncHeight(height ?? 0);
}, []);`,
    codeTitle: 'Layout-sensitive Effect',
  },
  {
    title: '问题 8：面试里怎么总结 effect？',
    answer: 'effect 是 render 之后和外部世界同步的地方，依赖数组控制何时同步，cleanup 负责撤销旧副作用，能不用 effect 的逻辑尽量不用。',
    explanation: '这句适合把时机、依赖和清理一起收住。',
    code: `副作用 -> effect
依赖 -> 何时重跑
cleanup -> 何时撤销
纯计算 -> 不要塞进 effect`,
    codeTitle: 'Effect Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问这是不是副作用', detail: '纯计算别先写 effect。' },
  { title: '第二步：列出 effect 读取了哪些响应式值', detail: '依赖数组就按它来。' },
  { title: '第三步：思考旧副作用何时该撤销', detail: '订阅、定时器、请求都要 cleanup。' },
  { title: '第四步：检查 Strict Mode 下是否幂等', detail: '防止开发环境暴露副作用漏洞。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把所有逻辑都塞进 effect', detail: '这会让代码更绕，也更容易制造额外状态同步问题。', points: ['纯计算直接 render', '派生值直接算', '副作用才进 effect'] },
  { title: '高频误区 2：依赖数组凭感觉省略', detail: '闭包旧值和逻辑错乱往往都从这里开始。', points: ['依赖完整', '理解闭包', '别侥幸跳过'] },
  { title: '高频误区 3：忘记 cleanup', detail: '订阅泄漏、重复计时器、旧请求覆盖新请求都很常见。', points: ['取消订阅', 'clear timer', 'abort request'] },
  { title: '高频误区 4：Strict Mode 双跑就误判 React 有 bug', detail: '很多时候是副作用逻辑本身不安全。', points: ['开发环境特性', '帮助暴露问题', '检查幂等性'] },
] as const;

const rules = [
  { title: '副作用才进 effect', detail: '别把 effect 当第二个 render。' },
  { title: 'cleanup 先于下一次 effect 执行', detail: '这是很多资源释放题的关键。' },
  { title: '依赖数组按实际读取值来写', detail: '别按想当然省略。' },
  { title: '能不用 effect 就不用', detail: '这会让组件更纯、更好维护。' },
] as const;

export default function ReactEffectLifecycleSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="React Interview / Effect"
      title="Effect 执行时机和清理逻辑"
      lead="effect 相关问题几乎是 React 面试里的必考点。真正有区分度的地方在于，你是不是理解它和 render 的边界、cleanup 的真实时机，以及为什么很多逻辑其实根本不该写成 effect。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把 effect 放回 render 之后）"
      definitionsNote="用意：先明确 effect 在 React 生命周期中的位置。"
      definitions={definitions}
      relationsTitle="块 2：effect 时序速览"
      relationsNote="用意：把 render、commit、cleanup 和依赖串起来。"
      relations={relations}
      relationCodeTitle="Effect Timing"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把时机、cleanup 和依赖讲稳。', label: 'Effect Basics', questions: basics },
        { title: '块 4：中高级取舍问题', note: '用意：再把 Strict Mode、layout effect 和“少用 effect”补全。', label: 'Effect Tradeoff', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到副作用题时，按是否真是副作用来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把 effect 用成万能胶水。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆 effect 的边界。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={reactInterviewTheme}
    />
  );
}
