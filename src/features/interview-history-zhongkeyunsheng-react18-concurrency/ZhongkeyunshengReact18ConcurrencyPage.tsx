import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心目标', value: '让高优先级交互先响应，低优先级渲染可被打断和恢复' },
  { label: '实现关键', value: 'Fiber + Scheduler + Lanes 优先级模型' },
  { label: '关键特征', value: 'render 阶段可中断，commit 阶段仍同步' },
  { label: '高频 API', value: 'startTransition、useTransition、useDeferredValue' },
];

const sections: EditorialSection[] = [
  {
    title: '1. React18 的并发不是“多线程渲染”，而是更细粒度的调度能力',
    paragraphs: [
      '这道题最容易答错的地方，是把并发理解成浏览器里真的开了多个线程同时渲染 UI。React18 并发更准确的说法是：React 具备了把渲染工作切片、打断、恢复和重排优先级的能力，从而让更紧急的更新先完成。',
      '因此它解决的是“调度”和“用户体验响应”问题，而不是让计算量凭空消失。重逻辑还是重逻辑，只是 React 可以决定哪些先做、哪些后做。',
      '如果开口先把这一点讲清，后面的底层实现就容易顺起来。',
    ],
  },
  {
    title: '2. 底层基础仍然是 Fiber：因为只有 Fiber 才能把渲染工作拆成可中断单元',
    paragraphs: [
      'React 在更早的版本引入 Fiber，本质上就是把原本递归不可中断的渲染过程，拆成一批可以逐步推进的工作单元。每个 Fiber 节点对应一段待处理的组件工作，React 可以在节点之间暂停、继续或切换。',
      '这为并发特性提供了物理基础。没有 Fiber，React 很难在渲染过程中“先停下来处理更紧急的输入”，因为整个渲染会被一次性做完。',
      '所以回答 React18 并发时，提到 Fiber 很重要，因为并发不是凭空出现的 API 层特性，而是建立在 Fiber 架构之上的调度升级。',
    ],
  },
  {
    title: '3. 真正让并发成立的关键，是 Scheduler 和 Lanes 优先级模型',
    paragraphs: [
      'React18 在更新调度上引入了更明确的优先级体系。可以简单理解为：不同更新会被打到不同优先级车道，也就是 lanes。用户输入、点击这类交互通常是更高优先级；大列表刷新、复杂视图重算这类可以被放到更低优先级。',
      'Scheduler 负责根据当前时间片和优先级安排工作，决定是继续某个低优先级渲染，还是先插入一个更紧急的任务。这样一来，低优先级渲染就可能在中途被暂停，等高优先级工作处理完再继续。',
      '因此并发的实现主线可以概括成：Fiber 提供可拆分工作单元，Scheduler 决定什么时候干，Lanes 决定谁更优先。',
    ],
    bullets: [
      '并发的核心心智是优先级，而不是 API 名字。',
      '不同更新会被分配不同 lanes。',
      '低优先级渲染可以暂停和恢复。',
    ],
    codeTitle: '并发调度的思维模型',
    code: `用户输入
-> 产生高优先级更新
-> 低优先级渲染被打断
-> 先响应输入
-> 再恢复低优先级渲染`,
  },
  {
    title: '4. render 阶段可以中断，但 commit 阶段仍然保持同步一致',
    paragraphs: [
      '这是 React18 并发实现里非常关键的一点。很多人以为整个 React 更新都变成异步可打断，其实不是。可被打断的是 render 阶段，也就是计算下一棵工作树的过程；真正把结果提交到 DOM 的 commit 阶段，React 仍然要求同步完成。',
      '原因很简单：DOM 一旦开始提交，必须保持一致性，不能提交一半停下来，否则用户会看到不一致的 UI。',
      '所以面试里如果能补一句“并发主要发生在 render 阶段，commit 仍然同步”，基本就说明你理解到了实现边界。',
    ],
  },
  {
    title: '5. startTransition 和 useDeferredValue 只是把更新标记成低优先级入口',
    paragraphs: [
      '很多人学并发特性时，注意力都落在 API 上。但这些 API 不是并发的本体，而是给调度系统打标签的入口。`startTransition` 用来告诉 React：这批更新不是最紧急的，可以降级处理；`useDeferredValue` 则更像“让某个值的消费滞后一点”。',
      '真正起作用的是这些标签背后映射到不同 lane 和调度策略。也就是说，API 是表达意图，底层是优先级调度模型在执行。',
      '如果你把 API 和底层调度关系讲出来，答案会明显高于只会背 `useTransition` 用法的层次。',
    ],
    codeTitle: 'transition 的本质是标记优先级',
    code: `startTransition(() => {
  setFilteredRows(expensiveFilter(rows, keyword));
});

setKeyword(keyword); // 更紧急
// setFilteredRows(...) // 较低优先级`,
  },
  {
    title: '6. React18 并发要解决的真实体验问题，是输入不卡、交互先响应、重视图后跟上',
    paragraphs: [
      '如果把这道题只讲成底层字段，会有点偏。更好的做法是把实现和体验结合起来。比如搜索框输入时，用户最在意的是光标和输入立刻响应，而不是筛选结果必须在同一毫秒完成。并发调度正是让 React 能优先处理这类紧急反馈。',
      '这也是为什么 React18 并发更像“用户体验优化框架”，而不是某种纯粹追求吞吐量的性能黑科技。它的价值是把不同类型的更新分层处理。',
      '所以面试里可以把底层和场景连起来：Fiber 让工作可拆，Scheduler + Lanes 让优先级可控，最后换来的，是更顺滑的输入和交互体验。',
    ],
  },
  {
    title: '7. 面试里怎样把 React18 并发实现讲完整',
    paragraphs: [
      '一个很稳的顺序是：先纠正“不是多线程”；再讲 Fiber 提供可中断工作单元；接着讲 Scheduler 和 Lanes 如何安排优先级；然后补一句 render 可中断、commit 仍同步；最后再把 startTransition、useDeferredValue 和实际场景连起来。',
      '如果被问“是不是性能更强了”，你可以回答：它更准确地说是调度能力更强、交互体验更好，但重计算本身仍然需要拆分、缓存、虚拟列表等手段来配合。',
      '一句话收尾很好用：React18 并发的实现本质，是在 Fiber 架构上用优先级调度把渲染从“一次做完”升级成“按重要性分配执行时机”。',
    ],
  },
];

export default function ZhongkeyunshengReact18ConcurrencyPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 07"
      title="react18 中的并发是如何实现的"
      strapline="并发不是多线程，而是 Fiber 架构上的优先级调度能力。"
      abstract="这道题真正考的是你是否知道 React18 的并发来自可中断 render、Scheduler 调度和 Lanes 优先级模型，而不是只会背几个并发 API。"
      leadTitle="把 Fiber、Scheduler、Lanes 和体验收益串成一条主线"
      lead="如果只说 `startTransition`，答案会很表层。更完整的说法应该从 Fiber 的可拆分工作单元讲起，再讲 Scheduler 和 Lanes 如何重排优先级，最后落到 render 可中断、commit 保持同步，以及输入与重视图分层处理的实际价值。"
      answerOutline={[
        '先纠正并发不是多线程',
        '再讲 Fiber 如何让渲染工作可拆分',
        '然后讲 Scheduler 和 Lanes 如何做优先级调度',
        '最后讲 render/commit 边界与 transition API 的角色',
      ]}
      quickAnswer="一句话答法：React18 的并发不是多线程渲染，而是基于 Fiber 架构把渲染工作拆成可中断单元，再通过 Scheduler 和 Lanes 优先级模型安排不同更新的执行时机。低优先级 render 可以被打断和恢复，高优先级交互更新可以先处理；但最终 commit 阶段仍然保持同步，以确保 DOM 一致性。"
      pullQuote="React18 并发的核心，不是“同时做更多事”，而是“先做更重要的事”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '一定先澄清“不是多线程”，这是最常见误区。',
        '回答时把 Fiber、Scheduler、Lanes 三个词串在一起，逻辑会很完整。',
        '别忘了补一句“render 可中断，commit 仍同步”，这是高频得分点。',
      ]}
      mistakes={[
        '把并发错误理解成多线程渲染。',
        '只会说 `startTransition`，说不清底层调度和优先级模型。',
        '忽略 commit 阶段仍要同步一致这一边界。',
      ]}
      singleColumn
    />
  );
}
