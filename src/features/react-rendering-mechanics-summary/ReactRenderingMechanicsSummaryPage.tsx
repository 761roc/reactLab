import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { reactInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Mechanics', value: 'Render Flow', detail: 'key、协调、render/commit 和批量更新，都是 React 如何“更新界面”的问题。' },
  { label: 'Focus', value: 'Identity', detail: '很多渲染题最后都回到“React 如何识别这是同一个元素”。' },
  { label: 'Scenes', value: 'List / State Reset', detail: '列表、切页、条件渲染、状态重置和性能抖动都经常和这一组机制相关。' },
] as const;

const definitions = [
  { title: 'React 更新通常可以粗略理解成 render 和 commit 两阶段', detail: 'render 阶段决定下一棵 UI 树长什么样，commit 阶段把变化真正同步到 DOM。' },
  { title: 'key 用来帮助 React 识别列表项身份', detail: '它不是给浏览器看的，也不是为了消除 warning，而是让协调过程知道谁是谁。' },
  { title: '批量更新会把同一轮中的多个 state 更新合并处理', detail: '这样可以减少无意义的重复渲染。' },
  { title: 'React 不会总是“整页重渲染再整页重绘”', detail: '组件函数可能重新执行，但最终 DOM 提交只会落在真实差异上。' },
  { title: 'key 还能用来显式重建组件', detail: '当你需要强制重置内部状态时，变化 key 是个常见手段。' },
  { title: '中高级视角更看“身份”和“更新边界”', detail: '谁该复用、谁该重建、哪些更新能合并，决定了体验和正确性。' },
] as const;

const relations = [
  { title: 'render', detail: '计算下一次 UI 描述。', signal: 'Compute UI' },
  { title: 'reconcile', detail: '比较前后树，判断哪些节点复用、更新或删除。', signal: 'Diff' },
  { title: 'commit', detail: '把最终差异提交到 DOM。', signal: 'Apply Changes' },
  { title: 'key', detail: '为列表和条件切换提供稳定身份。', signal: 'Identity' },
] as const;

const relationCode = `state/props change
-> render phase
-> reconcile old/new tree
-> decide reuse by type + key
-> commit DOM changes`;

const basics = [
  {
    title: '问题 1：key 的作用到底是什么？',
    answer: 'key 的作用是帮助 React 在同层列表里识别元素身份，从而决定复用哪个旧节点、删除哪个、插入哪个。',
    explanation: '这题最好强调“身份识别”，不要只说“提高性能”或“避免 warning”。',
    code: `rows.map((row) => (
  <OrderRow key={row.id} row={row} />
));`,
    codeTitle: 'Stable Key',
  },
  {
    title: '问题 2：为什么不推荐用 index 作为 key？',
    answer: '当列表顺序会插入、删除、重排时，index 会让元素身份错位，可能导致状态复用到错误项上。',
    explanation: '这题的核心是状态错位，不只是性能。',
    code: `todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
));`,
    codeTitle: 'Index Key Risk',
  },
  {
    title: '问题 3：React 渲染流程怎么简要回答？',
    answer: '可以答成：state 或 props 变化后，React 先在 render 阶段计算下一棵 UI 树，再经过协调找出差异，最后在 commit 阶段把差异同步到 DOM。',
    explanation: '这是足够稳的简化版本，也适合大多数前端面试场景。',
    code: `setCount((value) => value + 1);
// -> render
// -> diff
// -> commit`,
    codeTitle: 'Render to Commit',
  },
  {
    title: '问题 4：批量更新是什么？',
    answer: '就是 React 会把同一轮中的多个 state 更新合并处理，减少中间无意义渲染，React 18 中自动批量更新覆盖范围更广。',
    explanation: '如果能顺手提到 React 18 自动批量更新，会更完整。',
    code: `setCount((value) => value + 1);
setVisible(true);
setKeyword('done');`,
    codeTitle: 'Batched Updates',
  },
] as const;

const practical = [
  {
    title: '问题 5：什么时候会故意改 key？',
    answer: '当你想强制某个子组件卸载并重新挂载，从而重置它内部状态时，改 key 是一个直接且常见的手段。',
    explanation: '这类题能体现你不仅知道 key 的列表用途，还知道它和组件身份的更深关系。',
    code: `function ProfilePane({ userId }: { userId: string }) {
  return <ProfileForm key={userId} userId={userId} />;
}`,
    codeTitle: 'Reset State by Key',
  },
  {
    title: '问题 6：为什么说“组件重新执行”不等于“DOM 全量重建”？',
    answer: '因为 render 阶段重新执行的是组件函数，真正是否改 DOM 要看协调后的差异；如果最终输出没变，commit 阶段可能很小。',
    explanation: '这句很适合用来澄清很多初学者的误解。',
    code: `function Label({ count }: { count: number }) {
  return <span>{count > 0 ? 'active' : 'idle'}</span>;
}`,
    codeTitle: 'Render != Full DOM Replace',
  },
  {
    title: '问题 7：列表渲染抖动时，除了 key 还该看什么？',
    answer: '还要看父组件是否频繁重渲染、列表项 props 是否稳定、是否有不必要的内联对象和函数、以及是否需要虚拟列表。',
    explanation: '中高级回答通常不会把所有问题都归到 key 上。',
    code: `const itemStyle = useMemo(() => ({ color: 'red' }), []);
const handleSelect = useCallback((id: string) => setSelectedId(id), []);`,
    codeTitle: 'Keep List Item Props Stable',
  },
  {
    title: '问题 8：面试里怎么总结这组机制？',
    answer: '先讲 render/commit 两阶段，再讲 key 如何帮助识别身份，最后补自动批量更新和状态重置场景。',
    explanation: '这样逻辑清楚，也能兼顾基础和稍深入的点。',
    code: `render -> reconcile -> commit
identity -> type + key
updates -> batching`,
    codeTitle: 'Mechanics Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先看组件身份是否稳定', detail: 'type 和 key 是第一层。' },
  { title: '第二步：再看父组件是否频繁触发 render', detail: '很多列表抖动源头在上层。' },
  { title: '第三步：检查 props 引用是否稳定', detail: '对象、函数、数组可能导致多余更新。' },
  { title: '第四步：区分函数重跑和 DOM 提交', detail: '别把两者混成一件事。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 key 理解成纯性能优化', detail: '它首先解决的是身份匹配和状态复用正确性。', points: ['身份识别', '状态复用', '再谈性能'] },
  { title: '高频误区 2：index key 到处乱用', detail: '只要列表会重排，就要警惕状态错位。', points: ['插入', '删除', '排序'] },
  { title: '高频误区 3：组件函数一重跑就以为 DOM 全重建', detail: '真正提交到 DOM 的还是看差异。', points: ['render', 'diff', 'commit'] },
  { title: '高频误区 4：只记批量更新名词，不知道目的', detail: '它的核心目的是减少中间无意义渲染和提交。', points: ['合并更新', '减少渲染', 'React 18 更广覆盖'] },
] as const;

const rules = [
  { title: 'key 先看身份，不先看 warning', detail: '身份识别是它的本职工作。' },
  { title: 'render 和 commit 分开理解', detail: '很多 React 机制题会清楚很多。' },
  { title: '组件重跑不等于 DOM 全改', detail: '最终还是以差异提交为准。' },
  { title: '改 key 可以主动重置状态', detail: '这是实际开发常用技巧。' },
] as const;

export default function ReactRenderingMechanicsSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="React Interview / Rendering"
      title="渲染机制：key、渲染流程、批量更新"
      lead="React 渲染机制相关的问题看起来零散，其实主线很统一：组件身份怎么识别、更新流程怎么走、为什么多次 setState 不一定触发多次提交。理解这一组机制，很多列表、状态重置和性能题都会更顺。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把渲染过程拆阶段）"
      definitionsNote="用意：先讲清 render / reconcile / commit 和 key 的定位。"
      definitions={definitions}
      relationsTitle="块 2：渲染主线速览"
      relationsNote="用意：把更新从 state 变化一路串到 DOM 提交。"
      relations={relations}
      relationCodeTitle="Rendering Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 key、渲染流程和批量更新答稳。', label: 'Rendering Basics', questions: basics },
        { title: '块 4：中高级补充问题', note: '用意：再把状态重置、DOM 差异和列表稳定性补全。', label: 'Rendering Depth', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到渲染机制题时，按身份、来源、引用和提交顺序拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把渲染机制答成口号。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆渲染机制的主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={reactInterviewTheme}
    />
  );
}
