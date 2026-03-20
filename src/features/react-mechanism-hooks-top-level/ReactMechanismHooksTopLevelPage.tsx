import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '根因', value: 'React 依赖 Hook 调用顺序来定位 Hook 节点' },
  { label: '底层结构', value: 'Fiber.memoizedState 上的 Hook 链表' },
  { label: '规则目的', value: '保证每次渲染 Hook 顺序稳定不偏移' },
  { label: '高频追问', value: '为什么条件调用会错位' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 规则不是语法洁癖，而是 React 的 Hook 定位方式决定的',
    paragraphs: [
      '很多人会把“Hooks 只能在顶层调用”记成一条风格规范，但这其实不是书写偏好，而是 React 内部实现的硬要求。React 在函数组件里并不会通过变量名来识别某个 Hook 对应哪块状态，而是依赖调用顺序。',
      '也就是说，第一个 Hook 对应 Fiber 链表上的第一个节点，第二个 Hook 对应第二个节点。每次渲染时，React 都按同样顺序往下取。如果顺序变化，状态就会错位。',
      '所以这条规则的根因，是 React 的 Hook 状态定位模型，而不是团队代码规范。',
    ],
  },
  {
    title: '2. Hook 状态实际上挂在 Fiber 上，并按调用顺序形成链表',
    paragraphs: [
      '函数组件每次执行都会重新走一遍函数体，但组件状态不能因此丢失。React 的做法是把组件实例对应到一个 Fiber 节点，并在 Fiber 的 `memoizedState` 上挂一串 Hook 节点。',
      '第一次渲染时，遇到第一个 `useState` 就创建第一个 Hook，遇到第二个 `useEffect` 就创建第二个 Hook，依次串起来。后续更新渲染时，再按同样顺序依次取出这些 Hook。',
      '这个“按顺序对位”的机制非常高效，但代价就是顺序必须稳定。',
    ],
    codeTitle: 'Hook 对位心智模型',
    code: `render #1
1 useState -> Hook1
2 useEffect -> Hook2
3 useMemo -> Hook3

render #2
1 useState -> Hook1
2 useEffect -> Hook2
3 useMemo -> Hook3`,
  },
  {
    title: '3. 条件、循环和嵌套函数会破坏这种稳定顺序',
    paragraphs: [
      '如果你在条件里调用 Hook，例如某次渲染条件成立、调用了一个 `useEffect`，下一次条件不成立、跳过这个 Hook，那么后面所有 Hook 的索引都会整体前移。',
      '这意味着 React 原本认为“第二个 Hook”的状态，下一次可能会被当成“第一个 Hook”的状态来读，结果就是状态错位、effect 错位甚至出现非常诡异的 bug。',
      '所以“不要在条件和循环中调用 Hook”不是因为那样不好看，而是因为那样会破坏 React 的状态匹配表。',
    ],
    bullets: [
      '条件调用会让某些 Hook 本轮存在、下轮消失。',
      '循环调用会让 Hook 数量随数据变化而变化。',
      '嵌套函数调用则会让执行时机和顺序不可预测。',
    ],
  },
  {
    title: '4. 为什么可以在 Hook 内部写条件，而不能条件调用 Hook 本身',
    paragraphs: [
      '这是一个非常经典的追问。答案是：React 只要求 Hook 的调用顺序稳定，并不要求 Hook 内部逻辑毫无条件分支。换句话说，`useEffect(() => { if (...) { ... } }, [])` 是可以的，因为 `useEffect` 本身仍然在固定位置被调用。',
      '真正危险的是“这个 Hook 调不调用”发生变化，而不是 Hook 内部做了条件判断。',
      '这个区分如果能讲清楚，说明你对规则的理解已经不是背诵层面，而是机制层面。',
    ],
  },
  {
    title: '5. React ESLint 插件本质上是在帮你守住这条运行时前提',
    paragraphs: [
      '官方的 Hook rules lint 规则看起来像静态规范检查，但本质上是在开发阶段提前阻止会破坏 Hook 顺序的代码进入运行时。',
      '因为一旦到了运行时，错位问题通常很难定位，表现也未必稳定。提前在 lint 阶段拦住，是成本最低的方式。',
      '所以你也可以把 ESLint 规则理解成“为 React 运行时模型服务的静态防线”。',
    ],
  },
  {
    title: '6. 面试里怎样把这道题答完整',
    paragraphs: [
      '最稳的答法是：先说 Hook 状态挂在 Fiber 上，并按调用顺序一一对应；然后说 React 每次渲染都依赖这个顺序去定位 Hook；接着解释为什么条件、循环、嵌套函数会破坏顺序；最后补充“可以在 Hook 内部写条件，但不能条件调用 Hook 本身”。',
      '一句话收尾很好用：Hooks 只能在顶层调用，不是因为语法规定，而是因为 React 依赖稳定调用顺序来把每次渲染和同一组 Hook 状态对应起来。',
    ],
  },
];

export default function ReactMechanismHooksTopLevelPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="React Mechanism"
      company="React 机制类"
      issue="Issue 02"
      title="React 为什么要求 Hooks 只能在顶层调用"
      strapline="这条规则的根因，是 React 用调用顺序而不是名字来定位 Hook。"
      abstract="这道题真正考的是你是否知道 Hook 状态是如何挂在 Fiber 上并按顺序匹配的，而不是只会背诵“不要在条件里调用 Hook”。"
      leadTitle="把 Hook 规则还原成 Fiber 上的顺序匹配问题"
      lead="如果你能把 Hook 链表、调用顺序和状态错位三者讲清楚，这道题基本就答稳了。重点是说明：React 不是用变量名识别 Hook，而是用每次渲染时的调用顺序对位。"
      answerOutline={[
        '先讲 Hook 状态挂在 Fiber 上的链表结构',
        '再讲 React 如何依赖调用顺序定位 Hook',
        '然后解释条件/循环/嵌套为什么会破坏顺序',
        '最后补 Hook 内部可以写条件这一边界',
      ]}
      quickAnswer="一句话答法：React 要求 Hooks 只能在顶层调用，是因为 React 在函数组件里通过 Hook 的调用顺序来定位每一个 Hook 对应的状态节点。Hook 状态挂在 Fiber 的链表上，每次渲染都要按同样顺序依次取出；一旦在条件、循环或嵌套函数里调用 Hook，顺序就可能变化，导致状态和副作用错位。"
      pullQuote="Hooks 规则的本质，不是代码风格，而是状态定位机制。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '回答时一定提到 Fiber 和 Hook 链表，不要停留在“官方规定”。',
        '如果被追问边界，补一句“Hook 内部可以写条件，但 Hook 本身调用顺序不能变”。',
        '把“状态错位”这个后果讲出来，会很有说服力。',
      ]}
      mistakes={[
        '只会复述规则，不会解释底层原因。',
        '分不清“条件调用 Hook”与“Hook 内部条件判断”的区别。',
        '没有讲到顺序变化会导致状态错位。',
      ]}
      singleColumn
    />
  );
}
