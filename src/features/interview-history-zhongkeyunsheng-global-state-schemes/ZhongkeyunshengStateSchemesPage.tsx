import {
  InterviewEditorialPage,
  type EditorialComparisonTable,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '对比对象', value: 'Context + useReducer、Redux Toolkit、Zustand' },
  { label: '核心差异', value: '规范强度、心智成本、订阅粒度、生态能力' },
  { label: '题目重点', value: '不是背优缺点，而是根据场景选择' },
  { label: '本题结论', value: '统计页面动态组件更新，我更偏向 Zustand' },
];

const comparisonTable: EditorialComparisonTable = {
  title: '三种全局状态方案对比',
  intro: '这里不追求绝对答案，而是对比它们在规范、复杂度和订阅能力上的差异。',
  headers: ['方案', '优点', '限制'],
  rows: [
    ['Context + useReducer', '原生、无额外依赖、适合简单共享状态', 'Provider 容易膨胀，细粒度订阅弱，复杂场景性能一般'],
    ['Redux Toolkit', '规范强、生态成熟、可追踪、适合复杂中大型状态', '模板和心智成本相对更高'],
    ['Zustand', '轻量、上手快、选择器订阅细、样板少', '团队规范和大型约束能力弱于 Redux Toolkit'],
  ],
};

const sections: EditorialSection[] = [
  {
    title: '1. 先明确“全局状态方案”比较的维度，不只是会不会用',
    paragraphs: [
      '面试里问全局状态方案，真正想看的是你的选型思路，而不是你会不会背几个库名。比较时至少要看几个维度：状态复杂度、订阅粒度、调试追踪能力、团队规范成本、异步处理方式、和项目规模是否匹配。',
      '如果不先立维度，后面说优缺点就会散。比如“Redux 太重”这句话本身没有意义，关键是重在什么地方、换来了什么收益。',
      '所以最稳的方式是先搭一个评价框架，再逐个方案往里放。',
    ],
  },
  {
    title: '2. Context + useReducer：最原生，但更适合简单共享状态和中小规模场景',
    paragraphs: [
      'React Context 配合 `useReducer` 的优点是原生、无额外依赖，适合主题、权限、用户信息、轻量配置、简单表单上下文这类共享状态。它的优势在于认知简单，和 React 本身非常贴合。',
      '但它的问题也很明显：一旦 Provider 里塞进太多复杂业务状态，更新影响范围会变大；如果没有额外拆分和 memo，细粒度订阅能力较弱。它更像“共享上下文方案”，而不是大型状态管理框架。',
      '因此回答它时，重点不是说它不好，而是说它更适合状态量有限、业务关系不太复杂的场景。',
    ],
  },
  {
    title: '3. Redux Toolkit：适合复杂、可追踪、需要团队规范的中大型状态系统',
    paragraphs: [
      'Redux Toolkit 的价值不只是“能管理状态”，而是它把状态变更路径、action 语义、中间件扩展、持久化、调试追踪都做得比较完整。对于跨团队协作、大型中后台、复杂业务流，这种规范和可观测性是很重要的。',
      '它的代价是样板和心智成本相对更高。虽然 RTK 已经比老 Redux 简化很多，但相比 Zustand 这类库，仍然需要更多概念和约束。',
      '所以它更适合“复杂度高且需要强治理”的场景，而不是所有页面级共享状态都上 Redux。',
    ],
  },
  {
    title: '4. Zustand：轻量、订阅细、非常适合页面级或中等复杂度共享状态',
    paragraphs: [
      'Zustand 最大的优势是简单和足够灵活。它没有太重的模板，store 写法很直接，而且支持选择器订阅，组件可以只订阅自己关心的切片，从而避免整页大范围重渲染。',
      '这使它特别适合统计页、工作台、配置面板、复杂页面级状态这类“组件很多、状态联动存在，但又没必要上完整 Redux 体系”的场景。',
      '当然，它也不是没有代价。相比 Redux Toolkit，Zustand 在团队规范、行为追踪、流程约束方面更弱一些，所以如果项目长期演进成极复杂系统，仍然要考虑治理能力。',
    ],
  },
  {
    title: '5. 如果是一个统计页面，需要动态更新多个统计组件，我更倾向 Zustand',
    paragraphs: [
      '题目里的这个具体场景非常关键。统计页面通常会有多个卡片、图表、筛选器、时间范围、排序条件和局部联动。这里的需求重点是：多个组件共享一部分状态，但每个组件又希望只在自己关心的数据变化时更新。',
      '在这种前提下，我更倾向 Zustand。原因是它的选择器订阅天然适合这种“多个面板共享状态，但希望局部更新”的页面，样板少，上手快，拆 store 也灵活。比如筛选条件、时间区间、统计摘要、图表配置都可以拆成相对清晰的状态分区。',
      '当然，如果这个统计页面已经属于一个非常大的企业级平台，需要统一 action 流程、强审计、复杂中间件、跨团队协作，那么 Redux Toolkit 也会是合理答案。但单独看题目给出的统计页面，我会先选 Zustand。',
    ],
    bullets: [
      '选择器订阅更利于多个统计组件局部刷新。',
      '样板少，页面级复杂状态组织成本低。',
      '如果平台级治理要求很强，再考虑 Redux Toolkit。',
    ],
  },
  {
    title: '6. 面试里怎样回答这类“方案选择题”更稳',
    paragraphs: [
      '最好的回答方式不是说“我最喜欢哪个库”，而是先给出比较维度，再说明三种方案各自适合什么复杂度，最后结合题目场景明确给出选择和理由。',
      '对于这个题目，推荐答法是：Context + useReducer 适合简单共享状态；Redux Toolkit 适合复杂且强治理场景；Zustand 适合中等复杂度、多组件联动、局部订阅要求高的统计页面，因此我会选 Zustand。',
      '一句话收尾可以这样说：状态管理没有绝对最优，关键是订阅粒度、复杂度和治理成本是否与场景匹配。',
    ],
  },
];

export default function ZhongkeyunshengStateSchemesPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 09"
      title="react 应用中 3 种全局状态方案如何选择"
      strapline="方案题的关键不是背库名，而是把复杂度、订阅粒度和治理成本讲清楚。"
      abstract="这道题看似在问库对比，实则是在考状态管理选型能力。答案要从比较维度切入，再结合题目给的统计页面场景明确做选择。"
      leadTitle="从比较框架出发，再落到统计页面的实际选择"
      lead="面试里回答状态管理方案，不要只说“Redux 太重、Zustand 很轻”。更完整的说法应该围绕状态复杂度、订阅能力、可观测性、团队规范和场景匹配度展开，最后再结合具体页面给出结论。"
      answerOutline={[
        '先建立比较维度，而不是直接站队',
        '再分别讲 Context + useReducer、Redux Toolkit、Zustand',
        '然后结合统计页面多组件动态更新场景做选择',
        '最后说明为什么状态管理没有绝对最优答案',
      ]}
      quickAnswer="一句话答法：如果比较 3 种常见全局状态方案，我会选 Context + useReducer、Redux Toolkit 和 Zustand。Context + useReducer 适合简单共享状态；Redux Toolkit 适合复杂、可追踪、强治理场景；Zustand 适合中等复杂度、多个组件联动且需要细粒度订阅的页面。对于一个需要动态更新多个统计组件的统计页面，我更倾向 Zustand，因为它轻量、选择器订阅细、样板少，能更自然地支持局部刷新。"
      pullQuote="状态方案没有绝对最优，只有是否和当前页面复杂度匹配。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先搭比较维度，再讲方案，最后给出场景化结论。',
        '回答统计页面选型时，一定要强调“多个组件共享状态但希望局部刷新”。',
        '给出主选方案后，最好补一句“如果治理要求更强，我会改选 Redux Toolkit”。',
      ]}
      mistakes={[
        '只会背库优缺点，不会结合场景做选择。',
        '把 Context 当作所有全局状态问题的通用方案。',
        '说 Zustand 轻量，却说不清它为什么更适合统计页面。',
      ]}
      comparisonTable={comparisonTable}
      singleColumn
    />
  );
}
