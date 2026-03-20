import type { CSSProperties } from 'react';
import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';

const themeStyle = {
  '--kp-hero-border': '#fcd34d',
  '--kp-hero-radial-1': 'rgba(245, 158, 11, 0.16)',
  '--kp-hero-radial-2': 'rgba(249, 115, 22, 0.12)',
  '--kp-hero-bg': '#fffaf0',
  '--kp-eyebrow-border': '#fcd34d',
  '--kp-eyebrow-bg': '#fffbeb',
  '--kp-eyebrow-text': '#b45309',
  '--kp-signal-border': '#fcd34d',
  '--kp-signal-bg': '#fffbeb',
  '--kp-signal-text': '#b45309',
  '--kp-answer-border': '#fde68a',
  '--kp-answer-bg': '#fffbeb',
  '--kp-explain-border': '#fed7aa',
  '--kp-explain-bg': '#fff7ed',
  '--kp-code-accent': '#fbbf24',
  '--kp-tag-border': '#fde68a',
  '--kp-tag-bg': '#fffbeb',
  '--kp-tag-text': '#b45309',
  '--kp-button-border': '#fcd34d',
  '--kp-button-text': '#b45309',
  '--kp-button-hover': '#fffbeb',
} as CSSProperties;

const heroCards = [
  {
    label: 'Questions',
    value: '8',
    detail: '覆盖防抖、节流、柯里化、偏函数、组合与工程里的常见变体。'
  },
  {
    label: 'Focus',
    value: 'Rate & Compose',
    detail: '一类是在控制调用频率，另一类是在改变函数组织方式和复用粒度。'
  },
  {
    label: 'Scenarios',
    value: '输入框 / 滚动 / 复用',
    detail: '高频输入、滚动监听、埋点、验证器和工具链里都很常见。'
  }
] as const;

const definitions = [
  {
    title: '防抖关注“等停下来再执行”',
    detail: '频繁触发时不断重置计时器，直到一段时间没有新触发才真正执行。'
  },
  {
    title: '节流关注“固定频率执行”',
    detail: '无论触发多频繁，都限制单位时间内最多执行一次。'
  },
  {
    title: '柯里化是把多参数函数拆成单参数链',
    detail: '它的重点不是炫技，而是让函数复用和参数复用更细粒度。'
  },
  {
    title: '偏函数是“先固定一部分参数”',
    detail: '它和柯里化相关，但不是同一件事。偏函数更强调预填部分参数。'
  },
  {
    title: '函数组合是把多个小函数串成一条数据管道',
    detail: '你可以从右往左 compose，也可以从左往右 pipe，本质都是组合小步骤。'
  },
  {
    title: '这些工具的本质是“控制复杂度”',
    detail: '要么控制调用节奏，要么控制函数组织方式，不要把它们只当面试花活。'
  }
] as const;

const relations = [
  {
    title: '防抖',
    detail: '高频触发下只保留最后一次有效执行。',
    signal: 'After Silence'
  },
  {
    title: '节流',
    detail: '高频触发下按固定时间窗口放行执行。',
    signal: 'At Fixed Rate'
  },
  {
    title: '柯里化',
    detail: '把函数拆成一层层接收参数的形式。',
    signal: 'Split Arguments'
  },
  {
    title: '组合',
    detail: '把多个小函数按顺序拼成一条处理链。',
    signal: 'Pipeline'
  }
] as const;

const relationCode = `const trim = (value) => value.trim()
const lower = (value) => value.toLowerCase()
const withPrefix = (value) => "user:" + value

const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input)
const normalizeUser = pipe(trim, lower, withPrefix)

console.log(normalizeUser("  Rocm  ")) // user:rocm`;

const timingQuestions = [
  {
    title: '问题 1：输入框搜索更适合防抖还是节流？',
    answer: '大多数搜索联想更适合防抖，因为你通常只关心用户暂时停下来后的那次最终输入。',
    explanation:
      '如果每个键入都请求一次接口，既浪费资源也容易让结果闪烁。防抖可以显著降低无效请求量。',
    code: `function debounce(fn, delay) {
  let timer = null

  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}`,
    codeTitle: 'Debounce Example'
  },
  {
    title: '问题 2：滚动监听和窗口 resize 更适合哪个？',
    answer: '滚动监听、resize、拖拽更新这类持续触发场景通常更适合节流。',
    explanation:
      '这类场景希望“持续有反馈，但别太频繁”。如果用防抖，用户操作过程中可能一直看不到更新。',
    code: `function throttle(fn, wait) {
  let lastTime = 0

  return function (...args) {
    const now = Date.now()

    if (now - lastTime >= wait) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}`,
    codeTitle: 'Throttle Example'
  },
  {
    title: '问题 3：防抖和节流面试题里最容易漏掉什么？',
    answer: '最容易漏掉的是 `this`、参数透传、取消能力，以及 leading / trailing 的边界行为。',
    explanation:
      '真正可用的工具函数不是只写一个 `setTimeout`，而是要考虑上下文、可取消和实际产品交互需求。',
    code: `const debouncedSave = debounce(saveDraft, 300)

input.addEventListener("input", debouncedSave)

// 页面卸载前或切换时可能需要:
// debouncedSave.cancel?.()`,
    codeTitle: 'Cancelable Example'
  },
  {
    title: '问题 4：什么时候节流不能只靠时间戳实现？',
    answer: '当你既想要首次快速响应，又想确保最后一次操作结束后也补一发时，单纯时间戳版就不够。',
    explanation:
      '这就是很多库会提供 leading / trailing 选项的原因。真实产品交互往往同时关心“别太慢”和“别漏最后一次”。',
    code: `// lodash.throttle(fn, wait, {
//   leading: true,
//   trailing: true,
// })`,
    codeTitle: 'Leading Trailing Example'
  }
] as const;

const composeQuestions = [
  {
    title: '问题 5：柯里化和偏函数到底有什么区别？',
    answer: '柯里化是把多参数函数系统地拆成多层单参数函数；偏函数是预先固定一部分参数，返回一个更具体的函数。',
    explanation:
      '它们经常一起出现，但关注点不同。柯里化偏抽象形式，偏函数偏实用落地。',
    code: `const add = (a, b, c) => a + b + c

const curryAdd = (a) => (b) => (c) => a + b + c
const add10 = (b, c) => add(10, b, c)

console.log(curryAdd(1)(2)(3))
console.log(add10(2, 3))`,
    codeTitle: 'Currying vs Partial Example'
  },
  {
    title: '问题 6：函数组合为什么在业务代码里有价值？',
    answer: '因为它鼓励你把逻辑拆成多个小而单一的步骤，再按顺序拼起来，复用性和可测试性都会更好。',
    explanation:
      '这在表单清洗、数据映射、接口适配、富文本转换等场景里特别实用。',
    code: `const compose = (...fns) => (input) =>
  fns.reduceRight((acc, fn) => fn(acc), input)

const toUpper = (value) => value.toUpperCase()
const exclaim = (value) => value + "!"

console.log(compose(exclaim, toUpper)("hello"))`,
    codeTitle: 'Compose Example'
  },
  {
    title: '问题 7：`compose` 和 `pipe` 区别怎么答？',
    answer: '`compose` 通常从右往左，`pipe` 通常从左往右。核心差别是阅读方向，不是能力高低。',
    explanation:
      '在多人协作里，很多团队更偏好 `pipe`，因为它更贴近数据流从上到下的阅读顺序。',
    code: `const compose = (...fns) => (input) =>
  fns.reduceRight((acc, fn) => fn(acc), input)

const pipe = (...fns) => (input) =>
  fns.reduce((acc, fn) => fn(acc), input)`,
    codeTitle: 'Compose vs Pipe Example'
  },
  {
    title: '问题 8：这些函数工具类题最后怎么从“会写”提升到“会用”？',
    answer: '要把答案落回场景：输入优化用防抖，滚动反馈用节流，参数复用用偏函数 / 柯里化，数据清洗链路用组合。',
    explanation:
      '只写出代码模板只是入门。真正好的回答是“为什么这个场景该用它，而不是另一个”。',
    code: `const normalize = pipe(trim, lower, removeEmoji, limitLength)
const onSearch = debounce(requestSearch, 250)
const onScroll = throttle(syncProgress, 100)`,
    codeTitle: 'Scenario Selection Example'
  }
] as const;

const diagnosticSteps = [
  {
    title: '第一步：先判断是在“控频”还是“组织函数”',
    detail: '防抖 / 节流解决调用节奏；柯里化 / 组合解决函数结构。'
  },
  {
    title: '第二步：控频时先问“保留最后一次”还是“持续反馈”',
    detail: '保留最终结果通常是防抖；持续反馈通常是节流。'
  },
  {
    title: '第三步：函数抽象时先问“参数复用”还是“步骤复用”',
    detail: '参数复用偏柯里化 / 偏函数；步骤复用偏组合。'
  },
  {
    title: '第四步：最后补边界能力',
    detail: '真实工具函数还要考虑 `this`、参数、取消、leading / trailing 等细节。'
  }
] as const;

const pitfalls = [
  {
    title: '高频误区 1：把防抖和节流只背成定义，不会结合场景',
    detail: '面试里真正拉开差距的是你能不能说清“为什么搜索建议用防抖、滚动监听用节流”。',
    points: ['保留最终输入 vs 持续反馈', '请求控制 vs UI 同步', '场景优先于模板']
  },
  {
    title: '高频误区 2：防抖 / 节流实现里忘了 `this` 和参数',
    detail: '这会让工具函数在真实项目里一用就坏。',
    points: ['记得透传参数', '记得保持调用上下文', '必要时提供 cancel']
  },
  {
    title: '高频误区 3：把柯里化和偏函数混为一谈',
    detail: '两者相关但不等价。不要只看“都返回函数”就认为是一回事。',
    points: ['柯里化强调形式', '偏函数强调预填参数', '实际场景经常一起用']
  },
  {
    title: '高频误区 4：组合题只会背 reduce 写法',
    detail: '真正的价值不在于 reduce 本身，而在于把步骤拆得足够单一、可复用、可测试。',
    points: ['先拆小函数', '再谈 compose / pipe', '让管道有真实语义']
  }
] as const;

const rules = [
  {
    title: '搜索联想优先想到防抖',
    detail: '因为通常只关心用户停下来的最终输入。'
  },
  {
    title: '滚动 / resize / 拖拽优先想到节流',
    detail: '因为这些场景更需要持续反馈，而不是最后才执行一次。'
  },
  {
    title: '参数复用优先想到偏函数或柯里化',
    detail: '它们能把业务常量、上下文或规则预先固定下来。'
  },
  {
    title: '多步数据清洗优先想到组合',
    detail: '这会让每一步更可测试、更容易重组。'
  }
] as const;

export default function FunctionalUtilsSummaryPage() {
  return (
    <KnowledgeSummaryPage
      definitions={definitions}
      definitionsNote="用意：先把控频工具和函数抽象工具拆开。"
      definitionsTitle="块 1：基础定义（先分清两类工具）"
      diagnosticNote="用意：题目拿到手后，先确定自己在解决什么问题。"
      diagnosticSteps={diagnosticSteps}
      diagnosticTitle="块 5：四步拆题法"
      eyebrow="JS Content / Functional Utils"
      heroCards={heroCards}
      lead="这页把前端里最常见的函数工具题放在一起整理：防抖、节流、柯里化、偏函数、函数组合。重点不是只背模板，而是要会把它们落到真实交互和真实代码组织问题上。"
      overviewNote="用意：快速回顾这页覆盖的函数工具问题。"
      overviewTitle="块 8：问题总览"
      pitfalls={pitfalls}
      pitfallsNote="用意：集中处理函数工具题里最容易空谈和误用的点。"
      pitfallsTitle="块 6：常见误区"
      questionGroups={[
        {
          title: '块 3：防抖与节流高频问题',
          note: '用意：先把控频相关题目讲清楚。',
          label: 'Rate Control',
          questions: timingQuestions,
        },
        {
          title: '块 4：柯里化与函数组合高频问题',
          note: '用意：再把函数组织方式相关题目串起来理解。',
          label: 'Function Shape',
          questions: composeQuestions,
        },
      ]}
      relationCode={relationCode}
      relationCodeTitle="Utility Pipeline"
      relations={relations}
      relationsNote="用意：先用一个关系图把四类工具放进同一视角。"
      relationsTitle="块 2：核心关系速览"
      rules={rules}
      rulesNote="用意：复盘时快速过一遍最稳定的使用判断。"
      rulesTitle="块 7：记忆规则"
      themeStyle={themeStyle}
      title="函数工具总结页"
    />
  );
}
