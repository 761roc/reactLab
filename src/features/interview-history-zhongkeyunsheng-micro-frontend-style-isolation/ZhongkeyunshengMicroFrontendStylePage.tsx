import {
  InterviewEditorialPage,
  type EditorialComparisonTable,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心问题', value: '多个子应用共存时避免样式互相污染' },
  { label: '常用手段', value: '命名空间、CSS Modules、Shadow DOM、iframe' },
  { label: '真正难点', value: '第三方样式、全局 reset、弹层挂载、主题共享' },
  { label: '推荐思路', value: '默认工程级隔离，局部再辅以运行时边界' },
];

const comparisonTable: EditorialComparisonTable = {
  title: '常见样式隔离手段对比',
  intro: '微前端里没有绝对唯一方案，通常是按子应用复杂度、团队规范和运行环境组合使用。',
  headers: ['方案', '优点', '代价'],
  rows: [
    ['命名空间 / BEM 前缀', '实现成本低、兼容性好', '靠人工约束，容易失守'],
    ['CSS Modules / 哈希类名', '工程化自动隔离，最常用', '处理全局样式和第三方库仍需额外策略'],
    ['Shadow DOM', '天然作用域隔离强', '主题、弹层、第三方组件集成复杂'],
    ['iframe', '隔离最彻底', '通信、性能、体验和 SEO 成本高'],
  ],
};

const sections: EditorialSection[] = [
  {
    title: '1. 先明确样式隔离在微前端里要解决什么问题',
    paragraphs: [
      '微前端最大的风险之一，是多个子应用在同一页面生命周期里共存。此时样式如果没有边界，很容易出现类名冲突、全局 reset 互相覆盖、主题变量串改、弹层样式失控等问题。',
      '所以样式隔离不只是“防止一个按钮颜色错了”，它实际是在保证每个子应用都能以相对独立的视觉规则运行，而不影响其他应用和主应用壳层。',
      '面试里如果先把问题域讲清楚，后面谈方案就不会像背书，而会显得是在解决真实系统问题。',
    ],
  },
  {
    title: '2. 最基础的一层隔离，是工程级命名隔离：命名空间、BEM、CSS Modules',
    paragraphs: [
      '最常见的第一层方案，是在工程级确保类名不冲突。简单一点可以用统一前缀或 BEM 命名规范，例如所有某子应用类名都带上 appA 前缀；更稳的方式是 CSS Modules 或 CSS-in-JS，让构建工具自动生成局部唯一类名。',
      '这类方案的优点是成本相对低、兼容性好、不会影响正常 DOM 和事件模型，因此在绝大多数微前端项目里，它们都是默认基础设施。',
      '但它们也有边界：如果子应用里写了全局样式、覆盖了 body/html、引入了第三方库默认样式，或者弹层 Portal 挂到了 document.body，工程级哈希并不能自动解决所有问题。',
    ],
    bullets: [
      'CSS Modules 通常是最常见的默认隔离手段。',
      '命名规范能兜底，但过度依赖人工约束不稳。',
      '第三方全局样式和 Portal 往往是额外风险点。',
    ],
    codeTitle: '通过容器前缀做作用域限制',
    code: `.subAppA .button {
  color: #1677ff;
}

.subAppA .tableWrap :global(.ant-table) {
  border-radius: 12px;
}`,
  },
  {
    title: '3. 更强的一层隔离，是运行时边界：Shadow DOM 或样式沙箱',
    paragraphs: [
      '如果业务对子应用样式独立性要求非常强，比如多个团队维护的设计体系差异很大，或者存在严重的全局样式污染风险，可以考虑 Shadow DOM 或框架级样式沙箱。',
      'Shadow DOM 的优势是浏览器原生作用域隔离，子树内部样式默认不影响外部，外部样式也很难直接污染内部。这在理论上很强，但实际工程里会带来主题变量透传、弹层挂载、第三方组件兼容、调试复杂度上升等问题。',
      '所以它更适合隔离要求极高且能接受工程成本的场景，而不是所有微前端项目的默认选择。',
    ],
    bullets: [
      'Shadow DOM 隔离强，但生态兼容成本也更高。',
      '适合强隔离场景，不一定适合所有中后台。',
      '选择时要同时考虑主题、弹层和组件库兼容。',
    ],
  },
  {
    title: '4. 最彻底的隔离是 iframe，但它通常是“隔离优先级极高”时的选择',
    paragraphs: [
      'iframe 在样式隔离上几乎是最彻底的，因为 DOM、JS、CSS、全局变量都天然隔开。它确实能从根本上避免子应用样式互相污染。',
      '但它的代价也非常明显：通信复杂、加载更重、路由与历史栈处理麻烦、SEO 不友好、交互体验断层明显，很多主应用级能力也需要额外桥接。',
      '因此 iframe 更像一张强隔离兜底牌，而不是现代微前端默认推荐路径。面试里说到它时，要连同代价一起说。',
    ],
  },
  {
    title: '5. 真正的落地策略，通常不是单一方案，而是分层治理',
    paragraphs: [
      '成熟项目很少会只靠一种机制。更常见的做法是：默认使用 CSS Modules 或哈希类名做工程级隔离；约束全局样式只能在主应用壳层管理；子应用禁止直接改 `body/html`；弹层统一挂载到子应用容器或带命名空间的 Portal 根节点；必要时对极端隔离场景使用 Shadow DOM 或 iframe。',
      '这套思路的重点是把问题拆层处理，而不是迷信某个绝对方案。因为真正导致样式污染的，往往不是普通组件，而是 reset 样式、主题变量、Portal、第三方组件库和运行时插入样式。',
      '如果你把“分层治理”讲出来，答案会比单纯背几个术语更像真实架构经验。',
    ],
  },
  {
    title: '6. 面试里怎样把微前端样式隔离讲完整',
    paragraphs: [
      '最稳的答法是：先说样式隔离要解决的是多个子应用共存时的类名冲突、全局污染和主题串改；然后分层讲方案，从命名空间 / CSS Modules 讲到 Shadow DOM / iframe；最后补充弹层、reset、第三方样式和主题共享这些真正难点。',
      '如果被问“你会选哪种”，通常可以回答：默认先用工程级样式隔离做基础，配合子应用容器边界和弹层约束；只有在强隔离要求极高时，才考虑 Shadow DOM 或 iframe。',
      '一句话收尾很有效：微前端样式隔离不是某一个技术点，而是一套从构建到运行时的边界治理方案。',
    ],
  },
];

export default function ZhongkeyunshengMicroFrontendStylePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 06"
      title="微前端如何实现样式隔离"
      strapline="样式隔离不是只防类名冲突，它要解决的是多个子应用共存时的边界治理。"
      abstract="这道题的关键不在于报出几个名词，而在于你能否把样式污染问题拆成工程级隔离、运行时边界、全局样式治理和特殊节点管理几个层次。"
      leadTitle="从类名冲突讲到运行时边界，把样式隔离说成一套系统方案"
      lead="微前端样式隔离真正难的地方，不是普通按钮，而是全局 reset、主题变量、弹层 Portal、第三方组件库和多团队协作边界。回答时如果只说 CSS Modules，会显得不够完整；如果能讲出分层治理思路，答案就会更像真实项目经验。"
      answerOutline={[
        '先讲样式隔离要解决的真实问题',
        '再讲命名空间与 CSS Modules 这类工程级方案',
        '然后讲 Shadow DOM / iframe 这类强隔离方案',
        '最后补运行时边界、弹层和主题治理',
      ]}
      quickAnswer="一句话答法：微前端实现样式隔离，通常会先用命名空间、CSS Modules 或哈希类名做工程级隔离，避免普通样式冲突；再限制全局样式、生效范围和弹层挂载位置；对于隔离要求极高的场景，可以考虑 Shadow DOM 或 iframe。真正稳的做法不是依赖单一技术，而是从构建和运行时两层同时做边界治理。"
      pullQuote="默认用工程级隔离兜底，极端场景再上强隔离，这是微前端样式治理最常见的现实路线。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '不要只报方案名，要先讲“为什么微前端会产生样式污染”。',
        '回答时最好分层：工程级隔离、运行时隔离、特殊节点治理。',
        '被问选型时，默认先选 CSS Modules 一类低成本方案，再说明强隔离备选。',
      ]}
      mistakes={[
        '把样式隔离只理解成类名冲突，没有提全局 reset、主题和 Portal。',
        '只会说 Shadow DOM 很强，却不说生态和工程代价。',
        '把 iframe 当默认方案，却忽略通信和体验成本。',
      ]}
      comparisonTable={comparisonTable}
    />
  );
}
