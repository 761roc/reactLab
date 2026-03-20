import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '加载时机、静态分析、live binding、循环依赖和互操作。' },
  { label: 'Core', value: 'Static vs Runtime', detail: '模块题的核心是结构是否静态、值什么时候可拿到。' },
  { label: 'Scenes', value: 'Build / Node / Browser', detail: '打包器、Node 环境和前端构建里都经常会碰到。' },
] as const;

const definitions = [
  { title: 'ESM 是标准模块系统', detail: '它使用 `import` 和 `export`，结构更静态，更利于分析。' },
  { title: 'CommonJS 更偏运行时加载', detail: '常见写法是 `require` 和 `module.exports`。' },
  { title: 'ESM 更利于 tree shaking', detail: '因为导入导出关系在代码结构上更明确。' },
  { title: 'ESM 有 live binding 语义', detail: '导入的是绑定关系，不是简单拷贝一份值。' },
  { title: '循环依赖两边都可能碰到坑', detail: '只是表现形式和分析方式会有所不同。' },
  { title: '模块化题通常和工程化强相关', detail: '它不只影响语法，还影响构建、兼容和部署。' },
] as const;

const relations = [
  { title: 'ESM', detail: '静态结构，适合构建期分析。', signal: 'Static Import' },
  { title: 'CommonJS', detail: '运行时加载，更灵活也更动态。', signal: 'Runtime Require' },
  { title: 'Live Binding', detail: '导入值会跟随导出绑定变化。', signal: 'Binding' },
  { title: 'Interop', detail: '不同模块系统互转时要处理默认导出和命名导出的差异。', signal: 'Compatibility' },
] as const;

const relationCode = `ESM
-> import/export
-> static analysis
-> tree shaking friendly

CommonJS
-> require/module.exports
-> runtime loading
-> dynamic but harder to analyze`;

const basics = [
  {
    title: '问题 1：ESM 和 CommonJS 最核心的区别是什么？',
    answer: '最核心的区别是结构是否更静态，以及加载和解析更偏构建期还是运行时。',
    explanation: '这比只说 `import` 和 `require` 更有工程视角。',
    code: `// ESM
import { add } from './math.js';

// CommonJS
const { add } = require('./math');`,
    codeTitle: 'Module Syntax',
  },
  {
    title: '问题 2：为什么说 ESM 更利于 tree shaking？',
    answer: '因为打包器更容易静态分析 import/export 关系，知道哪些导出真正被使用了。',
    explanation: '模块题和 tree shaking 题经常会串起来问。',
    code: `export const add = () => {};
export const remove = () => {};`,
    codeTitle: 'Static Export',
  },
  {
    title: '问题 3：什么是 live binding？',
    answer: '就是导入方拿到的是绑定关系，导出方的值更新后，导入方读取到的也是更新后的值。',
    explanation: '这里要避免把它理解成“导入时拷贝一份”。',
    code: `// counter.ts
export let count = 0;
export const inc = () => { count += 1; };`,
    codeTitle: 'Live Binding Example',
  },
  {
    title: '问题 4：CommonJS 就完全不能做优化吗？',
    answer: '不是完全不能，但因为动态性更强，很多静态优化会更难做，也更容易让打包器保守处理。',
    explanation: '回答时避免绝对化更稳。',
    code: `const name = getMethodName();
const fn = require('./utils')[name];`,
    codeTitle: 'Dynamic Access',
  },
] as const;

const practical = [
  {
    title: '问题 5：为什么模块互操作经常出问题？',
    answer: '因为默认导出、命名导出、`module.exports` 和转译层之间的兼容规则不完全一致。',
    explanation: '这也是为什么有时会看到 `.default` 之类的现象。',
    code: `import foo from './legacy-cjs';
const bar = require('./esm-build');`,
    codeTitle: 'Interop Surface',
  },
  {
    title: '问题 6：循环依赖为什么难排查？',
    answer: '因为两个模块都可能在对方还没初始化完成时就试图读取值，结果取到半成品或未准备好的状态。',
    explanation: '模块题里的坑很多都是初始化时机问题。',
    code: `a -> import b
b -> import a`,
    codeTitle: 'Circular Dependency',
  },
  {
    title: '问题 7：前端工程里为什么更推荐优先用 ESM？',
    answer: '因为它和现代浏览器、打包器、tree shaking、按需加载这整套能力更契合。',
    explanation: '这里最好强调“契合现代工具链”，而不是单纯说“新”。',
    code: `export { Button } from './button';
export { Dialog } from './dialog';`,
    codeTitle: 'Modern Module Style',
  },
  {
    title: '问题 8：这题最后怎么答得像实战？',
    answer: '用“静态分析、运行时行为、互操作、循环依赖风险”四个维度收尾。',
    explanation: '这样回答会比语法比较更有层次。',
    code: `静态分析
运行时加载
绑定语义
兼容成本`,
    codeTitle: 'Answer Dimensions',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先看当前环境到底是 Node、浏览器还是打包器', detail: '同一个模块问题，在不同环境里现象可能不同。' },
  { title: '第二步：判断是静态导入还是运行时动态加载', detail: '这一步决定很多优化能不能做。' },
  { title: '第三步：排查是否有互操作层', detail: '转译和兼容层往往会放大理解偏差。' },
  { title: '第四步：模块异常时检查循环依赖', detail: '很多“值不对”其实是初始化顺序问题。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把模块题答成纯语法题', detail: '更有价值的是静态分析、加载时机和兼容影响。', points: ['结构', '时机', '工程影响'] },
  { title: '高频误区 2：把 ESM 导入当成值拷贝', detail: 'live binding 语义经常会被忽略。', points: ['绑定关系', '不是简单复制', '更新可感知'] },
  { title: '高频误区 3：忽略 CommonJS 的动态性', detail: '动态 require 和动态属性访问会让优化和理解都更难。', points: ['运行时决定', '更灵活', '更难静态分析'] },
  { title: '高频误区 4：模块报错时不查循环依赖', detail: '这类问题经常很隐蔽，但非常常见。', points: ['初始化顺序', '半成品值', '难定位'] },
] as const;

const rules = [
  { title: '模块题先讲静态结构和加载时机', detail: '这比只比较语法更稳。' },
  { title: 'ESM 更适合现代构建优化', detail: '尤其是 tree shaking 和按需加载。' },
  { title: 'live binding 要单独提', detail: '这是很多模块题的区分点。' },
  { title: '遇到奇怪值先查循环依赖', detail: '初始化顺序问题很常见。' },
] as const;

export default function ModuleToolsSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / Module"
      title="模块化：ESM 和 CommonJS"
      lead="模块化题很容易被答成语法对比，但真正重要的是静态分析、加载时机、绑定语义和互操作成本。这页把这些点放回同一条工程主线里讲。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把模块系统的定位分清）"
      definitionsNote="用意：先知道 ESM 和 CommonJS 各自强在哪里。"
      definitions={definitions}
      relationsTitle="块 2：模块系统主线速览"
      relationsNote="用意：把静态结构、运行时加载和互操作串起来。"
      relations={relations}
      relationCodeTitle="Module Model"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 ESM / CommonJS 的核心差异答稳。', label: 'Module Basics', questions: basics },
        { title: '块 4：工程实践问题', note: '用意：再把互操作、循环依赖和现代工具链接起来。', label: 'Module Practice', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到模块问题时按环境和时机来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把最容易说混和排漏的点提前拆开。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆模块题的主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={engineeringTheme}
    />
  );
}
