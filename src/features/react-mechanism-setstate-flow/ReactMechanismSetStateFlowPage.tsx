import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '主线', value: '入队更新 -> 调度 -> render -> commit' },
  { label: '关键对象', value: 'Fiber、Update Queue、Scheduler、Lanes' },
  { label: '重要边界', value: 'render 可计算，commit 真正改 DOM' },
  { label: '常见追问', value: '批量更新、优先级、同步与异步' },
];

const sections: EditorialSection[] = [
  {
    title: '1. setState 不是立刻改 DOM，而是先把更新登记进 Fiber 体系',
    paragraphs: [
      '很多人会把 `setState` 理解成“调用后页面马上变”。这只是表面现象。从实现上看，React 首先做的不是立刻操作 DOM，而是创建一条 update，挂到当前组件对应 Fiber 的更新队列里。',
      '也就是说，`setState` 更像提交了一次更新请求。这个请求里记录了这次状态变更的 action、优先级以及它应该归属到哪个 Fiber。只有先把更新登记进统一的数据结构，React 才能在后续调度、批量合并和优先级控制中有依据可依。',
      '如果面试里先把“入队更新”讲出来，而不是直接说“重新渲染”，回答会更像真正理解了机制。',
    ],
    codeTitle: '心智模型',
    code: `setState(action)
-> create update
-> enqueue on Fiber
-> schedule work`,
  },
  {
    title: '2. 更新入队后，React 会根据优先级把工作交给调度系统',
    paragraphs: [
      'React 不会对所有更新一视同仁。用户输入、点击反馈这类更新通常更紧急，而大列表刷新、低优先级视图更新则可以稍后处理。为了实现这种差异化，React 会把更新分配到不同 lanes，并交给调度系统去决定什么时候处理。',
      '这一步是 React18 并发能力的重要基础，但在更一般的 setState 流程题里，你只要说明：更新入队后不会直接整棵树同步刷新，而是要经过调度和优先级判断，就已经很到位。',
      '因此 setState 之后的第二步，不是渲染本身，而是 schedule update。',
    ],
  },
  {
    title: '3. render 阶段会重新计算下一棵工作树，但此时还没有真正改页面',
    paragraphs: [
      '调度到当前更新后，React 会进入 render 阶段。这个阶段的核心工作是：从根或某个更新边界开始，重新执行相关组件，读取新 state，调用 render / 函数组件，计算出下一棵 work-in-progress Fiber tree。',
      '在这个过程中，React 会做 diff，对比新旧 Fiber，找出哪些节点需要新增、更新、删除，以及哪些 effect 需要执行。这里的重要点是：render 阶段主要是在“算要变什么”，而不是“已经把它改掉了”。',
      '所以如果你在题目里把 render 和 commit 分开讲，通常会明显优于只会说“重新渲染”。',
    ],
    bullets: [
      '读取新状态与新 props。',
      '执行组件函数或 render。',
      'diff 新旧树，生成副作用列表。',
    ],
  },
  {
    title: '4. commit 阶段才是真正把结果提交到 DOM 和生命周期里',
    paragraphs: [
      '当 render 阶段算完之后，React 才会进入 commit。这个阶段会把 Fiber 上积累的变更真正提交到宿主环境，也就是浏览器 DOM。比如插入节点、删除节点、修改属性、绑定 ref、执行 layout effect 等。',
      '这也是为什么 React 会把 render 和 commit 明确分开。render 可以多算几次、可以被中断；但 commit 一旦开始，就必须保持同步和一致，避免用户看到半更新状态。',
      '所以一句很稳的总结是：render 负责计算，commit 负责落地。',
    ],
  },
  {
    title: '5. 页面更新后，还会进入 effect 阶段，尤其是被动副作用的执行',
    paragraphs: [
      '很多回答会在 DOM 改完就停住，但其实还有后续阶段。尤其在函数组件里，`useEffect` 这类被动副作用会在浏览器完成绘制后再执行；而 `useLayoutEffect` 会更早一点，在 commit 后、绘制前执行。',
      '因此从完整生命周期来看，一次 setState 不只是“改状态 -> 改 DOM”，而是“入队 -> 调度 -> render -> commit -> effect”。',
      '如果你在面试里把 effect 补进去，会显得你对 React 更新流程的理解更完整。',
    ],
  },
  {
    title: '6. 这条主线还能顺手解释批量更新、优先级和函数式更新',
    paragraphs: [
      '批量更新之所以成立，是因为多个 update 可以先进入队列，再被 React 一起处理；优先级之所以成立，是因为调度系统会按 lanes 决定先处理什么；函数式更新之所以可靠，是因为 React 会在处理队列时按顺序把前一个结果传给下一个 update。',
      '也就是说，很多看似分散的 React 面试题，其实都可以归回这一条主线。你把 setState 的生命周期讲清，很多追问都能自然接住。',
      '这也是为什么这道题是 React 机制题里的底座问题。',
    ],
  },
];

export default function ReactMechanismSetStateFlowPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="React Mechanism"
      company="React 机制类"
      issue="Issue 01"
      title="React 中一次 setState 到页面更新，中间经历了哪些阶段"
      strapline="更新不是直接改 DOM，而是先入队、再调度、再计算、最后提交。"
      abstract="这道题真正想听的不是“会重新渲染”，而是你是否知道 React 如何把一次状态更新纳入 Fiber、调度、render 和 commit 的完整流程里。"
      leadTitle="把 setState 还原成一条可追踪的更新链路"
      lead="如果要把这道题答得像真正理解 React 内部机制，最稳的主线就是：更新先进入队列，调度系统决定何时处理，render 阶段计算下一棵树，commit 阶段真正改 DOM，最后再执行 effect。"
      answerOutline={[
        '先讲 setState 会创建 update 并入队',
        '再讲 Scheduler 与优先级如何决定执行时机',
        '然后区分 render 计算和 commit 提交',
        '最后补 effect 与批量更新等追问',
      ]}
      quickAnswer="一句话答法：React 中一次 `setState` 到页面更新，通常会经历 update 入队、调度、render 计算、commit 提交和 effect 执行几个阶段。`setState` 本身不会立刻操作 DOM，而是先把更新挂到 Fiber 的队列里，再由 React 根据优先级调度处理；render 阶段计算新的 Fiber 树和变更，commit 阶段才真正把结果提交到 DOM。"
      pullQuote="一次 setState 的本质，不是“马上更新页面”，而是“把更新纳入 React 的统一调度与提交流程”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '一定把 render 和 commit 分开讲，这会比“重新渲染”三个字强很多。',
        '如果被追问批量更新和优先级，可以直接回到 update queue 和调度系统。',
        '最后补一句 effect 执行时机，会让答案更完整。',
      ]}
      mistakes={[
        '只回答“setState 会重新渲染”，没有讲入队和调度。',
        '把 render 阶段和 commit 阶段混为一谈。',
        '忽略 effect 和批量更新这些顺手能解释的延伸点。',
      ]}
      singleColumn
    />
  );
}
