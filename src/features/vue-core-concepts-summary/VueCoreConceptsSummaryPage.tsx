import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { vueInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scope', value: 'Core Vue', detail: '这页覆盖 Vue 最常被问到的基础认知：响应式、模板、单文件组件、生命周期和 Composition API 心智。' },
  { label: 'Focus', value: 'Reactivity', detail: 'Vue 基础题最后大多会落到“响应式是怎么工作的，模板如何跟数据联动”。' },
  { label: 'Scenes', value: 'SFC / Components', detail: '单文件组件、父子通信、页面生命周期和状态组织是最常见的实际落点。' },
] as const;

const definitions = [
  { title: 'Vue 是一个渐进式前端框架', detail: '渐进式的意思是你可以只用它的视图层能力，也可以搭配路由、状态管理和构建工具形成完整应用。' },
  { title: 'Vue 的核心之一是响应式系统', detail: '数据变化后，Vue 能追踪依赖并更新相关视图，而不是让你手动去操作 DOM。' },
  { title: '单文件组件把 template、script、style 放在一个文件里', detail: '这样组件结构更集中，也更适合组件级维护和构建编译。' },
  { title: 'Vue 既有 Options API，也有 Composition API', detail: '前者按 data、methods、computed 这类选项组织，后者按逻辑关注点组织，更适合复杂逻辑抽离。' },
  { title: '生命周期是理解组件创建、挂载、更新和卸载的关键', detail: '数据请求、订阅、清理、副作用时机都和生命周期有关。' },
  { title: '中高级 Vue 面试更看你是否理解“模板声明式 + 响应式驱动 + 逻辑组织方式”', detail: '不是只会背几个钩子函数名字。' },
] as const;

const relations = [
  { title: 'Reactive State', detail: '数据变化会触发相关依赖更新。', signal: 'State Drives View' },
  { title: 'Template', detail: '模板描述 UI 应该长什么样。', signal: 'Declarative UI' },
  { title: 'Component', detail: '组件把状态、模板和行为封装成可复用单元。', signal: 'Encapsulation' },
  { title: 'Lifecycle', detail: '控制逻辑在组件不同时刻执行。', signal: 'Timing' },
] as const;

const relationCode = `响应式数据变化
-> Vue 跟踪依赖
-> 相关组件重新更新
-> 模板反映最新状态`;

const basics = [
  {
    title: '问题 1：Vue 的核心思想怎么简洁回答？',
    answer: '可以答成：Vue 通过声明式模板和响应式系统，把数据变化自动映射到视图更新上。',
    explanation: '这句短，但基本把 Vue 的主线说到了。',
    code: `<template>
  <p>{{ count }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>`,
    codeTitle: 'Reactive Template Binding',
  },
  {
    title: '问题 2：为什么说 Vue 是渐进式框架？',
    answer: '因为你可以只从模板和组件能力开始，也可以逐步接入路由、状态管理、构建工具和工程体系，而不是必须一次性接受整套大框架约束。',
    explanation: '这题重点是“可逐步采用”，不是“功能少”。',
    code: `createApp(App).mount('#app')

// 需要时再配 router / pinia / build tools`,
    codeTitle: 'Progressive Adoption',
  },
  {
    title: '问题 3：Options API 和 Composition API 怎么比较？',
    answer: 'Options API 更适合上手和中小组件，Composition API 更适合按逻辑关注点组织复杂组件和复用逻辑。',
    explanation: '中高级回答关键是讲“组织方式”和复杂度演进，而不是简单说哪个更新。',
    code: `// Composition API
const keyword = ref('')
const visibleRows = computed(() => filterRows(rows.value, keyword.value))

function reset() {
  keyword.value = ''
}`,
    codeTitle: 'Logic Organized by Concern',
  },
  {
    title: '问题 4：Vue 生命周期怎么答更稳？',
    answer: '按创建、挂载、更新、卸载这条主线讲，再把请求、订阅和清理分别挂到对应时机上。',
    explanation: '这会比只背 beforeMount、mounted 之类的名字更有层次。',
    code: `onMounted(() => {
  fetchDetail()
})

onUnmounted(() => {
  stopSubscription()
})`,
    codeTitle: 'Lifecycle Usage',
  },
] as const;

const practical = [
  {
    title: '问题 5：Vue 响应式为什么能驱动视图更新？',
    answer: '因为 Vue 会在读取数据时收集依赖，在数据变更时触发对应副作用重新执行，从而让模板依赖的部分更新。',
    explanation: '不必把底层实现讲得过深，但至少要讲出“依赖收集”和“触发更新”这两步。',
    code: `const state = reactive({ count: 0 })

watchEffect(() => {
  console.log(state.count)
})`,
    codeTitle: 'Dependency Tracking Idea',
  },
  {
    title: '问题 6：单文件组件为什么会成为 Vue 常见形态？',
    answer: '因为它让一个组件的模板、逻辑和样式在一个边界内协同维护，构建工具再负责编译拆分。',
    explanation: '这个回答比“因为官方推荐”更像理解了组件化工程价值。',
    code: `<template>...</template>
<script setup lang="ts">...</script>
<style scoped>...</style>`,
    codeTitle: 'Single File Component',
  },
  {
    title: '问题 7：Composition API 为什么更受中大型项目欢迎？',
    answer: '因为它能把同一类逻辑放在一起组织，也更方便抽成 composable 复用，不会像大型 Options API 组件那样逻辑散在 data、methods、watch 各块里。',
    explanation: '这题重点是维护性和逻辑聚合。',
    code: `export function usePagination() {
  const page = ref(1)
  const pageSize = ref(20)
  const next = () => page.value += 1
  return { page, pageSize, next }
}`,
    codeTitle: 'Composable Reuse',
  },
  {
    title: '问题 8：面试里怎么总结 Vue 基础概念？',
    answer: '先讲声明式模板和响应式系统，再讲组件与生命周期，最后补 Options API 和 Composition API 的组织差异。',
    explanation: '这条主线既稳又适合继续展开追问。',
    code: `模板声明 UI -> 响应式驱动更新 -> 生命周期控制时机 -> API 组织逻辑`,
    codeTitle: 'Vue Concepts Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先讲 Vue 的核心机制', detail: '声明式模板 + 响应式系统。' },
  { title: '第二步：再讲组件和生命周期', detail: '把时机和副作用放进去。' },
  { title: '第三步：补 API 组织方式', detail: 'Options API vs Composition API。' },
  { title: '第四步：落到复杂项目维护性', detail: '体现中高级视角。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：只背 API 名字，不讲机制', detail: 'Vue 面试不止问“怎么写”，更看你是否理解响应式和模板联动。', points: ['响应式', '依赖收集', '声明式'] },
  { title: '高频误区 2：Composition API 只答成“更高级”', detail: '更关键的是逻辑组织方式和复杂组件可维护性。', points: ['按关注点组织', '便于复用', '中大型组件更清晰'] },
  { title: '高频误区 3：生命周期只会背顺序', detail: '更重要的是能说出什么逻辑该放在哪个时机。', points: ['请求', '订阅', '清理'] },
  { title: '高频误区 4：把 Vue 讲成“自动操作 DOM 的魔法”', detail: '真正核心是响应式追踪和声明式更新。', points: ['模板', '响应式', '依赖触发'] },
] as const;

const rules = [
  { title: 'Vue 先讲声明式和响应式', detail: '这是基础题主线。' },
  { title: '生命周期要配场景讲', detail: '不要只背钩子名字。' },
  { title: 'Composition API 重点在逻辑组织', detail: '不是单纯因为它更新。' },
  { title: '基础题也要落回组件维护性', detail: '这能体现更成熟的理解。' },
] as const;

export default function VueCoreConceptsSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Vue Interview / Concepts"
      title="Vue 基础概念"
      lead="Vue 基础题看起来分散，但真正主线很统一：声明式模板、响应式系统、组件化和生命周期。这页会把这些基础能力放回同一张图里讲清楚，并补上 Composition API 在复杂项目中的意义。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把 Vue 的主线建立起来）"
      definitionsNote="用意：先理解 Vue 为什么能把数据变化映射成视图更新。"
      definitions={definitions}
      relationsTitle="块 2：核心机制速览"
      relationsNote="用意：把响应式、模板、组件和生命周期串成主线。"
      relations={relations}
      relationCodeTitle="Vue Core Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 Vue 的基础概念讲稳。', label: 'Core Basics', questions: basics },
        { title: '块 4：中高级补充问题', note: '用意：再把响应式和 Composition API 的维护价值补全。', label: 'Core Depth', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 Vue 基础题时，按机制、时机、组织方式来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把 Vue 基础题答成 API 名单。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆 Vue 核心主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={vueInterviewTheme}
    />
  );
}
