import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '解析、转换、生成、polyfill、preset 和插件。' },
  { label: 'Core', value: 'Parse -> Transform -> Generate', detail: '理解 Babel 最稳的方式，就是把它当成一条编译流水线。' },
  { label: 'Scenes', value: 'JSX / 新语法', detail: 'React、TS、现代语法兼容都经常会碰到它。' },
] as const;

const definitions = [
  { title: 'Babel 本质上是源码转换工具', detail: '它会读懂代码、改写代码，再吐出新的代码。' },
  { title: 'Babel 不等于打包器', detail: '它主要负责语法层面的转换，不负责把整个依赖图打包成一个 bundle。' },
  { title: 'Babel 的主线通常是 parse、transform、generate', detail: '这三个阶段几乎是所有 Babel 面试题的核心。' },
  { title: 'preset 是插件集合', detail: '你可以把它理解成“为某类场景打包好的插件套餐”。' },
  { title: '插件可以做非常细粒度的语法转换', detail: '比如处理 JSX、class properties、可选链等。' },
  { title: 'polyfill 和语法转换不是同一个问题', detail: '语法能改写，不代表新内建 API 自动可用。' },
] as const;

const relations = [
  { title: 'Parse', detail: '先把源码解析成 AST。', signal: 'AST' },
  { title: 'Transform', detail: '插件在 AST 上做改写。', signal: 'Plugin Pipeline' },
  { title: 'Generate', detail: '再把 AST 重新生成代码。', signal: 'Output Code' },
  { title: 'Polyfill', detail: '补的是运行时能力，不只是语法长相。', signal: 'Runtime Support' },
] as const;

const relationCode = `source code
-> parse to AST
-> plugin transforms AST
-> generate output
-> if needed, add polyfill/runtime support`;

const basics = [
  {
    title: '问题 1：Babel 到底做了什么？',
    answer: '最稳的回答是：它把源码解析成 AST，通过插件改写，再生成新的代码，以便兼容目标环境或支持特定语法。',
    explanation: '这句话把 Babel 的主流程和使用目的都覆盖了。',
    code: `const fn = (name) => \`hi \${name}\`;`,
    codeTitle: 'Source Example',
  },
  {
    title: '问题 2：Babel 和 Webpack / Vite 是什么关系？',
    answer: 'Babel 更像“代码翻译器”，Webpack / Vite 更像“构建与交付系统”。它们经常合作，但职责不同。',
    explanation: '工程题里最好主动把“转换”和“打包”拆开。',
    code: `// Babel 负责把语法变成目标环境更易执行的形式
// 打包器负责处理依赖图、资源和产物输出`,
    codeTitle: 'Role Split',
  },
  {
    title: '问题 3：为什么 Babel 要先转 AST？',
    answer: '因为直接改字符串既脆弱又难做语义级处理，而 AST 更适合做结构化分析和修改。',
    explanation: '这题答出“结构化处理”就很稳。',
    code: `Identifier(name)
CallExpression(callee, arguments)
JSXElement(openingElement, children)`,
    codeTitle: 'AST Nodes',
  },
  {
    title: '问题 4：preset 和 plugin 有什么区别？',
    answer: 'plugin 是单个能力，preset 是为某一类场景打包好的插件组合。',
    explanation: '可以把 preset 理解成“预配置好的转换套餐”。',
    code: `{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-runtime"]
}`,
    codeTitle: 'Preset vs Plugin',
  },
] as const;

const practical = [
  {
    title: '问题 5：Babel 转了语法，为什么还可能跑不起来？',
    answer: '因为某些问题不是语法长相，而是运行时能力，比如 `Promise`、`Map`、`Array.from` 这些 API 支持。',
    explanation: '这就是为什么 polyfill 不能和语法转换混成一件事。',
    code: `const data = Array.from(new Set([1, 2, 2]));

// 语法可能没问题，
// 但旧环境如果没有 Array.from / Set，还是跑不了。`,
    codeTitle: 'Runtime Capability',
  },
  {
    title: '问题 6：`@babel/preset-env` 在解决什么？',
    answer: '它会根据目标环境和兼容配置，决定需要开启哪些语法转换和相关补充策略。',
    explanation: '答题时补一句“按 target 做差异化转换”会更完整。',
    code: `{
  "presets": [
    ["@babel/preset-env", { "targets": "> 0.5%, not dead" }]
  ]
}`,
    codeTitle: 'Preset Env Targets',
  },
  {
    title: '问题 7：Babel 还能做什么高级用途？',
    answer: '除了兼容语法，它还可以做代码增强、按需导入、编译期插桩、国际化提取等工程能力。',
    explanation: '这题能体现你知道 Babel 不只是“降级箭头函数”。',
    code: `import { Button } from 'ui-lib';

// 某些插件会改写成
import Button from 'ui-lib/button';`,
    codeTitle: 'Import Transform',
  },
  {
    title: '问题 8：这一题最后怎么答得更工程化？',
    answer: '用“语法转换、运行时能力、构建协作”三层模型收尾，会比只背 preset 名字更像做过项目。',
    explanation: '工程化回答要把 Babel 放进完整的工具链里。',
    code: `语法 -> Babel
运行时能力 -> polyfill / runtime
构建输出 -> bundler`,
    codeTitle: 'Three-layer Model',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先判断是语法问题还是运行时问题', detail: '这一步能直接区分 Babel 和 polyfill 的职责。' },
  { title: '第二步：再看目标环境', detail: '没有 target，很多兼容策略就讲不完整。' },
  { title: '第三步：确认是单个插件还是 preset 组合', detail: '这会影响你对配置复杂度的判断。' },
  { title: '第四步：把 Babel 放回整个构建链', detail: '它通常只是工具链的一环。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 Babel 当成打包器', detail: '它会改代码，但不负责把整个应用依赖图打成发布产物。', points: ['转换不等于打包', '角色不同', '常常协作使用'] },
  { title: '高频误区 2：把语法转换和 polyfill 混掉', detail: '一个解决“写法”，一个解决“环境能力”。', points: ['语法', 'API', '运行时支持'] },
  { title: '高频误区 3：只会背插件名字，不会说流程', detail: '面试里讲 parse / transform / generate 会更稳。', points: ['AST', '插件改写', '代码生成'] },
  { title: '高频误区 4：以为 Babel 只服务旧浏览器', detail: '现代工程也会用它做 JSX、宏、编译期增强。', points: ['JSX', '转换链', '工程插件'] },
] as const;

const rules = [
  { title: 'Babel 主线先讲 AST 流水线', detail: '这是最稳的原理答案。' },
  { title: '语法兼容和 API 兼容分开说', detail: '这样不会把 Babel 和 polyfill 答混。' },
  { title: 'preset 是套餐，plugin 是单点能力', detail: '一句话就能把配置层级说清。' },
  { title: '收尾时把 Babel 放回构建链', detail: '这样回答更像做过真实工程。' },
] as const;

export default function BabelSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / Compiler"
      title="Babel 做了什么"
      lead="很多人知道 Babel 能把新语法变旧语法，但这只是表层。更稳的理解方式是把它看成一条源码转换流水线，然后再区分语法转换、运行时能力和构建工具之间的关系。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把 Babel 的职责摆正）"
      definitionsNote="用意：先知道 Babel 解决什么，不解决什么。"
      definitions={definitions}
      relationsTitle="块 2：Babel 流水线速览"
      relationsNote="用意：把 parse / transform / generate 这条主线捋清。"
      relations={relations}
      relationCodeTitle="Babel Pipeline"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 Babel 原理题答稳。', label: 'Babel Basics', questions: basics },
        { title: '块 4：工程实践问题', note: '用意：再把 preset、polyfill 和真实构建链联系起来。', label: 'Build Pipeline', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 Babel 题时按职责边界来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把最容易混淆的几个概念提前拆开。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆 Babel 的正确定位。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={engineeringTheme}
    />
  );
}
