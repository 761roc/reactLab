import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { vueInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Topics', value: '8', detail: 'computed vs watch、v-if vs v-show、key、组件通信、nextTick、keep-alive、性能和 diff 高频题。' },
  { label: 'Focus', value: 'Tradeoff', detail: 'Vue 面试高频题最看取舍，不是定义谁背得更熟。' },
  { label: 'Level', value: 'Mid-Senior', detail: '这页会补一些更贴实际项目的答法，而不只是基础概念。' },
] as const;

const definitions = [
  { title: '高频考点通常都围绕边界和取舍', detail: '什么时候该 computed、什么时候该 watch、什么时候该用 keep-alive、什么时候该拆组件，都是边界题。' },
  { title: 'Vue 面试很常考模板指令的差异', detail: 'v-if、v-show、key、v-model 这些都是高频基础题，也是很多性能和状态题的入口。' },
  { title: '组件通信是 Vue 面试常驻主题', detail: 'props/emits、provide/inject、事件总线、状态管理、路由参数都可能被拿来追问。' },
  { title: '性能题也会出现在 Vue 面试里', detail: '长列表、按需加载、keep-alive、异步组件、computed 缓存、watch 滥用都经常会被问。' },
  { title: '中高级回答要尽量给场景和取舍', detail: '只讲定义通常不够，最好补什么时候选 A、什么时候选 B。' },
  { title: '很多 Vue 高频题都能回到“身份、时机、依赖、更新成本”四个关键词', detail: '这是一条很稳的答题框架。' },
] as const;

const relations = [
  { title: 'Identity', detail: 'key 决定节点身份和复用。', signal: 'Key' },
  { title: 'Timing', detail: 'nextTick、生命周期和 watch 执行时机决定什么时候做事。', signal: 'When' },
  { title: 'Dependency', detail: 'computed 和 watch 都和依赖关系相关。', signal: 'What Depends On What' },
  { title: 'Cost', detail: 'v-if、v-show、keep-alive、长列表都和更新成本有关。', signal: 'Performance' },
] as const;

const relationCode = `身份 -> key
时机 -> 生命周期 / nextTick / watch
依赖 -> computed / watch
成本 -> v-if / v-show / keep-alive / 列表优化`;

const basics = [
  {
    title: '问题 1：computed 和 watch 怎么区分最稳？',
    answer: 'computed 适合声明式派生值，watch 适合监听变化后做副作用，比如请求、日志、同步外部系统。',
    explanation: '这是 Vue 面试最高频的对比题之一，核心是“派生值 vs 副作用”。',
    code: `const fullName = computed(() => \`\${firstName.value} \${lastName.value}\`)

watch(() => route.params.id, (id) => {
  fetchDetail(id)
})`,
    codeTitle: 'Computed vs Watch',
  },
  {
    title: '问题 2：v-if 和 v-show 的区别怎么答？',
    answer: 'v-if 是真正条件渲染，会决定节点是否创建和销毁；v-show 主要是切换 display，节点一直都在。',
    explanation: '高频切换更适合 v-show，初始不一定显示、条件变化少的场景更适合 v-if，这句最好顺手补上。',
    code: `<Panel v-if="visible" />
<Panel v-show="visible" />`,
    codeTitle: 'v-if vs v-show',
  },
  {
    title: '问题 3：Vue 里的 key 为什么重要？',
    answer: '它帮助 Vue 在 diff 时识别节点身份，决定复用、移动还是销毁重建；列表和状态复用都非常依赖 key。',
    explanation: '这题和 React 很像，重点也是身份识别，不只是消除 warning。',
    code: `<TodoItem
  v-for="todo in todos"
  :key="todo.id"
  :todo="todo"
/>`,
    codeTitle: 'Stable Identity with Key',
  },
  {
    title: '问题 4：Vue 组件通信常见方式有哪些？',
    answer: '父子常见 props/emits，跨层用 provide/inject，同级或跨区域共享再考虑 Pinia、路由参数或事件总线等方案。',
    explanation: '这题真正想听的是你会按作用域选通信方式。',
    code: `// parent
<SearchBox :keyword="keyword" @update:keyword="keyword = $event" />`,
    codeTitle: 'Parent-child Communication',
  },
] as const;

const practical = [
  {
    title: '问题 5：nextTick 在面试里怎么讲更像实战？',
    answer: '强调它解决的是“等本轮 DOM 更新完成后再做命令式操作”，比如拿最新高度、滚动到底部、聚焦输入框。',
    explanation: '不要把 nextTick 说成“延迟执行函数”，那样太泛。',
    code: `messages.value.push(newMessage)
await nextTick()
listRef.value?.scrollTo({ top: listRef.value.scrollHeight })`,
    codeTitle: 'Wait and Then Touch DOM',
  },
  {
    title: '问题 6：keep-alive 适合什么场景？',
    answer: '适合在路由切换或组件切换中保留组件实例状态，比如表单草稿、列表筛选、Tab 内容缓存，但不该无脑包所有页面。',
    explanation: '这题重点是“缓存实例状态”和“有成本”。',
    code: `<keep-alive>
  <component :is="activeTab" />
</keep-alive>`,
    codeTitle: 'Cache Component Instance',
  },
  {
    title: '问题 7：Vue 性能优化常见会怎么答？',
    answer: '按减少不必要更新、控制列表节点数、computed 缓存、异步组件、路由级拆包和状态作用域收敛这几层来答会比较完整。',
    explanation: '中高级 Vue 面试不会只问一个 v-show。', 
    code: `const AsyncChart = defineAsyncComponent(() => import('./ChartPanel.vue'))`,
    codeTitle: 'Async Component Split',
  },
  {
    title: '问题 8：面试里怎么总结 Vue 高频考点？',
    answer: '可以从“派生值与副作用、节点身份、条件渲染成本、通信范围、DOM 时机和缓存策略”六层来收尾。',
    explanation: '这条主线很适合把分散问题串起来。',
    code: `派生值 -> computed
副作用 -> watch
身份 -> key
条件渲染 -> v-if/v-show
DOM 时机 -> nextTick
缓存 -> keep-alive`,
    codeTitle: 'Vue Interview Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问这个题是身份题、时机题还是依赖题', detail: '很多 Vue 高频题都能先这么分。' },
  { title: '第二步：再补更新成本和复用边界', detail: '让回答更接近真实项目。' },
  { title: '第三步：给一个具体场景', detail: '避免停留在纯定义。' },
  { title: '第四步：最后补取舍', detail: '什么时候用、什么时候别滥用。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：computed 和 watch 只背表面区别', detail: '真正重点是派生值和副作用边界。', points: ['声明式派生', '副作用监听', '别互相乱替代'] },
  { title: '高频误区 2：v-if / v-show 只背“一个隐藏一个删除”', detail: '更完整的回答要补频率和成本。', points: ['切换频率', '创建销毁成本', '显示隐藏成本'] },
  { title: '高频误区 3：keep-alive 当万能缓存', detail: '缓存实例有收益也有内存和状态复杂度成本。', points: ['状态保留', '资源占用', '按需使用'] },
  { title: '高频误区 4：通信方案不看作用域', detail: '父子、跨层和跨模块应该选不同方案。', points: ['props/emits', 'provide/inject', 'store'] },
] as const;

const rules = [
  { title: 'Vue 高频题先按边界分类', detail: '身份、时机、依赖、成本这四类很稳。' },
  { title: '定义之后一定补场景', detail: '不然很容易显得只会背书。' },
  { title: 'computed 和 watch 是最值得答深的一组', detail: '它们经常是追问入口。' },
  { title: '条件渲染和缓存都要谈成本', detail: '这能体现中高级视角。' },
] as const;

export default function VueInterviewTopicsSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Vue Interview / Topics"
      title="Vue 常见面试考点解读"
      lead="Vue 面试高频题表面上看很碎，但背后其实都在问边界和取舍。computed 还是 watch、v-if 还是 v-show、什么时候要 key、什么时候该 keep-alive，这些问题都更适合按场景和成本去回答。"
      heroCards={heroCards}
      definitionsTitle="块 1：考点定义（先把高频题放进统一框架）"
      definitionsNote="用意：先知道这些题背后都在考什么。"
      definitions={definitions}
      relationsTitle="块 2：考点框架速览"
      relationsNote="用意：把身份、时机、依赖和成本串成答题框架。"
      relations={relations}
      relationCodeTitle="Vue Interview Framework"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把最常见的对比题和通信题答稳。', label: 'Interview Basics', questions: basics },
        { title: '块 4：中高级补充问题', note: '用意：再把 nextTick、keep-alive 和性能取舍补全。', label: 'Interview Depth', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 Vue 高频面试题时，先分类，再给场景和取舍。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把 Vue 高频题答成死定义。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆 Vue 高频题的主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={vueInterviewTheme}
    />
  );
}
