import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心区别', value: '执行时机不同：一个偏绘制后，一个偏绘制前' },
  { label: '共同点', value: '都属于 commit 后的副作用机制' },
  { label: '使用边界', value: '读写布局、避免闪动时才考虑 layout effect' },
  { label: '高频误区', value: '把 useLayoutEffect 当成更高级的 useEffect' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 先讲结论：区别核心在执行时机，而不是功能类别',
    paragraphs: [
      '`useEffect` 和 `useLayoutEffect` 都是 React 提供的副作用 Hook，本质上都让你在组件提交之后执行额外逻辑。真正的核心差异，是它们执行的时机不同。',
      '`useLayoutEffect` 会在 DOM 提交之后、浏览器绘制之前同步执行；而 `useEffect` 更偏向在浏览器完成绘制之后再异步执行。因此两者都能做副作用，但适合的问题边界并不一样。',
      '如果面试一开始就把“时机”说出来，而不是泛泛说“一个更早一个更晚”，会更清楚。',
    ],
  },
  {
    title: '2. useEffect 更适合非阻塞型副作用：请求、订阅、日志、计时器',
    paragraphs: [
      '`useEffect` 最大的优点是不会阻塞浏览器这次绘制。页面可以先显示出来，effect 再去做数据请求、事件订阅、埋点上报、定时器注册等工作。',
      '所以大多数副作用默认都应优先考虑 `useEffect`，因为它对页面首帧渲染干扰更小，也更符合“让 UI 先出来”的原则。',
      '从实践角度看，如果你的逻辑不依赖同步读取布局、也不要求在绘制前改 DOM，那么通常没有必要上 `useLayoutEffect`。',
    ],
  },
  {
    title: '3. useLayoutEffect 主要用于布局读写和避免闪动场景',
    paragraphs: [
      '如果你需要在浏览器绘制前同步读取 DOM 尺寸、滚动位置，或者在首帧绘制前做一次必须的 DOM 调整，`useLayoutEffect` 才会更合适。因为它能保证“用户看见页面之前，布局相关改动已经完成”。',
      '典型场景包括：测量元素宽高后立即定位弹层、恢复滚动位置、根据真实尺寸调整样式、避免界面先闪一下再跳到正确位置。',
      '因此你可以把 `useLayoutEffect` 理解成“和布局一致性强相关的同步副作用入口”，而不是一般副作用的默认选择。',
    ],
    codeTitle: '布局测量场景',
    code: `useLayoutEffect(() => {
  const rect = panelRef.current?.getBoundingClientRect();
  if (rect) {
    setPanelHeight(rect.height);
  }
}, []);`,
  },
  {
    title: '4. 为什么不应该滥用 useLayoutEffect',
    paragraphs: [
      '`useLayoutEffect` 会在绘制前同步执行，如果里面逻辑很重，就会直接阻塞这次渲染结果出现在屏幕上。这意味着它更容易拖慢首屏体验或造成卡顿。',
      '因此它不是“更强版本的 useEffect”，而是一个成本更高、但在特定场景下必须使用的工具。',
      '面试里如果能主动补一句“默认用 useEffect，只有涉及布局同步读写和首帧视觉一致性时才考虑 useLayoutEffect”，通常就很完整了。',
    ],
  },
  {
    title: '5. SSR 环境下还要注意 useLayoutEffect 的兼容边界',
    paragraphs: [
      '在服务端渲染环境中，浏览器 DOM 并不存在，因此 `useLayoutEffect` 往往会触发警告或需要做环境判断。很多库会做 isomorphic effect 封装，在服务端退化成 `useEffect`，客户端再用 `useLayoutEffect`。',
      '这说明 `useLayoutEffect` 更贴近浏览器布局阶段，而 `useEffect` 相对更“环境中性”。',
      '如果面试官问到 SSR，这会是一个不错的补充点。',
    ],
  },
  {
    title: '6. 面试里怎样把这道题答完整',
    paragraphs: [
      '先说两者本质上都是副作用 Hook；再明确核心差异是时机：`useLayoutEffect` 在 commit 后、绘制前同步执行，`useEffect` 在绘制后执行；然后讲各自适用场景；最后强调默认优先 `useEffect`，避免滥用 layout effect。',
      '一句话收尾很稳：`useLayoutEffect` 解决的是布局一致性问题，`useEffect` 解决的是一般副作用问题，它们的核心差异在于是否会阻塞绘制。',
    ],
  },
];

export default function ReactMechanismEffectLayoutPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="React Mechanism"
      company="React 机制类"
      issue="Issue 04"
      title="React 中 useEffect 和 useLayoutEffect 的区别与使用边界"
      strapline="两者都能做副作用，但关键差异是是否会阻塞绘制。"
      abstract="这道题的核心不是背诵“一个同步一个异步”，而是理解它们在 commit 后到浏览器绘制这一小段时间里的不同位置，以及由此带来的使用边界。"
      leadTitle="从执行时机切入，再落到布局一致性和一般副作用场景"
      lead="如果你能把浏览器绘制时机、commit 阶段、副作用执行顺序和页面闪动问题串起来，这道题就会比简单背 API 更有说服力。"
      answerOutline={[
        '先讲两者共同点：都属于副作用机制',
        '再讲执行时机差异：绘制前 vs 绘制后',
        '然后讲各自适用场景与滥用风险',
        '最后补 SSR 与默认选型原则',
      ]}
      quickAnswer="一句话答法：`useEffect` 和 `useLayoutEffect` 都是 React 的副作用 Hook，但核心区别在于执行时机。`useLayoutEffect` 在 DOM commit 后、浏览器绘制前同步执行，适合读取布局、同步修正界面以避免闪动；`useEffect` 则通常在浏览器完成绘制后执行，更适合请求、订阅、埋点等一般副作用。默认应优先使用 `useEffect`。"
      pullQuote="当你不需要在绘制前同步碰布局时，默认就不该先想到 useLayoutEffect。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '不要只说“同步异步”，要把它们和浏览器绘制时机绑定起来讲。',
        '回答使用边界时，重点讲“布局读写”和“避免闪动”。',
        '顺手补 SSR 警告边界，会更完整。',
      ]}
      mistakes={[
        '把 useLayoutEffect 当成更高级的 useEffect。',
        '只会背时机，不会落到具体使用场景。',
        '忽略 useLayoutEffect 会阻塞绘制这一代价。',
      ]}
      singleColumn
    />
  );
}
