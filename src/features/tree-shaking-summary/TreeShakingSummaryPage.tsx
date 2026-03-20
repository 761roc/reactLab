import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '静态分析、sideEffects、无效导入、产物体积和常见误解。' },
  { label: 'Core', value: 'Remove Unused', detail: 'Tree shaking 不是玄学，本质是打包器删掉确定不会被用到的代码。' },
  { label: 'Scenes', value: '库 / 应用', detail: '业务应用和公共库都很关心它，但关注点略有不同。' },
] as const;

const definitions = [
  { title: 'Tree shaking 的核心是删除未使用导出', detail: '前提是打包器能静态分析出哪些导出真的没被引用。' },
  { title: 'ESM 更适合 tree shaking', detail: '因为 import/export 结构更静态，打包器更容易提前看懂依赖关系。' },
  { title: '不是所有没用到的代码都一定能被删', detail: '只要有副作用、动态引用或分析不确定，工具就会保守保留。' },
  { title: '`sideEffects` 会影响删除策略', detail: '它告诉打包器某些文件是否在“仅被导入”时也可能带来副作用。' },
  { title: 'tree shaking 和代码分割不是同一个问题', detail: '一个偏删无用代码，一个偏拆包加载。它们常一起出现，但不是一回事。' },
  { title: '压缩不是 tree shaking', detail: '压缩是在保留逻辑前提下缩短代码，tree shaking 是直接删掉无用部分。' },
] as const;

const relations = [
  { title: '静态导出', detail: '打包器更容易识别真正被引用的成员。', signal: 'Static Analysis' },
  { title: '副作用文件', detail: '即使看起来没被使用，也可能因为副作用而保留。', signal: 'Keep Safe' },
  { title: '动态访问', detail: '工具看不准时会保守处理。', signal: 'Hard To Shake' },
  { title: '库设计', detail: '导出方式和文件结构会直接影响摇树效果。', signal: 'Library Friendly' },
] as const;

const relationCode = `写代码
-> 用 ESM 导出
-> 打包器分析 import/export
-> 判断哪些导出未使用
-> 检查是否存在副作用
-> 删除安全可删的部分`;

const basics = [
  {
    title: '问题 1：Tree shaking 一句话怎么解释？',
    answer: '就是打包器在构建时通过静态分析，把确定没被用到的导出代码删掉。',
    explanation: '“静态分析”和“确定没被用到”这两个关键词最好都带上。',
    code: `export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

import { add } from './math';`,
    codeTitle: 'Unused Export Example',
  },
  {
    title: '问题 2：为什么常说 ESM 更适合 tree shaking？',
    answer: '因为 ESM 的导入导出结构更静态，打包器在构建时更容易知道谁被用了、谁没被用。',
    explanation: '回答时别只说“因为 import/export”，要补上静态结构这个原因。',
    code: `// good
import { add } from './math';

// harder to analyze
const lib = require('./math');
const fn = lib[name];`,
    codeTitle: 'Static vs Dynamic',
  },
  {
    title: '问题 3：为什么有些没用到的代码还是没被删？',
    answer: '常见原因是文件有副作用、导入方式不利于分析，或者打包器无法安全判断删除是否会改变行为。',
    explanation: '这类题重点在“安全删除”，不是“尽可能删”。',
    code: `// side-effect.ts
console.log('init analytics');

export const tracker = {};`,
    codeTitle: 'Side Effect Keeps Module',
  },
  {
    title: '问题 4：`sideEffects` 是干什么的？',
    answer: '它是给打包器一个提示，说明哪些文件仅被导入时也可能产生副作用，不能随便删。',
    explanation: '讲清楚“按文件声明副作用”就够稳了。',
    code: `{
  "sideEffects": [
    "*.css",
    "./src/polyfills.ts"
  ]
}`,
    codeTitle: 'Package Side Effects',
  },
] as const;

const practical = [
  {
    title: '问题 5：`import * as utils` 会影响 tree shaking 吗？',
    answer: '通常更容易让分析变保守，因为你把整个命名空间都拿进来了，工具不一定能精确知道你最终用了哪些成员。',
    explanation: '最好强调“更容易变差”，而不是绝对说“完全不行”。',
    code: `import * as utils from './utils';

utils.formatPrice(100);`,
    codeTitle: 'Namespace Import',
  },
  {
    title: '问题 6：tree shaking 和代码分割有什么区别？',
    answer: 'tree shaking 是删没用的代码，代码分割是把有用代码拆成多个 chunk 按需加载。',
    explanation: '这是工程化高频对比题，最好一句话就区分开。',
    code: `const SettingsPage = lazy(() => import('./SettingsPage'));

// 这是代码分割，不是 tree shaking。`,
    codeTitle: 'Code Splitting Example',
  },
  {
    title: '问题 7：做组件库时怎样更利于 tree shaking？',
    answer: '用 ESM、按模块导出、减少顶层副作用、避免巨型入口一次性把所有东西都串起来。',
    explanation: '组件库题最怕入口文件写成“大杂烩”。',
    code: `export { Button } from './button';
export { Dialog } from './dialog';
export { Tabs } from './tabs';`,
    codeTitle: 'Library Exports',
  },
  {
    title: '问题 8：怎么判断项目里 tree shaking 有没有生效？',
    answer: '看构建产物体积、bundle 分析报告和实际导入方式，而不是只看配置文件里有没有那几个关键词。',
    explanation: '工程题最后最好回到“怎么验证”。',
    code: `// 可以配合可视化分析插件
// 看某个未用模块是否还在主包里
// 看 vendor chunk 里有没有异常体积`,
    codeTitle: 'Verification Mindset',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先看是不是 ESM 导入导出', detail: '没有静态结构，后面很多优化就不稳。' },
  { title: '第二步：再看文件有没有副作用', detail: '顶层执行代码、样式导入、polyfill 都要注意。' },
  { title: '第三步：检查导入方式是不是过于笼统', detail: '`import * as`、动态访问会让分析更保守。' },
  { title: '第四步：用产物报告验证', detail: '不要只靠感觉判断摇树有没有成功。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把压缩当成 tree shaking', detail: '两者都能让体积变小，但原理不一样。', points: ['压缩是缩写', 'tree shaking 是删代码', '优化链路不同'] },
  { title: '高频误区 2：以为开了 ESM 就一定能摇干净', detail: '副作用、动态访问、库结构都可能让结果打折。', points: ['静态结构只是前提', '不是结果保证', '还要看实现方式'] },
  { title: '高频误区 3：只看配置，不看产物', detail: '真正的答案在 bundle 里，不在口号里。', points: ['分析产物', '看 chunk', '看体积差异'] },
  { title: '高频误区 4：把代码分割和摇树混为一谈', detail: '一个是删除，一个是拆分。', points: ['删无用', '拆有用', '目的不同'] },
] as const;

const rules = [
  { title: '先讲静态分析，再讲副作用', detail: '这是最稳的 tree shaking 主线。' },
  { title: 'ESM 更利于 tree shaking，但不保证自动完美', detail: '这句能防止你回答过满。' },
  { title: '组件库入口要克制', detail: '越少顶层副作用，越容易被消费方正确摇树。' },
  { title: '验证靠 bundle，不靠想象', detail: '工程化题最后最好落到可观测结果。' },
] as const;

export default function TreeShakingSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / Bundle"
      title="Tree Shaking 原理"
      lead="这页把 tree shaking 放回构建原理里讲清楚。它不是一句“删没用代码”就结束，真正关键的是为什么能删、什么时候删不掉、做应用和做库时各自要注意什么。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先知道 tree shaking 在删什么）"
      definitionsNote="用意：先把静态分析、副作用和代码分割这些相近概念分开。"
      definitions={definitions}
      relationsTitle="块 2：摇树主线速览"
      relationsNote="用意：把工具判断是否可删的流程捋清。"
      relations={relations}
      relationCodeTitle="Shaking Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把原理题答稳。', label: 'Shaking Basics', questions: basics },
        { title: '块 4：工程实践问题', note: '用意：再把导入方式、组件库和验证方法落到实战里。', label: 'Practical Bundle', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到“为什么没摇掉”时按这条顺序排。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：提前拆掉最容易说混的几个点。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆最关键的判断线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={engineeringTheme}
    />
  );
}
