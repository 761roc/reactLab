import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { reactInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scope', value: 'State Flow', detail: '受控/非受控、状态提升、Context 和组件通信，都是在回答“状态放哪、谁来管、怎么传”。' },
  { label: 'Focus', value: 'Single Source', detail: 'React 里很多状态题最后都会回到“谁是单一数据源”。' },
  { label: 'Scenes', value: 'Form / Shared UI', detail: '表单、筛选栏、弹窗、主题、权限、全局用户信息都很常见。' },
] as const;

const definitions = [
  { title: '受控组件由 React state 驱动', detail: '输入框、选择器、开关等值和变化都交给 React 管，表单状态更可控，也更容易联动。' },
  { title: '非受控组件更依赖 DOM 自己保存值', detail: 'React 只在需要时读取 DOM 值，适合简单表单或第三方库接入。' },
  { title: '状态提升本质是把共享状态放到最近的共同父组件', detail: '两个组件都需要这份状态时，让更上层持有，子组件只消费和触发变更。' },
  { title: 'Context 适合解决跨层级共享，不适合替代所有状态管理', detail: '用户信息、主题、语言、权限这类全局或半全局能力很适合，但高频细粒度更新要谨慎。' },
  { title: '组件通信不止 props 一种方式', detail: '常见还有回调、Context、自定义 Hook、局部 store、事件总线，但 React 里优先还是数据下发和事件上抛。' },
  { title: '中高级视角更看边界是否清晰', detail: '不是会不会写 Context，而是知道什么时候该状态提升、什么时候该局部化、什么时候该引入 store。' },
] as const;

const relations = [
  { title: '受控组件', detail: '值在 React state 中，组件行为更容易编排。', signal: 'Controlled' },
  { title: '非受控组件', detail: '值更多留在 DOM，接入成本低但可编排性弱。', signal: 'Uncontrolled' },
  { title: '状态提升', detail: '共享状态上提到最近公共父级。', signal: 'Lift State Up' },
  { title: 'Context', detail: '解决跨层级传递，不解决所有复杂状态问题。', signal: 'Cross-tree Share' },
] as const;

const relationCode = `局部输入
-> 只自己用: 可局部 state / 非受控
-> 多组件共享: 状态提升
-> 跨层级长期共享: Context
-> 更新复杂且范围大: 再考虑局部 store`;

const basics = [
  {
    title: '问题 1：受控和非受控组件最本质的区别是什么？',
    answer: '最本质的区别是数据源在哪。受控组件以 React state 为准，非受控组件以 DOM 当前值为准。',
    explanation: '这类题不要只说“一个有 value，一个有 ref”，要回到单一数据源的概念。',
    code: `function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <input ref={inputRef} defaultValue="hello" />;
}`,
    codeTitle: 'Controlled vs Uncontrolled',
  },
  {
    title: '问题 2：什么时候更适合用受控组件？',
    answer: '当你需要联动校验、格式化、条件展示、提交前统一收集，或者多个输入之间互相影响时，更适合用受控组件。',
    explanation: '中高级回答的关键是讲“编排能力”，不是只说“更常用”。',
    code: `const [form, setForm] = useState({ email: '', agree: false });

const canSubmit = form.email.includes('@') && form.agree;

return <button disabled={!canSubmit}>提交</button>;`,
    codeTitle: 'Form Orchestration',
  },
  {
    title: '问题 3：状态提升怎么讲更稳？',
    answer: '当多个兄弟组件都依赖同一份数据时，把这份数据上提到最近的公共父组件，由父组件统一持有，再通过 props 下发和回调上抛。',
    explanation: '这题最怕讲成“把 state 往上挪”这种没有因果的描述。',
    code: `function TemperaturePanel() {
  const [celsius, setCelsius] = useState('');

  return (
    <>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitView value={toFahrenheit(celsius)} />
    </>
  );
}`,
    codeTitle: 'Lift Shared State',
  },
  {
    title: '问题 4：Context 什么时候合适？',
    answer: '当数据需要跨很多层传递，且语义上属于应用级或 feature 级共享能力，比如主题、语言、用户信息、权限时，Context 很合适。',
    explanation: '这里最好带一句“高频细粒度更新要谨慎”，会显得更成熟。',
    code: `const ThemeContext = createContext<'light' | 'dark'>('light');

function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}`,
    codeTitle: 'Context for Shared Capability',
  },
] as const;

const practical = [
  {
    title: '问题 5：组件通信有哪些常见方式，怎么选？',
    answer: '父子优先 props 和回调，兄弟优先状态提升，跨层共享用 Context，复杂跨模块状态再考虑局部 store 或专门状态库。',
    explanation: '这题真正要体现的是你会按作用域和复杂度选方案，而不是随手全上 Context。',
    code: `父 -> 子: props
子 -> 父: callback
兄弟: lift state up
跨层级共享: context
复杂跨区域: local store / state library`,
    codeTitle: 'Communication Ladder',
  },
  {
    title: '问题 6：为什么说 Context 不适合所有状态？',
    answer: '因为 Context 的 value 一变，所有消费它的组件都有机会重新渲染；如果你把高频变化、结构复杂的大对象塞进去，性能和维护都会变差。',
    explanation: '这句是中高级 React 面试里很常见的分水岭。',
    code: `const AppContext = createContext<AppState | null>(null);

// 如果这个 state 里既有 theme、user，又有高频输入状态，更新范围就会很大。`,
    codeTitle: 'Context Update Cost',
  },
  {
    title: '问题 7：表单库为什么很多会混合受控和非受控思路？',
    answer: '因为纯受控在大表单里更新成本更高，而非受控配合注册和统一读取可以兼顾性能和接入体验。',
    explanation: '这个点能体现你不只是会背概念，还知道真实库的折中设计。',
    code: `function SubmitForm() {
  const nameRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    console.log(nameRef.current?.value);
  }
}`,
    codeTitle: 'Uncontrolled for Large Forms',
  },
  {
    title: '问题 8：面试里怎么总结这一组题？',
    answer: '核心是先确定状态作用域和单一数据源，再决定用局部 state、状态提升、Context 还是更专门的状态方案。',
    explanation: '这句能把受控/非受控、通信、Context 都串起来。',
    code: `作用域 -> 单一数据源 -> 通信路径 -> 更新成本 -> 方案选择`,
    codeTitle: 'State Flow Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问这份状态归谁管', detail: '先定单一数据源。' },
  { title: '第二步：再看是局部共享还是跨层共享', detail: '决定状态提升还是 Context。' },
  { title: '第三步：检查更新频率和影响范围', detail: '防止把高频状态塞进 Context。' },
  { title: '第四步：按真实场景选受控或非受控', detail: '表单编排和性能取舍都要考虑。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：所有表单都默认纯受控', detail: '大表单和第三方库接入时，非受控或混合方案可能更合适。', points: ['看场景', '看编排需求', '看性能'] },
  { title: '高频误区 2：Context 当全能状态管理', detail: '它适合共享能力，不适合所有高频复杂状态。', points: ['更新范围', '拆分 provider', '局部化使用'] },
  { title: '高频误区 3：兄弟组件互相直接改状态', detail: '共享状态最好回到共同父级。', points: ['状态提升', '单一数据源', '避免双向依赖'] },
  { title: '高频误区 4：通信方案只会背名词', detail: '中高级更看你能不能按作用域和复杂度做取舍。', points: ['局部 state', 'lift', 'context', 'store'] },
] as const;

const rules = [
  { title: '先定单一数据源，再谈通信方式', detail: 'React 状态题最稳的主线。' },
  { title: '兄弟共享优先状态提升', detail: '比绕路通信更清晰。' },
  { title: 'Context 用来跨层共享，不用来兜所有状态', detail: '尤其警惕高频更新。' },
  { title: '受控还是非受控，看编排需求和性能取舍', detail: '不是固定答案题。' },
] as const;

export default function ReactStateCommunicationSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="React Interview / State"
      title="状态与通信：受控/非受控、状态提升、Context"
      lead="这组题本质上都在讨论状态边界。谁来持有状态、谁负责更新、怎么把状态传给别的组件，以及什么时候该用受控、状态提升或 Context，才是回答的主线。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把状态流向讲清）"
      definitionsNote="用意：先统一“单一数据源”和“共享范围”的心智模型。"
      definitions={definitions}
      relationsTitle="块 2：状态流向速览"
      relationsNote="用意：把受控、状态提升和 Context 放到同一条决策线里。"
      relations={relations}
      relationCodeTitle="State Ownership"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把受控、状态提升和 Context 基本盘答稳。', label: 'State Basics', questions: basics },
        { title: '块 4：中高级实战问题', note: '用意：再把通信选型和真实表单场景补全。', label: 'State Tradeoff', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 React 状态题时，按作用域和更新成本来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把状态题答成死记硬背。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆状态流向的稳定答法。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={reactInterviewTheme}
    />
  );
}
