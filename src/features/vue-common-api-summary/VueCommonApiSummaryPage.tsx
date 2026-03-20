import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { vueInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'APIs', value: '8+', detail: 'ref、reactive、computed、watch、watchEffect、props/emits、provide/inject、nextTick、生命周期钩子。' },
  { label: 'Focus', value: 'When To Use', detail: '常用 API 题最重要的不是记住函数名，而是知道什么时候该用哪一个。' },
  { label: 'Scenes', value: 'Form / Shared State', detail: '表单、列表、父子通信、跨层共享、DOM 更新后操作都是高频场景。' },
] as const;

const definitions = [
  { title: 'ref 适合包裹基本类型或单个独立值', detail: '它返回一个带 `.value` 的响应式引用，在模板中可直接使用，在 script 中通过 `.value` 访问。' },
  { title: 'reactive 更适合对象结构', detail: '它让整个对象变成响应式，适合表单对象、配置对象和状态对象。' },
  { title: 'computed 适合声明式派生值', detail: '当某个值可以由现有响应式数据推导得出时，优先考虑 computed。' },
  { title: 'watch 更适合监听变化并执行副作用', detail: '比如请求、日志、持久化、手动同步第三方状态。' },
  { title: 'watchEffect 更适合自动收集依赖的副作用', detail: '它会在执行过程中自动追踪用到的响应式值。' },
  { title: 'props/emits、provide/inject 和 nextTick 都是常见高频 API', detail: '一个解决父子通信，一个解决跨层传值，一个处理 DOM 更新时机。' },
] as const;

const relations = [
  { title: 'ref / reactive', detail: '负责声明响应式源数据。', signal: 'Source State' },
  { title: 'computed', detail: '负责派生值，不直接做副作用。', signal: 'Derived State' },
  { title: 'watch / watchEffect', detail: '负责监听变化并做副作用。', signal: 'Side Effect' },
  { title: 'props / emits / provide / inject', detail: '负责组件通信和共享。', signal: 'Communication' },
] as const;

const relationCode = `源状态 -> ref / reactive
派生值 -> computed
副作用监听 -> watch / watchEffect
通信 -> props / emits / provide / inject`;

const basics = [
  {
    title: '问题 1：ref 和 reactive 怎么选？',
    answer: '单值和独立标量更常用 ref，对象结构和成组状态更常用 reactive。',
    explanation: '回答时最好强调“状态结构”，而不是只说“一个带 value，一个不带”。',
    code: `const keyword = ref('')
const form = reactive({
  name: '',
  email: '',
})`,
    codeTitle: 'ref vs reactive',
  },
  {
    title: '问题 2：computed 和 method 的区别怎么讲？',
    answer: 'computed 更适合基于响应式状态做缓存型派生值，只有依赖变化时才重新计算；method 每次调用都会重新执行。',
    explanation: '这题高频点在“缓存”和“声明式派生”两层。',
    code: `const fullName = computed(() => {
  return \`\${user.value.firstName} \${user.value.lastName}\`
})`,
    codeTitle: 'Computed Derived Value',
  },
  {
    title: '问题 3：watch 和 watchEffect 有什么区别？',
    answer: 'watch 更明确地指定监听源，watchEffect 会自动收集 effect 中用到的依赖，适合快速响应式副作用。',
    explanation: '这题的关键是“显式监听”对比“自动依赖收集”。',
    code: `watch(() => route.params.id, (id) => {
  fetchDetail(id)
})

watchEffect(() => {
  console.log(user.value.name)
})`,
    codeTitle: 'watch vs watchEffect',
  },
  {
    title: '问题 4：nextTick 是干什么的？',
    answer: '它用来等待本轮 DOM 更新完成后再执行逻辑，常见于你需要拿最新 DOM 尺寸、滚动位置或操作聚焦时。',
    explanation: '这题重点是“等 DOM 更新完成”，不是“异步一下”。',
    code: `count.value += 1
await nextTick()
console.log(panelRef.value?.offsetHeight)`,
    codeTitle: 'Wait For DOM Flush',
  },
] as const;

const practical = [
  {
    title: '问题 5：props 和 emits 怎么回答更完整？',
    answer: 'props 负责父传子，emits 负责子通知父，是 Vue 组件单向数据流的基础；不要让子组件直接改父组件状态源。',
    explanation: '这个回答把通信方向和边界都交代清楚了。',
    code: `const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(value: string) {
  emit('update:modelValue', value)
}`,
    codeTitle: 'Props and Emits',
  },
  {
    title: '问题 6：provide / inject 适合什么场景？',
    answer: '适合跨层级共享某个 feature 或页面内的上下文能力，比如表单注册、主题、权限、表格配置，但不适合把所有全局状态都塞进去。',
    explanation: '这题和 React Context 很像，重点依然是共享范围和更新边界。',
    code: `provide('tableConfig', {
  stripe: true,
  size: 'small',
})

const config = inject<{ stripe: boolean; size: string }>('tableConfig')`,
    codeTitle: 'Provide and Inject',
  },
  {
    title: '问题 7：watch 什么时候容易被滥用？',
    answer: '当本来是纯派生值的问题，却硬用 watch 把一个值同步到另一个值上时，就容易让代码更绕，也更难维护。',
    explanation: '这题很能体现你是否理解 computed 和 watch 的职责边界。',
    code: `// 不推荐
watch(() => firstName.value, () => {
  fullName.value = \`\${firstName.value} \${lastName.value}\`
})

// 更推荐 computed`,
    codeTitle: 'Don’t Use Watch for Derived State',
  },
  {
    title: '问题 8：面试里怎么总结 Vue 常用 API？',
    answer: '按“源状态、派生值、副作用、通信、DOM 时机”五类来讲，API 会清楚很多。',
    explanation: '这比逐个背函数定义更适合中高级表达。',
    code: `ref/reactive -> 源状态
computed -> 派生值
watch/watchEffect -> 副作用
props/emits/provide/inject -> 通信
nextTick -> DOM 时机`,
    codeTitle: 'Vue API Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问这是源状态还是派生值', detail: '决定用 ref/reactive 还是 computed。' },
  { title: '第二步：再问是否需要副作用', detail: '需要再考虑 watch 或 watchEffect。' },
  { title: '第三步：通信问题按作用域选 API', detail: '父子 props/emits，跨层 provide/inject。' },
  { title: '第四步：DOM 时机问题再上 nextTick', detail: '别把它当默认异步工具。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：computed 和 watch 不分', detail: '前者是派生值，后者是副作用监听。', points: ['派生值用 computed', '副作用用 watch', '别互相替代'] },
  { title: '高频误区 2：reactive 和 ref 只背语法差异', detail: '更该看状态结构和使用场景。', points: ['单值', '对象', '状态建模'] },
  { title: '高频误区 3：provide/inject 当全局状态管理', detail: '它适合跨层共享上下文，但不是所有状态的归宿。', points: ['范围克制', '上下文共享', '谨慎全局化'] },
  { title: '高频误区 4：nextTick 被当成万能补丁', detail: '它只解决 DOM 更新时机，不该被用来掩盖结构问题。', points: ['DOM flush', '测量', '聚焦/滚动'] },
] as const;

const rules = [
  { title: '先分源状态、派生值和副作用', detail: 'Vue API 题最稳的主线。' },
  { title: 'computed 优先于“同步值到值”的 watch', detail: '这会让代码更声明式。' },
  { title: '通信 API 按共享范围来选', detail: '父子和跨层不要混。' },
  { title: 'nextTick 只解决 DOM 更新时机', detail: '不要滥用。' },
] as const;

export default function VueCommonApiSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Vue Interview / APIs"
      title="Vue 常用 API"
      lead="Vue 常用 API 题如果只按函数名一个个背，很容易显得零散。更好的答法是先按源状态、派生值、副作用、通信和 DOM 时机这几类去分，再讲每个 API 为什么适合这个位置。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把常用 API 分类型）"
      definitionsNote="用意：先明确每类 API 的职责边界。"
      definitions={definitions}
      relationsTitle="块 2：API 分类速览"
      relationsNote="用意：把状态、派生值、副作用和通信串起来。"
      relations={relations}
      relationCodeTitle="Vue API Categories"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 ref/reactive、computed/watch、nextTick 基本盘答稳。', label: 'API Basics', questions: basics },
        { title: '块 4：中高级补充问题', note: '用意：再把通信边界和 API 滥用问题讲清。', label: 'API Tradeoff', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 Vue API 题时，先按职责而不是按名字来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把 Vue API 答成平铺名词。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆常用 API 的边界。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={vueInterviewTheme}
    />
  );
}
