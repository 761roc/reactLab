import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '状态存放', value: 'Fiber.memoizedState 挂出的 Hook 链表' },
  { label: '更新保存', value: 'queue.pending 中的 update 环形队列' },
  { label: '触发方式', value: 'dispatchSetState 入队并调度 Fiber' },
  { label: '高频追问', value: 'Hook 顺序、批量更新、函数式更新' },
];

const sections: EditorialSection[] = [
  {
    title: '1. useState 不是存在函数局部变量里，而是存在组件对应的 Fiber 上',
    paragraphs: [
      '函数组件每次渲染都会重新执行，所以如果 state 只是普通局部变量，下一次执行时它就丢了。React 为了解决“函数会重跑但状态要保留”的矛盾，把每个组件实例抽象成一个 Fiber 节点，并把这个组件里声明的 Hooks 挂在 Fiber 上。',
      '更具体一点，Fiber 的 `memoizedState` 会指向一串 Hook 节点。组件第一次执行时，遇到第一个 `useState` 就创建第一个 Hook，遇到第二个 `useState` 就接到后面。后续重新渲染时，React 仍然按调用顺序把这些 Hook 节点取回来，所以 Hook 的顺序必须稳定。',
      '这也是为什么官方一直强调不要把 Hook 写进条件、循环和嵌套函数里。因为 React 不是按变量名找 Hook，而是按“第几个 Hook”去取。如果顺序变了，原来属于 `count` 的状态，下一次可能就被拿去当作另一个 Hook 的状态使用。',
    ],
    bullets: [
      '函数会重跑，但 Fiber 是组件实例级容器。',
      '多个 Hook 靠调用顺序一一对应，不靠名字。',
      'Hook 规则本质上是为这套定位机制服务。',
    ],
    codeTitle: '简化后的 Hook 结构',
    code: `type Hook = {
  memoizedState: unknown;
  baseState: unknown;
  queue: UpdateQueue | null;
  next: Hook | null;
};`,
  },
  {
    title: '2. 首次渲染时，React 会在 mountState 阶段创建 Hook 节点和更新队列',
    paragraphs: [
      '可以把 `useState(initialState)` 的第一次调用理解成“初始化登记”。React 会创建一个 Hook 节点，把初始值放进 `memoizedState`，同时为这个 Hook 创建一个更新队列 `queue`，以后所有 `setState` 产生的更新都会进入这个队列。',
      '如果你传的是懒初始化函数，比如 `useState(() => expensiveInit())`，这个函数只会在首次 mount 时执行，用来得到初始状态。之后重新渲染不会再次执行这段初始化逻辑。',
      '接着 React 会生成一个 `dispatch` 函数返回给你，这个函数就是我们日常写的 `setCount`。因此 `setCount` 不是语法魔法，它本质上是一个闭包，内部记住了“当前 Fiber 是谁、当前 Hook 队列是谁”。',
    ],
    bullets: [
      '初始值真正生效只发生在首次 mount。',
      '懒初始化适合昂贵初始计算。',
      'setState 本质是绑定了 Fiber 和 queue 的 dispatch。',
    ],
    codeTitle: '极简版 mountState 流程',
    code: `function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState =
    typeof initialState === "function" ? initialState() : initialState;

  hook.queue = { pending: null };
  const dispatch = (action) => dispatchSetState(currentFiber, hook.queue, action);

  return [hook.memoizedState, dispatch];
}`,
  },
  {
    title: '3. 调用 setState 时，并不会立刻同步改值，而是生成 update 入队',
    paragraphs: [
      '很多人会把它粗略说成“异步更新”，但更准确的说法是：调用 `setState` 时，React 会先创建一个 update 对象，把你本次传入的 action 记录下来，然后把这个 update 挂到 Hook 队列里。',
      '这个 action 可能是普通值，例如 `setCount(3)`；也可能是函数，例如 `setCount((prev) => prev + 1)`。无论哪一种，当前这一步都不是直接改写变量，而是把“我要怎样更新状态”登记进队列。',
      '随后 React 会基于当前调度策略给 Fiber 打上更新标记，并安排一次后续渲染。也正因为更新先被记录、再被统一处理，所以 React 才能做批量更新、优先级控制和中断恢复。',
    ],
    bullets: [
      'setState 更像提交一份更新申请，不是直接写变量。',
      'action 可以是值，也可以是函数。',
      '入队和调度分离，是 React 状态系统可扩展的基础。',
    ],
    codeTitle: 'dispatchSetState 的核心动作',
    code: `function dispatchSetState(fiber, queue, action) {
  const update = { action, next: null };
  queue.pending = appendUpdate(queue.pending, update);
  scheduleUpdateOnFiber(fiber);
}`,
  },
  {
    title: '4. 组件下一次渲染时，React 会消费 update 队列，计算出最新 state',
    paragraphs: [
      '进入下一轮渲染时，React 会来到 `updateState` 阶段。它先拿到这个 Hook 上一次的基础状态，再把队列中的 update 按顺序遍历一遍，依次折叠成最终的新状态。',
      '如果 update.action 是普通值，就可以理解为直接替换；如果是函数，就把上一步得到的 state 传进去计算出下一步结果。这里的关键在于“顺序计算”，因为多个 update 不是互相覆盖，而是像 reducer 一样逐个累加结果。',
      '所以当你连续写三次 `setCount((c) => c + 1)` 时，React 会从旧值出发，先执行第一次加一，再把结果传给第二次，再传给第三次，最后得到正确的最终值。函数式更新之所以可靠，就是因为这个结算模型。',
    ],
    bullets: [
      '普通值更新更像替换。',
      '函数式更新更像基于前值推导下一值。',
      '多个 update 会被折叠，不是简单覆盖。',
    ],
    codeTitle: '队列结算示意',
    code: `let newState = hook.baseState;
let update = firstUpdate;

while (update) {
  const action = update.action;
  newState = typeof action === "function" ? action(newState) : action;
  update = update.next;
}

hook.memoizedState = newState;`,
  },
  {
    title: '5. 为什么函数式更新、批量更新和 Hook 规则都能从这套模型里推出',
    paragraphs: [
      '函数式更新之所以能解决“闭包拿到旧值”的问题，是因为 React 真正保存的是 update 队列，不是你事件回调里那一瞬间的局部变量。等到重新渲染时，它会按照队列顺序把新旧状态衔接起来，因此 `prev => prev + 1` 天然适合多次连续更新。',
      '批量更新也是同理。多个 `setState` 可以先都进入队列，再由 React 在后续渲染里统一处理，而不是每次都立刻做整棵树的同步刷新。',
      '最后，Hook 规则其实也不是语法洁癖，而是机制要求。因为 React 只能按顺序从 Hook 链表上拿状态，所以调用顺序必须稳定。你如果把 Hook 放进条件分支，实际上是在破坏 React 的索引方式。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答得像“懂底层”，而不是背定义',
    paragraphs: [
      '最稳的答法是先来一句总述，然后按四步讲：状态挂在 Fiber 的 Hook 链表上；首次渲染时创建 Hook 和 queue；调用 setState 时生成 update 入队并调度；下一轮渲染时消费队列得到新状态。',
      '如果时间足够，再主动补两个延伸点：一是为什么 Hook 不能条件调用；二是为什么函数式更新更适合依赖前值的场景。这样就能把实现原理和使用建议串起来，面试官会觉得你不是在死背。',
      '你不需要背 React 内部所有字段名，但主线一定要清晰。具体字段命名和调度细节会随版本迭代，核心思想却相对稳定。',
    ],
  },
];

export default function ZhongkeyunshengUseStatePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 01"
      title="react 中 useState 实现原理"
      strapline="Fiber、Hook 链表、更新队列与调度，是回答这题最稳的四个关键词。"
      abstract="这道题不能只停留在“它会触发重新渲染”。真正得分点在于讲清 state 存在哪里、setState 之后记录了什么、React 何时计算新状态，以及为什么函数式更新能拿到最新值。"
      leadTitle="React Hooks 底层状态是怎样被记住和结算的"
      lead="表面上这是一个 Hook API 题，底层上它考的是 React 如何在“函数每次都会重新执行”的前提下，把状态跨渲染保存下来。你只要讲清 Fiber、Hook 链表、update 队列和渲染时结算这条主线，答案就会比较完整。"
      answerOutline={[
        '先讲状态不在函数体里，而在 Fiber 的 Hook 链表上',
        '再讲 mountState 如何创建 Hook、queue 和 dispatch',
        '然后讲 setState 如何生成 update 并调度渲染',
        '最后讲 updateState 如何消费队列，推出函数式更新与 Hook 规则',
      ]}
      quickAnswer="一句话答法：useState 本质上是 React 在当前函数组件对应的 Fiber 上，按照 Hook 调用顺序维护 Hook 节点；每个 Hook 节点保存当前状态和更新队列。调用 setState 时，不会立刻同步改变量，而是把 update 放入队列并调度组件重新渲染；下一轮渲染时 React 再顺着 Hook 链表取到对应节点，按队列依次计算出新的 state。"
      pullQuote="真正该记住的不是“setState 会更新”，而是“更新先入队，渲染时再统一结算”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先给一句总述，再讲存储位置、初始化、入队调度、渲染结算四步链路。',
        '被追问“为什么 Hook 不能写在条件里”时，直接回到“按调用顺序定位 Hook 节点”。',
        '被追问“为什么函数式更新更稳”时，强调队列按顺序消费，而不是立即读取旧变量。',
      ]}
      mistakes={[
        '只回答“会触发重新渲染”，没有讲到 Fiber、Hook 链表和 queue。',
        '把“异步更新”理解成定时器式异步，而不是 React 自己的调度与结算模型。',
        '说不清为什么连续多次 setState 时，函数式更新比直接读旧值更可靠。',
      ]}
      singleColumn
    />
  );
}
