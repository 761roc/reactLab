import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '本质', value: '静态分析无法确定未使用代码可安全删除' },
  { label: '高频原因', value: 'CommonJS、sideEffects、整库引入、转译破坏 ESM' },
  { label: '排查手段', value: '看产物、看依赖格式、看配置、看导入写法' },
  { label: '答题重点', value: '先讲失效原理，再讲排查路径' },
];

const sections: EditorialSection[] = [
  {
    title: '1. Tree Shaking 失效的根因，不是“工具不好”，而是静态分析前提被破坏',
    paragraphs: [
      'Tree Shaking 能成立，核心前提是 bundler 能通过静态分析判断：哪些导出没被使用，并且删除它们不会影响运行结果。只要这个前提被破坏，Tree Shaking 就可能失效。',
      '因此这道题最稳的开头，不是列一堆原因，而是先说：Tree Shaking 依赖 ESM 的静态结构和副作用可判断性，一旦模块格式、转译结果或副作用声明让工具无法安全判断，优化就会失败。',
      '有了这条主线，后面的原因才不是散点。',
    ],
  },
  {
    title: '2. CommonJS 是最经典的失效来源之一',
    paragraphs: [
      '因为 CommonJS 的导入导出更偏运行时行为，工具很难像处理 ESM 那样稳定地在编译期完成精确静态分析。因此如果依赖包是 CommonJS，或者构建链把原本的 ESM 转成了 CommonJS，就很容易让 Tree Shaking 退化。',
      '所以很多排查第一步都是看：当前依赖最终进入 bundler 的到底是不是 ESM。',
      '这也是为什么现代包生态非常强调 `module` 字段、ESM build 和不要在中间环节随便转 CJS。',
    ],
  },
  {
    title: '3. 副作用声明不清，会让 bundler 不敢删代码',
    paragraphs: [
      '即便是 ESM，如果某个模块在顶层执行了副作用，比如改全局变量、注册样式、修改原型、执行初始化逻辑，bundler 也不能轻易删除它。否则可能改变运行结果。',
      '因此 `sideEffects` 配置非常关键。如果库声明不准确，或者 CSS、polyfill、全局初始化模块被错误标成无副作用，就会出现删不掉或删错的情况。',
      '所以 Tree Shaking 失效经常不只是导入格式问题，也可能是副作用边界没有被正确描述。',
    ],
  },
  {
    title: '4. 整库引入和错误导入方式，也会让可删除粒度大幅下降',
    paragraphs: [
      '如果业务代码直接整库引入，而不是按需使用子模块，工具虽然有时还能做一些优化，但整体难度会明显上升。尤其是某些库导出方式本身就不利于细粒度裁剪时，最终产物很容易把大块无用代码带进去。',
      '因此排查时也要看调用侧写法：是 `import _ from "lodash"`，还是更细粒度地引入具体函数；是从 barrel 文件一层层转发，还是直接命中真实模块。',
      '也就是说，Tree Shaking 不是只看 bundler 配置，还要看代码使用方式。',
    ],
  },
  {
    title: '5. 真正排查时，我会按“产物 -> 依赖格式 -> 配置 -> 导入方式”四步走',
    paragraphs: [
      '第一步先看 bundle 产物和 analyzer，确认到底是哪个包、哪个模块没有被裁掉；第二步确认这个包进入构建时是 ESM 还是 CJS；第三步看 `sideEffects`、Babel/TS 转译配置、bundler 优化配置有没有破坏静态分析；第四步再看业务代码的导入方式是否粒度过粗。',
      '这个排查顺序很重要，因为它从现象倒推根因，而不是一上来就盲改配置。',
      '面试里如果给出清晰排查路径，通常比只会背原因更强。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答稳',
    paragraphs: [
      '先讲 Tree Shaking 依赖静态分析前提；再列常见失效来源：CommonJS、sideEffects 不准、整库引入、转译破坏 ESM；然后给出排查路径：看产物、看依赖格式、看配置、看导入方式；最后补一句“目标不是为了启用某个开关，而是恢复静态可裁剪条件”。',
      '一句话收尾很稳：Tree Shaking 失效，本质上是工具无法安全判断哪些代码真的可以删。',
    ],
  },
];

export default function EngineeringInterviewTreeShakingPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="Engineering Interview"
      company="面试-工程化 / 性能 / 发布类"
      issue="Issue 02"
      title="Tree Shaking 为什么会失效，如何排查"
      strapline="先讲静态分析前提，再讲失效原因和排查路径，这题就会很稳。"
      abstract="这道题真正考的是你是否知道 Tree Shaking 成立的条件，以及当条件被破坏时，如何从产物和构建链反推根因。"
      leadTitle="从“为什么能裁剪”反推“为什么会失效”"
      lead="如果只背 CommonJS、sideEffects、整库引入几个词，答案会很碎。更完整的回答应该先讲 Tree Shaking 依赖静态分析，然后再从模块格式、副作用边界、导入方式和构建配置几层解释失效。"
      answerOutline={[
        '先讲 Tree Shaking 依赖哪些前提',
        '再讲 CommonJS 和副作用边界如何破坏这些前提',
        '然后讲导入方式与转译配置的影响',
        '最后给出清晰的排查路径',
      ]}
      quickAnswer="一句话答法：Tree Shaking 会失效，本质上是 bundler 不能安全判断哪些代码未使用且可删除。常见原因包括依赖是 CommonJS、sideEffects 声明不准确、整库引入粒度过粗、构建转译把 ESM 破坏掉等。排查时我会先看 bundle 产物，再确认依赖格式、sideEffects 与转译配置，最后检查业务代码的导入方式。"
      pullQuote="Tree Shaking 不是魔法，它吃的是“静态可分析、可安全删除”这套前提。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲“为什么能摇”，再讲“为什么摇不掉”，逻辑最顺。',
        '排查路径一定要说，别只停在原因列表。',
        '被追问时，把 sideEffects 和模块格式讲透会很加分。',
      ]}
      mistakes={[
        '只会背 CommonJS，却说不清它为什么影响裁剪。',
        '把问题全归到 bundler，不看业务导入方式。',
        '没有给出实际排查步骤。',
      ]}
      singleColumn
    />
  );
}
