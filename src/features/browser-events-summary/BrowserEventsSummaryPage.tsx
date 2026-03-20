import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { browserPrinciplesTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '捕获、冒泡、阻止传播、委托和 React 里常见的理解误区。' },
  { label: 'Focus', value: 'Who Gets Event First', detail: '核心就是事件从哪来、往哪走、谁先拿到。' },
  { label: 'Scenarios', value: '列表点击 / 弹层 / 表单', detail: '动态列表、统一监听、弹层关闭逻辑，都离不开这块。' },
] as const;

const definitions = [
  { title: '事件传播不是“只在当前元素上触发”', detail: '很多浏览器事件会沿着 DOM 结构走一遍，不只是点哪就停哪。' },
  { title: '捕获阶段是从外往里', detail: '事件先从 window / document 往目标元素方向走。' },
  { title: '冒泡阶段是从里往外', detail: '事件在目标元素处理完后，通常会再沿祖先节点一路往外冒。' },
  { title: '事件委托就是把监听挂到更高层', detail: '它常用于动态列表和批量子元素交互，不用给每个节点单独绑监听。' },
  { title: '`stopPropagation` 是阻止继续往外或往下传', detail: '它不是取消默认行为，默认行为通常要靠 `preventDefault`。' },
  { title: '很多题最后都在考“事件走到哪一步了”', detail: '只要脑子里有一条传播路线，很多细节题就不容易乱。' },
] as const;

const relations = [
  { title: '捕获', detail: '从外层祖先往目标元素方向走。', signal: 'Top To Target' },
  { title: '目标阶段', detail: '事件真正到达被触发的那个元素。', signal: 'At Target' },
  { title: '冒泡', detail: '从目标元素再一路往外层祖先走。', signal: 'Target To Top' },
  { title: '委托', detail: '不在每个子节点绑，而是在父节点统一处理。', signal: 'One Listener For Many' },
] as const;

const relationCode = `outer.addEventListener("click", () => console.log("outer capture"), true)
inner.addEventListener("click", () => console.log("inner bubble"))

// 点击 inner 时
// 先 capture
// 再 target
// 再 bubble`;

const baseQuestions = [
  { title: '问题 1：捕获和冒泡最通俗怎么讲？', answer: '捕获像“先从外层一路传进来”，冒泡像“再从目标一路冒出去”。', explanation: '这个方向一旦记住，事件传播题就不容易反。', code: `capture: document -> div -> button
bubble: button -> div -> document`, codeTitle: 'Capture vs Bubble' },
  { title: '问题 2：为什么很多事件监听默认是在冒泡阶段？', answer: '因为大多数业务场景更关心目标元素已经确定之后再往外层统一处理，冒泡更自然。', explanation: '这也是为什么事件委托通常直接用默认阶段就够用了。', code: `element.addEventListener("click", handler) // 默认不是 capture`, codeTitle: 'Default Listener Phase' },
  { title: '问题 3：`stopPropagation` 和 `preventDefault` 有什么区别？', answer: '一个是阻止继续传播，一个是阻止默认行为。它们解决的不是同一件事。', explanation: '这是事件题里最常见的送分坑。', code: `event.stopPropagation()
event.preventDefault()`, codeTitle: 'Propagation vs Default' },
  { title: '问题 4：事件委托为什么适合动态列表？', answer: '因为新增子节点不需要重新绑监听，父节点那一个监听就能统一兜住。', explanation: '这既省监听器数量，也更适合节点动态增删。', code: `list.addEventListener("click", (event) => {
  const item = event.target.closest("[data-id]")
})`, codeTitle: 'Event Delegation Example' },
] as const;

const practicalQuestions = [
  { title: '问题 5：为什么有些事件不适合简单地靠冒泡委托？', answer: '因为不是所有事件都会正常冒泡，或者事件目标层级不稳定，业务上也可能需要更细控制。', explanation: '面试里不要求背全表，但要知道“不是所有事件都一把梭委托”。', code: `focus / blur 的传播行为就经常被单独拿出来讨论`, codeTitle: 'Delegation Boundary' },
  { title: '问题 6：点击弹层内部却把弹层关掉，通常是哪类问题？', answer: '通常是外层关闭监听也收到了同一次点击事件，传播没被正确处理。', explanation: '这类弹层 bug 很常见，理解事件传播后很快就能定位。', code: `modal.addEventListener("click", (event) => {
  event.stopPropagation()
})`, codeTitle: 'Modal Click Example' },
  { title: '问题 7：React 里的事件和原生事件答题时要怎么区分？', answer: 'React 常通过合成事件做统一封装，但很多传播概念依旧能对应回浏览器原生事件模型。', explanation: '这里不用展开太细，重点是不要把两者完全当成两套无关东西。', code: `onClick 仍然常常要理解冒泡与阻止传播`, codeTitle: 'React Event Hint' },
  { title: '问题 8：事件题怎么答得更像实战？', answer: '最好顺手带上“我会怎么排查”，比如看目标元素、看 currentTarget、看事件是否继续传播。', explanation: '这样回答就不只是定义题，而是可以落到调试。', code: `console.log(event.target)
console.log(event.currentTarget)`, codeTitle: 'Debug Event Path' },
] as const;

const diagnosticSteps = [
  { title: '第一步：先找真正被点中的目标元素', detail: '也就是 `event.target` 指向谁。' },
  { title: '第二步：再看当前处理函数挂在哪', detail: '也就是 `currentTarget` 是谁。' },
  { title: '第三步：判断事件现在是在捕获还是冒泡阶段', detail: '方向一旦搞清，很多行为就很好解释。' },
  { title: '第四步：最后再看有没有阻止传播或默认行为', detail: '这一步常常就是 bug 的关键开关。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 `stopPropagation` 和 `preventDefault` 混掉', detail: '一个管传播，一个管默认行为，不是一回事。', points: ['传播 != 默认行为', '别背混', '面试高频坑'] },
  { title: '高频误区 2：以为所有事件都适合事件委托', detail: '委托很好用，但也要看事件本身的传播特性和业务复杂度。', points: ['不是所有事件都冒泡得理想', '目标层级可能复杂', '要按场景看'] },
  { title: '高频误区 3：只会说冒泡，不会说目标和捕获', detail: '完整传播模型三段都要知道。', points: ['capture', 'target', 'bubble'] },
  { title: '高频误区 4：排查弹层点击问题时只盯当前元素', detail: '这类问题往往要沿着整条传播路径看。', points: ['看 target', '看 currentTarget', '看外层监听'] },
] as const;

const rules = [
  { title: '事件题先问“从哪来、往哪走”', detail: '这比死背定义更稳。' },
  { title: '动态列表优先想到事件委托', detail: '尤其是节点会频繁增删时。' },
  { title: '关闭弹层类问题优先检查传播链', detail: '很多都是外层监听误收到了点击。' },
  { title: '传播和默认行为分开答', detail: '这是事件题里最基本的清晰度。' },
] as const;

export default function BrowserEventsSummaryPage() {
  return <KnowledgeSummaryPage eyebrow="Browser Principles / Events" title="事件传播：捕获、冒泡、委托" lead="这页把事件传播讲得更顺一点：事件怎么从外层走到目标，再怎么往外冒；为什么事件委托这么常见；又为什么弹层、列表点击、表单交互里总是能碰到它。" heroCards={heroCards} definitionsTitle="块 1：基础定义（先把传播路线记住）" definitionsNote="用意：先有一条事件传播主线。 " definitions={definitions} relationsTitle="块 2：传播路线速览" relationsNote="用意：先把捕获、目标、冒泡和委托放到同一张图里。 " relations={relations} relationCodeTitle="Event Flow Example" relationCode={relationCode} questionGroups={[{ title: '块 3：传播机制高频问题', note: '用意：先把捕获、冒泡和阻止传播讲清。', label: 'Propagation', questions: baseQuestions }, { title: '块 4：实战场景高频问题', note: '用意：再把委托、弹层和调试思路连到真实场景。', label: 'Practical Events', questions: practicalQuestions }]} diagnosticTitle="块 5：四步拆题法" diagnosticNote="用意：事件 bug 和面试题都能按这条顺序拆。 " diagnosticSteps={diagnosticSteps} pitfallsTitle="块 6：常见误区" pitfallsNote="用意：把事件题里最容易说混的几个点拎出来。 " pitfalls={pitfalls} rulesTitle="块 7：记忆规则" rulesNote="用意：复盘时快速回忆最稳的事件传播答法。 " rules={rules} overviewTitle="块 8：问题总览" overviewNote="用意：快速回顾这页覆盖的问题。 " themeStyle={browserPrinciplesTheme} />;
}
