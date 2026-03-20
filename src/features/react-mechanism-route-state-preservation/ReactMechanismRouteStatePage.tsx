import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心问题', value: '路由切换常导致组件卸载，从而丢失局部 state' },
  { label: '常见手段', value: '状态上移、缓存容器、URL 持久化、存储恢复' },
  { label: '选择依据', value: '保留什么、保留多久、是否可分享、是否要刷新恢复' },
  { label: '高频场景', value: '列表筛选、表单草稿、标签页工作台' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 先讲根因：路由切换时，页面组件往往会卸载，局部 state 自然丢失',
    paragraphs: [
      '很多人会把“路由切换状态丢失”当成 React Router 的问题，但从机制上看，根因通常是组件卸载。组件一旦卸载，保存在该组件内部的 `useState`、`useReducer`、ref 等局部状态也会随之消失。',
      '所以要做状态保留，第一步不是“想办法不让它丢”，而是先判断：哪些状态需要跨路由保留、哪些只需要当前页面生命周期内存在。',
      '只有先定义保留目标，后面才能选对方案。',
    ],
  },
  {
    title: '2. 最常见的第一种方案，是把状态上移到不会卸载的上层容器',
    paragraphs: [
      '如果某个页面切换后还需要回来继续使用相同状态，最自然的方式是把这部分状态提升到更高层，比如布局层、父路由层、全局 store，或者某个缓存容器里。只要这个容器不卸载，状态就还在。',
      '这种方式适合短链路保留，例如详情页返回列表时保留筛选条件、分页和排序。',
      '它的优点是实现简单、状态仍在 React 流里；缺点是状态上移过多容易让上层容器变重。',
    ],
  },
  {
    title: '3. 第二种方案，是把状态映射到 URL，让它天然可分享、可回放',
    paragraphs: [
      '如果状态本身适合表达成查询条件，比如筛选项、分页、排序、关键词、Tab 选中项，那么把它映射到 URL query 通常是非常好的方案。',
      '这样不仅路由切换回来可以恢复，刷新页面也能恢复，而且用户还能复制链接分享当前视图状态。',
      '所以对于列表页和搜索页，URL 往往是最稳的保留方式之一。',
    ],
  },
  {
    title: '4. 第三种方案，是用缓存容器或 keep-alive 思路保留页面实例',
    paragraphs: [
      '如果你希望页面切走时连组件实例都尽量保留，而不是只保留状态数据，就可以考虑 keep-alive 类方案或页面缓存容器。这类方案更像“先不卸载页面，只是隐藏起来”。',
      '它适合工作台、标签页、多页面并行处理这类场景，因为用户回来时不仅状态在，滚动位置、局部 UI 状态也往往还在。',
      '但它的代价是内存占用和生命周期复杂度更高，不能无脑对所有页面都启用。',
    ],
  },
  {
    title: '5. 第四种方案，是把状态持久化到 storage，用于刷新恢复或跨会话恢复',
    paragraphs: [
      '如果需求不仅是路由来回切换，还包括刷新页面后恢复草稿、恢复工作现场，那么 localStorage、sessionStorage、IndexedDB 这类持久化方案就会进入考虑范围。',
      '这类方案适合表单草稿、工作配置、临时编辑内容，但要注意数据过期策略、隐私和同步时机。',
      '所以持久化方案更适合“恢复现场”，而不是所有临时 UI 状态都往里塞。',
    ],
  },
  {
    title: '6. 面试里怎样给出“选型式”回答',
    paragraphs: [
      '这类题没有唯一答案，所以最好的方式是先按状态类型分类。可分享、可回放的筛选条件用 URL；跨页面短期共享的状态上移或放 store；需要保留整页现场的用 keep-alive / cache；需要刷新恢复的用 storage。',
      '这样回答会明显强于只背一个方案名，因为你体现的是“按状态特征选方案”的能力。',
      '一句话收尾可以这样说：路由状态保留的关键，不是记住某个技术，而是先明确保留目标，再选择最合适的状态载体。',
    ],
  },
];

export default function ReactMechanismRouteStatePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="React Mechanism"
      company="React 机制类"
      issue="Issue 07"
      title="React 路由切换时，如何做页面状态保留与恢复"
      strapline="先问清楚要保留的是数据、视图条件，还是整页现场，再选状态载体。"
      abstract="这道题本质上是一道状态建模题。高分回答不是只说 keep-alive 或 localStorage，而是把不同类型的状态映射到不同载体。"
      leadTitle="从“组件为什么会丢状态”讲到 URL、上移、缓存与持久化"
      lead="路由切换状态丢失的根因通常是组件卸载，因此解决思路也应该围绕“把状态放到不会一起消失的地方”展开。不同状态有不同最优载体：URL、上层 store、缓存页面实例或本地持久化。"
      answerOutline={[
        '先讲路由切换状态丢失的根因是组件卸载',
        '再讲状态上移与全局 store',
        '然后讲 URL、keep-alive、storage 等不同载体',
        '最后按状态类型给选型结论',
      ]}
      quickAnswer="一句话答法：React 路由切换时状态保留的关键，是先分清要保留的是哪类状态。局部组件 state 会随卸载丢失，所以可短期共享的状态可以上移到父层或 store；筛选、分页这类可分享视图状态适合放到 URL；需要保留整页现场可以用页面缓存或 keep-alive；需要刷新后恢复的内容则可以持久化到 storage。"
      pullQuote="状态保留题真正考的，不是某个 API，而是“状态应该住在哪里”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '不要先报方案名，先按状态类型分类。',
        '列表筛选条件优先想到 URL，这是很加分的点。',
        '如果说 keep-alive，记得补内存与生命周期代价。',
      ]}
      mistakes={[
        '把所有保留问题都回答成 localStorage。',
        '不区分数据保留、视图条件保留和整页实例保留。',
        '忽略组件卸载才是状态丢失的根因。',
      ]}
      singleColumn
    />
  );
}
