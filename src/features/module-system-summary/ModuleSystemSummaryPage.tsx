import type { CSSProperties } from 'react';
import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';

const themeStyle = {
  '--kp-hero-border': '#ddd6fe',
  '--kp-hero-radial-1': 'rgba(139, 92, 246, 0.16)',
  '--kp-hero-radial-2': 'rgba(59, 130, 246, 0.12)',
  '--kp-hero-bg': '#faf8ff',
  '--kp-eyebrow-border': '#ddd6fe',
  '--kp-eyebrow-bg': '#f5f3ff',
  '--kp-eyebrow-text': '#6d28d9',
  '--kp-signal-border': '#ddd6fe',
  '--kp-signal-bg': '#f5f3ff',
  '--kp-signal-text': '#6d28d9',
  '--kp-answer-border': '#ddd6fe',
  '--kp-answer-bg': '#f5f3ff',
  '--kp-explain-border': '#bfdbfe',
  '--kp-explain-bg': '#eff6ff',
  '--kp-code-accent': '#c4b5fd',
  '--kp-tag-border': '#ddd6fe',
  '--kp-tag-bg': '#f5f3ff',
  '--kp-tag-text': '#6d28d9',
  '--kp-button-border': '#c4b5fd',
  '--kp-button-text': '#6d28d9',
  '--kp-button-hover': '#f5f3ff',
} as CSSProperties;

const heroCards = [
  {
    label: 'Questions',
    value: '8',
    detail: '覆盖 ESM、CommonJS、静态分析、tree shaking、循环依赖和默认导出等高频题。'
  },
  {
    label: 'Focus',
    value: 'Static vs Runtime',
    detail: '模块系统差异的核心往往是“能否静态分析”和“导出值是实时绑定还是运行时快照”。'
  },
  {
    label: 'Scenarios',
    value: '打包 / Node / 浏览器',
    detail: '这些题不只是语法题，还和构建工具、运行环境、互操作性直接相关。'
  }
] as const;

const definitions = [
  {
    title: 'ESM 是标准模块系统',
    detail: '使用 `import` / `export`，语法静态、可分析，是现代浏览器和构建工具的核心模块体系。'
  },
  {
    title: 'CommonJS 是 Node 早期主流模块系统',
    detail: '使用 `require` / `module.exports`，加载和执行更偏运行时语义。'
  },
  {
    title: 'ESM 的导入导出是静态结构',
    detail: '这让打包器更容易做 tree shaking、依赖图分析和预加载优化。'
  },
  {
    title: 'ESM 导出是 live binding',
    detail: '导出的绑定在模块间是联动的，不是简单的值复制。'
  },
  {
    title: 'CommonJS 更像运行时拿到一个导出对象',
    detail: '它的 require 调用可以写在条件分支里，更灵活，但也更难静态分析。'
  },
  {
    title: '模块化题最后都要落回“加载时机 + 分析能力 + 互操作”',
    detail: '不要只会背语法差别，真正关键的是工程影响。'
  }
] as const;

const relations = [
  {
    title: 'ESM',
    detail: '标准化、静态语法、浏览器与打包器友好。',
    signal: 'Static Imports'
  },
  {
    title: 'CommonJS',
    detail: 'Node 历史主流、运行时 require、导出对象导向。',
    signal: 'Runtime Require'
  },
  {
    title: 'Live Binding',
    detail: 'ESM 导入的是绑定关系，源模块更新后使用方读取到的是最新值。',
    signal: 'Linked Binding'
  },
  {
    title: 'Interop',
    detail: '现代工程里经常需要 ESM 和 CommonJS 混用与互转。',
    signal: 'Tooling Matters'
  }
] as const;

const relationCode = `// counter.js
export let count = 0
export function increment() {
  count += 1
}

// app.js
import { count, increment } from "./counter.js"

console.log(count) // 0
increment()
console.log(count) // 1`;

const esmQuestions = [
  {
    title: '问题 1：为什么说 ESM 更适合 tree shaking？',
    answer: '因为 ESM 的 `import` / `export` 结构是静态的，打包器在构建阶段就能分析依赖图和未使用导出。',
    explanation:
      '这是工程意义上的核心优势。不是 ESM 自带 tree shaking，而是它提供了让打包器更容易做 tree shaking 的前提。',
    code: `// math.js
export const add = (a, b) => a + b
export const multiply = (a, b) => a * b

// app.js
import { add } from "./math.js"

console.log(add(1, 2))`,
    codeTitle: 'Tree Shaking Example'
  },
  {
    title: '问题 2：为什么 `import` 语句通常要求写在顶层？',
    answer: '因为 ESM 强调静态结构，顶层导入有助于在模块真正执行前完成依赖分析和加载准备。',
    explanation:
      '如果你需要动态条件加载，通常应使用 `import()`，而不是把静态 `import` 写进 if 语句。'
    ,
    code: `if (needFeature) {
  // import x from "./feature" // 语法不允许
}

const module = await import("./feature.js")`,
    codeTitle: 'Dynamic Import Example'
  },
  {
    title: '问题 3：ESM 的“live binding”到底是什么意思？',
    answer: '它表示导入方拿到的是对导出绑定的引用关系，而不是导出值的简单拷贝。',
    explanation:
      '这也是为什么源模块里更新了导出变量后，其他模块再次读取时能看到最新值。'
    ,
    code: `// state.js
export let theme = "light"
export const setTheme = (value) => {
  theme = value
}`,
    codeTitle: 'Live Binding Example'
  },
  {
    title: '问题 4：默认导出和具名导出面试里怎么答更稳？',
    answer: '具名导出更利于重构和静态分析；默认导出书写上更自由，但可读性和重命名约束更弱。',
    explanation:
      '面试里别答成“默认导出更高级”。要结合团队规范、自动补全、重构体验来讲。',
    code: `export default function Button() {}
export const buttonVariants = {}

import Button, { buttonVariants } from "./button.js"`,
    codeTitle: 'Default vs Named Example'
  }
] as const;

const cjsQuestions = [
  {
    title: '问题 5：CommonJS 和 ESM 最大的本质区别是什么？',
    answer: '最大区别通常可以概括成：ESM 更静态、更标准化；CommonJS 更运行时、更对象导向。',
    explanation:
      '好的回答要落到构建分析、加载方式、默认导出语义、循环依赖处理和互操作成本。'
    ,
    code: `// CommonJS
const fs = require("node:fs")
module.exports = { read: fs.readFileSync }

// ESM
import fs from "node:fs"
export const read = fs.readFileSync`,
    codeTitle: 'ESM vs CJS Example'
  },
  {
    title: '问题 6：为什么 CommonJS 更难做静态分析？',
    answer: '因为 `require` 是运行时函数调用，可以写在条件、循环、动态路径里，构建阶段更难完整推断依赖。',
    explanation:
      '这也是为什么历史上很多构建优化更偏好 ESM。不是说 CommonJS 不能打包，而是分析成本更高。'
    ,
    code: `const name = needMock ? "./mock" : "./real"
const service = require(name)`,
    codeTitle: 'Runtime Require Example'
  },
  {
    title: '问题 7：循环依赖在 ESM 和 CommonJS 里为什么经常表现不同？',
    answer: '因为两套模块系统的初始化和绑定模型不同。ESM 更依赖绑定关系和初始化顺序，CommonJS 更像导出对象逐步填充。',
    explanation:
      '面试时不一定要展开所有规范细节，但要知道循环依赖题不能只看语法，要结合执行顺序分析。'
    ,
    code: `// a.js
import { valueB } from "./b.js"
export const valueA = "A"

// b.js
import { valueA } from "./a.js"
export const valueB = valueA + "B"`,
    codeTitle: 'Circular Dependency Example'
  },
  {
    title: '问题 8：现代前端项目里为什么还需要理解 CommonJS？',
    answer: '因为 Node 生态里仍有大量 CommonJS 包，构建工具、SSR、脚本环境和库互操作时经常会碰到。',
    explanation:
      '尤其在 Vite、Webpack、Babel、TS 配置和 Node 运行模式切换时，模块系统差异会直接影响构建结果。'
    ,
    code: `// package.json
{
  "type": "module"
}

// 在不同 type / 扩展名下，Node 对 .js 的模块解释会不同`,
    codeTitle: 'Node Module Mode Example'
  }
] as const;

const diagnosticSteps = [
  {
    title: '第一步：先问这是语法差异，还是工程差异',
    detail: '模块系统题大多不该只停留在 `import` vs `require`。'
  },
  {
    title: '第二步：再问依赖能否静态分析',
    detail: '这一步往往决定 tree shaking、预加载和打包优化能不能做好。'
  },
  {
    title: '第三步：再看导出是 live binding 还是导出对象语义',
    detail: '很多循环依赖和默认导出问题都可以落到这里理解。'
  },
  {
    title: '第四步：最后补运行环境与互操作',
    detail: '浏览器、Node、打包器三者之间的行为差异，是模块化题的工程重点。'
  }
] as const;

const pitfalls = [
  {
    title: '高频误区 1：只会背 `import` 和 `require` 语法差别',
    detail: '真正高质量的回答必须讲到静态分析、tree shaking、运行时加载和互操作。',
    points: ['语法只是表层', '工程影响才是核心', '模块题不能脱离环境']
  },
  {
    title: '高频误区 2：把 ESM 的 tree shaking 说成“语言自带”',
    detail: 'tree shaking 是构建工具做的，ESM 提供的是更适合静态分析的前提。',
    points: ['语言能力 vs 工具能力', '静态结构很关键', '别把因果关系说反']
  },
  {
    title: '高频误区 3：不知道 live binding',
    detail: '很多人以为导入变量只是拷贝值，这会导致对 ESM 行为的理解长期模糊。',
    points: ['导入的是绑定', '读取的是最新值', '不是简单值复制']
  },
  {
    title: '高频误区 4：认为 CommonJS 已经过时无需了解',
    detail: '现实工程里依然大量存在，尤其在 Node、老包生态和工具链脚本中。',
    points: ['生态兼容仍然重要', 'Node 场景仍常见', '互操作问题很现实']
  }
] as const;

const rules = [
  {
    title: '静态分析、tree shaking 先想到 ESM',
    detail: '因为它的导入导出结构更适合构建阶段分析。'
  },
  {
    title: '运行时动态加载先想到 `import()` 或 CommonJS 语义差异',
    detail: '不要把静态 import 和动态场景混在一起。'
  },
  {
    title: '模块题讲不清时，先回到“加载时机 + 绑定方式”',
    detail: '大多数差异都能从这两点推出来。'
  },
  {
    title: '现代前端仍要懂两套模块系统',
    detail: '因为真实工程经常存在 ESM、CommonJS 与工具链互操作。'
  }
] as const;

export default function ModuleSystemSummaryPage() {
  return (
    <KnowledgeSummaryPage
      definitions={definitions}
      definitionsNote="用意：先把两套模块系统的定位和工程差异拆开。"
      definitionsTitle="块 1：基础定义（先分清两套模块语义）"
      diagnosticNote="用意：模块系统题不要只背语法，要按工程问题来拆。"
      diagnosticSteps={diagnosticSteps}
      diagnosticTitle="块 5：四步拆题法"
      eyebrow="JS Content / Module Systems"
      heroCards={heroCards}
      lead="这页把模块化相关的高频面试题统一整理到一个工程视角里：ESM、CommonJS、静态分析、live binding、tree shaking、循环依赖和运行环境差异。重点不是只会写 `import`，而是要解释清楚为什么它们在工程上差别很大。"
      overviewNote="用意：快速回顾这页覆盖的模块化问题。"
      overviewTitle="块 8：问题总览"
      pitfalls={pitfalls}
      pitfallsNote="用意：集中处理模块系统题里最容易说浅、说错的点。"
      pitfallsTitle="块 6：常见误区"
      questionGroups={[
        {
          title: '块 3：ESM 高频问题',
          note: '用意：先把静态导入、live binding 和 tree shaking 讲清楚。',
          label: 'ESM',
          questions: esmQuestions,
        },
        {
          title: '块 4：CommonJS 与互操作高频问题',
          note: '用意：再补上 CommonJS 的运行时语义和两套系统的工程差异。',
          label: 'CommonJS',
          questions: cjsQuestions,
        },
      ]}
      relationCode={relationCode}
      relationCodeTitle="Live Binding Example"
      relations={relations}
      relationsNote="用意：先从“静态 vs 运行时”这个核心视角看模块系统。"
      relationsTitle="块 2：核心关系速览"
      rules={rules}
      rulesNote="用意：面试复盘时快速过一遍最稳定的模块化判断规则。"
      rulesTitle="块 7：记忆规则"
      themeStyle={themeStyle}
      title="模块化：ESM 与 CommonJS"
    />
  );
}
