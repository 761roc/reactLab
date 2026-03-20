import {
  InterviewEditorialPage,
  type EditorialComparisonTable,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: 'Vite 核心', value: '开发期走原生 ESM，生产期再交给 Rollup 打包' },
  { label: 'Webpack 核心', value: '从一开始就构建模块图并统一打包处理' },
  { label: '核心差异', value: '开发体验与生态灵活性之间的取舍' },
  { label: '答题重点', value: '先讲机制差异，再讲场景选择' },
];

const comparisonTable: EditorialComparisonTable = {
  title: 'Vite / Webpack 对比',
  intro: '回答这类选型题时，不要只说“Vite 快、Webpack 老”，而要落到机制和场景。',
  headers: ['维度', 'Vite', 'Webpack'],
  rows: [
    ['开发模式', '原生 ESM 按需加载', '本地开发也先走 bundling'],
    ['冷启动', '通常更快', '大型项目启动成本更高'],
    ['热更新', '模块粒度更轻', '成熟但成本更依赖配置'],
    ['生态与兼容', '现代化、默认简单', '插件生态更老牌更全面'],
    ['复杂定制', '能做，但有时要绕 Rollup / 插件体系', '传统复杂工程能力更成熟'],
    ['适用印象', '现代 Web 应用默认优先', '历史包袱重或定制极复杂项目常见'],
  ],
};

const sections: EditorialSection[] = [
  {
    title: '1. 先讲底层机制差异：它们处理“开发期模块加载”的方式不同',
    paragraphs: [
      'Vite 和 Webpack 最本质的区别，不是一个新一个旧，而是它们对“开发期怎么跑应用”的理解不一样。Webpack 更像传统 bundler：无论开发还是生产，都会先把模块收集进模块图，再做打包和转换。Vite 则把“开发期”和“生产期”明确拆开，开发期尽量利用浏览器原生 ESM，让模块按需请求，生产期再交给 Rollup 做正式打包。',
      '这意味着 Vite 的快，很大程度上来自“开发时不急着把所有内容都 bundling 完”。而 Webpack 的优势，则在于它从很早开始就围绕统一构建流程、复杂 loader 和插件体系建立了完整能力。',
      '所以回答时一定先把这条主线讲清，否则后面说快慢就会显得只是结论，没有原因。',
    ],
  },
  {
    title: '2. Vite 为什么通常开发体验更快',
    paragraphs: [
      '因为 Vite 在开发期主要依赖浏览器去加载 ESM 模块，只有当前页面真正需要的模块才会被请求与转换，不需要一上来对整棵应用模块树做完整 bundling。',
      '这带来的直接收益就是冷启动快、热更新链路短、配置默认更轻。尤其在中小到中大型现代前端项目里，开发体验通常会比传统 bundler 更顺畅。',
      '所以如果题目问“Vite 为什么快”，答案不能只停在“它快”，而要落到“开发期按需模块加载而非先全量打包”。',
    ],
  },
  {
    title: '3. Webpack 为什么到今天仍然很常见',
    paragraphs: [
      '因为 Webpack 的优势从来不只是“能打包”，而是它在复杂工程定制上的成熟度。很多历史项目、重度自定义 loader/plugin 流程、复杂资源管线、特殊构建需求，Webpack 的能力和生态积累仍然非常强。',
      '换句话说，Webpack 在“传统大工程、长期积累、深度自定义构建链”这类场景里，仍然很能打。你不能因为 Vite 体验更现代，就简单把 Webpack 说成落后方案。',
      '面试里如果能把 Webpack 的价值说在“工程可塑性和成熟生态”上，而不是只说它慢，会更平衡。',
    ],
  },
  {
    title: '4. 它们的差异不能只看开发快慢，还要看团队存量和构建复杂度',
    paragraphs: [
      '技术选型不是只比理论能力，还要看迁移成本和团队存量。如果一个项目已经在 Webpack 上沉淀了大量定制插件、构建链路、CI 流程和排障经验，贸然迁到 Vite 并不一定划算。',
      '反过来，如果是新项目，技术栈现代、目标环境清晰、构建诉求不算特别离谱，那 Vite 通常会是更合适的默认选择。',
      '所以高分回答一定会带“项目存量和迁移成本”这一层，而不是只从框架特性出发。',
    ],
  },
  {
    title: '5. 如果让我做场景化选择，我会这样回答',
    paragraphs: [
      '如果是新项目、现代浏览器环境、常规中后台或内容站点，我通常默认优先 Vite，因为开发体验、默认配置和上手效率都更好。如果是老项目，Webpack 配置已经很深、生态依赖复杂、构建链路重度定制，那我会更谨慎，通常继续沿用 Webpack 或渐进迁移。',
      '也就是说，这道题最稳的结论不是“谁绝对更好”，而是“谁更适合当前团队和项目阶段”。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答稳',
    paragraphs: [
      '先讲开发期机制差异；再解释为什么 Vite 常常更快；然后讲 Webpack 在复杂工程中的长期价值；最后给出新项目与老项目的场景化选择。',
      '一句话收尾可以这样说：Vite 更像现代 Web 应用的默认开发体验方案，Webpack 更像复杂存量工程和深度定制构建链的成熟方案。',
    ],
  },
];

export default function EngineeringInterviewViteWebpackPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="Engineering Interview"
      company="面试-工程化 / 性能 / 发布类"
      issue="Issue 01"
      title="Vite 和 Webpack 的核心差异是什么，分别适合什么场景"
      strapline="不要只说“Vite 快、Webpack 老”，要把开发期机制和工程场景讲出来。"
      abstract="这道题本质是构建体系选型题。高分回答需要先讲机制差异，再讲工程复杂度、团队存量和迁移成本，而不是只给结论。"
      leadTitle="先讲开发期机制，再讲工程化场景的选择逻辑"
      lead="如果只谈速度，这题会很薄。更完整的回答应该说明：Vite 和 Webpack 对开发期模块加载的处理方式根本不同，而选型时还必须把存量工程、定制能力和迁移成本纳入判断。"
      answerOutline={[
        '先讲开发期机制差异',
        '再讲 Vite 为什么通常更快',
        '然后讲 Webpack 的成熟工程价值',
        '最后给出新项目与老项目的场景化选择',
      ]}
      quickAnswer="一句话答法：Vite 和 Webpack 的核心差异在于开发期机制。Vite 在开发期利用原生 ESM 按需加载模块，生产期再交给 Rollup 打包，因此冷启动和热更新通常更快；Webpack 则从开发到生产都更偏统一 bundling 思维，虽然启动成本通常更高，但在复杂存量工程和深度定制构建链上更成熟。新项目我通常优先考虑 Vite，复杂老项目则会更谨慎地评估 Webpack 迁移成本。"
      pullQuote="这道题真正比的不是“谁更快”，而是“谁更适合当前工程环境”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '一定先讲机制差异，不要直接站队。',
        '被问场景时，优先按新项目 / 存量项目来回答。',
        '顺手提迁移成本，会比只讲工具能力更像真实选型。',
      ]}
      mistakes={[
        '把答案简化成“Vite 新所以更好”。',
        '只说体验，不说底层开发期机制差异。',
        '忽略老项目迁移和深度定制构建链成本。',
      ]}
      comparisonTable={comparisonTable}
      singleColumn
    />
  );
}
