import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { reactInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Hook Design', value: 'Abstraction', detail: '自定义 Hook 的核心不是“复用几行代码”，而是抽离稳定的状态模型和副作用边界。' },
  { label: 'Focus', value: 'Behavior Unit', detail: '好的 Hook 应该围绕一个清晰行为单元，而不是把一堆不相关逻辑塞进去。' },
  { label: 'Scenes', value: 'Search / Modal / Pagination', detail: '筛选、分页、表单草稿、订阅、媒体查询、请求控制都很常见。' },
] as const;

const definitions = [
  { title: '自定义 Hook 是逻辑复用和状态模型抽离工具', detail: '它让你把某个稳定行为单元从组件里提出来，而不是复制粘贴逻辑。' },
  { title: '好的 Hook 通常围绕一个职责清晰的问题域', detail: '比如 usePagination、useDebouncedValue、useModal、useOrderFilters，而不是“万能 usePageLogic”。' },
  { title: 'Hook 的返回值也是 API 设计', detail: '是返回对象、元组、事件函数还是派生状态，都会影响调用体验和扩展性。' },
  { title: 'Hook 要尽量隐藏实现细节，只暴露必要能力', detail: '调用方应该更多关注“我能做什么”，而不是“内部怎么实现”。' },
  { title: 'Hook 边界常和 effect、ref、memo 一起出现', detail: '很多复杂组件其实是先把状态与副作用封进 Hook，再让 UI 变薄。' },
  { title: '中高级更看 Hook 是否抽对层次', detail: '抽得太浅价值小，抽得太大又会变成“黑箱大杂烩”。' },
] as const;

const relations = [
  { title: 'State Model', detail: 'Hook 内部封装状态和状态切换规则。', signal: 'State' },
  { title: 'Effects', detail: 'Hook 内处理订阅、请求、监听和清理。', signal: 'Side Effects' },
  { title: 'Commands', detail: '返回给组件的操作函数构成 Hook API。', signal: 'Actions' },
  { title: 'Derived Values', detail: 'Hook 也可以顺便暴露派生状态。', signal: 'Computed' },
] as const;

const relationCode = `组件里逻辑过重
-> 识别稳定行为单元
-> 抽成 custom hook
-> 暴露 state + actions + derived values
-> 页面只负责组合 UI`;

const basics = [
  {
    title: '问题 1：什么场景值得抽自定义 Hook？',
    answer: '当一组状态、派生值和副作用总是一起出现，且会在多个组件或同一类页面里重复时，就很适合抽 Hook。',
    explanation: '这题要体现“行为单元”概念，而不是“有重复代码就抽”。',
    code: `function useOrderFilters(initialStatus: Status = 'all') {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const deferredKeyword = useDeferredValue(keyword);

  return { keyword, status, deferredKeyword, setKeyword, setStatus };
}`,
    codeTitle: 'Behavior-focused Hook',
  },
  {
    title: '问题 2：Hook 返回对象还是数组怎么选？',
    answer: '当返回值语义较多、字段可能扩展时更适合对象；当返回值结构非常固定、语义一目了然时数组也可以。',
    explanation: '中高级面试更看 API 可读性和未来扩展性。',
    code: `const { keyword, status, setKeyword, setStatus } = useOrderFilters();`,
    codeTitle: 'Prefer Readable Object API',
  },
  {
    title: '问题 3：Hook 里能不能放请求逻辑？',
    answer: '能，但要看边界。像 useUserQuery、useProjectSearch 这种围绕单一数据域的 Hook 很合理；如果把多个不相关请求和页面逻辑全塞进去，就会变重。',
    explanation: '抽 Hook 不是为了把页面里的问题藏起来。',
    code: `function useUserDetail(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}`,
    codeTitle: 'Data-domain Hook',
  },
  {
    title: '问题 4：自定义 Hook 设计时最重要的原则是什么？',
    answer: '职责单一、命名清晰、暴露最少必要 API，并且不要让调用方必须知道内部实现细节。',
    explanation: '这组原则比背“Hook 只能在顶层调用”更像设计问题。',
    code: `type UseModalResult = {
  open: boolean;
  show: () => void;
  hide: () => void;
};`,
    codeTitle: 'Explicit Hook Contract',
  },
] as const;

const practical = [
  {
    title: '问题 5：什么时候不应该抽 Hook？',
    answer: '当逻辑只出现一次、非常简单，或者抽出来只会增加跳转成本时，就没必要为了“好看”硬抽。',
    explanation: '这是很实用的中高级判断点。',
    code: `const [open, setOpen] = useState(false);
// 只有这一行和一个按钮时，未必值得单独抽 useModal`,
    codeTitle: 'Don’t Abstract Too Early',
  },
  {
    title: '问题 6：怎么避免 Hook 越抽越黑箱？',
    answer: '让 Hook 只负责一个清晰问题域，并且把返回值限制在必要的状态、动作和派生结果，不顺手塞太多 unrelated 逻辑。',
    explanation: '很多“自定义 Hook 难维护”本质上是职责失控。',
    code: `// 不推荐
usePageEverything();

// 更推荐
useOrderFilters();
useOrderSelection();
useExportDialog();`,
    codeTitle: 'Split by Domain',
  },
  {
    title: '问题 7：Hook 和组件拆分的关系怎么讲？',
    answer: 'Hook 更偏逻辑和状态抽离，组件拆分更偏 UI 和结构拆分。真实项目里常常两者配合使用，让页面同时变薄和变清晰。',
    explanation: '这是 React 设计题里很容易加分的一句。',
    code: `function OrdersPage() {
  const filters = useOrderFilters();
  const selection = useOrderSelection();

  return <OrdersPageView filters={filters} selection={selection} />;
}`,
    codeTitle: 'Hook + View Split',
  },
  {
    title: '问题 8：面试里怎么总结自定义 Hook？',
    answer: '先抽稳定行为单元，再设计清晰 API，控制职责边界，让组件只负责组合 UI，而不是背一堆细节。',
    explanation: '这句适合把设计思路整体收束起来。',
    code: `行为单元 -> Hook API -> 组件组合 -> 可维护性`,
    codeTitle: 'Custom Hook Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先识别有没有稳定行为单元', detail: '别为了抽象而抽象。' },
  { title: '第二步：明确 Hook 的职责边界', detail: '避免把不相关逻辑混在一起。' },
  { title: '第三步：设计返回 API', detail: '优先可读、可扩展、低耦合。' },
  { title: '第四步：让组件只组合 UI', detail: '把逻辑和展示分层。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把重复代码都抽成 Hook', detail: '没有稳定问题域的抽象往往寿命很短。', points: ['行为单元', '职责边界', '不要早抽'] },
  { title: '高频误区 2：Hook 一次暴露太多字段和动作', detail: '调用方会越来越难理解它到底在负责什么。', points: ['API 克制', '职责单一', '按域拆分'] },
  { title: '高频误区 3：Hook 抽成黑箱大杂烩', detail: '不相关请求、状态、副作用混在一起，后期会更难维护。', points: ['分域', '分层', '少暴露细节'] },
  { title: '高频误区 4：只拆 Hook 不拆 UI', detail: '组件仍可能很臃肿，逻辑和结构都要一起整理。', points: ['Hook 抽逻辑', '组件拆视图', '两者配合'] },
] as const;

const rules = [
  { title: '抽 Hook 先看行为单元', detail: '比看重复行数更重要。' },
  { title: 'API 设计和组件 props 一样重要', detail: 'Hook 返回值本身就是接口。' },
  { title: '职责过大就继续拆', detail: '别让 Hook 变成新黑箱。' },
  { title: 'Hook 抽逻辑，组件管结构', detail: '这是一组很实用的分工。' },
] as const;

export default function ReactCustomHookSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="React Interview / Custom Hook"
      title="自定义 Hook 设计"
      lead="自定义 Hook 在 React 面试里很容易被答成“提取复用逻辑”，但真正的区分度在于你是否理解它是在抽离稳定行为单元、状态模型和副作用边界，而不只是把代码挪个地方。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把 Hook 放回抽象设计问题）"
      definitionsNote="用意：先明确 Hook 在做什么、不该做什么。"
      definitions={definitions}
      relationsTitle="块 2：Hook 设计主线速览"
      relationsNote="用意：把状态、副作用、动作和派生值串起来。"
      relations={relations}
      relationCodeTitle="Custom Hook Design"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把什么时候抽、API 怎么设计讲稳。', label: 'Hook Basics', questions: basics },
        { title: '块 4：中高级设计问题', note: '用意：再把边界控制、Hook 与组件拆分关系补全。', label: 'Hook Design', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到自定义 Hook 设计题时，按问题域和 API 边界来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把 Hook 抽象做成新的维护负担。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆 Hook 抽象的核心判断。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={reactInterviewTheme}
    />
  );
}
