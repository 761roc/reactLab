import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '渲染阶段', value: '通常先父后子地构建 work tree' },
  { label: '提交阶段', value: 'DOM 变更与 layout effects 有自己的遍历顺序' },
  { label: '被动副作用', value: 'useEffect 通常在 commit 后统一调度执行' },
  { label: '题目重点', value: '要区分 render 顺序和 effect 顺序，不要混讲' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 这类题最容易混淆的，是“组件函数执行顺序”和“effect 执行顺序”不是一回事',
    paragraphs: [
      '很多人回答父子渲染顺序时，会把 render、commit、layout effect、passive effect 全混在一起，导致说不清。更稳的方式是先拆阶段：先说组件 render 时谁先执行，再说 commit 时谁先处理，再说 effect 何时运行。',
      '只要先建立这个阶段意识，这道题就容易很多。因为 React 并不是只有一个“渲染顺序”，不同阶段的遍历目标不同，顺序感也就不同。',
      '所以第一句话最好先说：要区分 render 阶段和 effect 阶段。',
    ],
  },
  {
    title: '2. render 阶段里，通常是父组件先执行，再递归到子组件',
    paragraphs: [
      '在 render 阶段，React 会从父组件开始执行，父组件返回子组件结构后，再继续往下走到子组件。因此从组件函数执行的直觉看，通常是“父先 render，子后 render”。',
      '这很符合树形遍历直觉：先处理父节点，再深入子节点。',
      '所以如果题目问“父子组件 render 的先后”，可以先给出这个基础结论。',
    ],
  },
  {
    title: '3. 但 effect 的顺序要结合 commit 阶段看，不能简单套用 render 顺序',
    paragraphs: [
      '当 render 阶段结束后，React 会在 commit 阶段处理 DOM 变更、ref、layout effect 等。这里已经不是单纯“谁先执行 render”的问题，而是 Fiber 提交顺序和 effect 列表处理顺序。',
      '在很多常见场景里，你会观察到子组件的 passive effect 先执行，再到父组件的 passive effect；而 cleanup 顺序又可能体现出另一种层级关系。也就是说，effect 顺序并不等于 render 顺序，必须放到 commit 和 effect flush 的语境里理解。',
      '面试里不要求你死背所有边角，但一定要讲出“render 顺序和 effect 顺序不能混为一谈”这个关键点。',
    ],
  },
  {
    title: '4. useLayoutEffect 和 useEffect 也要分开看',
    paragraphs: [
      '`useLayoutEffect` 属于更早的同步副作用，发生在 DOM 提交之后、浏览器绘制之前；`useEffect` 属于被动副作用，通常在绘制后再统一执行。它们即使在同一对父子组件里，也不应该被当成完全同一种时机。',
      '因此如果题目追问 effect 顺序，你最好补一句：layout effects 和 passive effects 是两套时机，不建议混讲成一个概念。',
      '这样回答会更稳，也更接近 React 实际的阶段模型。',
    ],
  },
  {
    title: '5. 实战里更重要的是理解“阶段分层”，而不是机械背一个顺序表',
    paragraphs: [
      '真实项目里，顺序题的价值主要在于帮你定位 bug。例如父组件 effect 里依赖子组件 DOM，为什么此时还拿不到？为什么 cleanup 顺序和你直觉不一样？这些都要求你按阶段去想问题。',
      '因此比起死记“谁先谁后”，更重要的是知道：render 是算树，commit 是提树，layout effect 更早，passive effect 更晚。',
      '如果面试里能把这个心智模型讲出来，就已经很不错了。',
    ],
  },
  {
    title: '6. 面试里怎样把这道题答稳',
    paragraphs: [
      '先区分 render 阶段和 effect 阶段；再说 render 时通常父先子后；然后补“effect 顺序不能直接套 render 顺序，尤其要区分 layout effect 和 passive effect”；最后落回实际意义：帮助理解副作用时机和定位顺序类 bug。',
      '一句话收尾可以这样说：React 里真正应该记住的不是一个死顺序，而是不同阶段各自有自己的遍历规则。',
    ],
  },
];

export default function ReactMechanismRenderOrderPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="React Mechanism"
      company="React 机制类"
      issue="Issue 05"
      title="React 中父子组件渲染顺序、effect 执行顺序是怎样的"
      strapline="顺序题最重要的是先分阶段，而不是把 render 和 effect 混成一件事。"
      abstract="这道题考的是阶段意识。高分回答不是死背一个顺序表，而是先拆出 render、commit、layout effect、passive effect，再讲它们各自的先后关系。"
      leadTitle="先区分 render 与 effect，再谈父子顺序"
      lead="很多 React 顺序题之所以难，是因为不同阶段有不同的遍历规则。只要先把 render 和 effect 分开，再把 useLayoutEffect 和 useEffect 分开，这道题就会清晰很多。"
      answerOutline={[
        '先区分 render 阶段和 effect 阶段',
        '再讲 render 通常父先子后',
        '然后说明 effect 顺序不能简单套用 render 顺序',
        '最后补 layout effect 与 passive effect 的区别',
      ]}
      quickAnswer="一句话答法：React 中父子组件在 render 阶段通常表现为父先执行、子后执行；但 effect 执行顺序不能简单等同于 render 顺序，因为它发生在 commit 阶段之后，而且 `useLayoutEffect` 与 `useEffect` 还属于不同的时机层。回答这类题时，关键是先区分 render、commit、layout effect 和 passive effect。"
      pullQuote="顺序题真正考的不是记忆力，而是你有没有“按阶段理解 React”的能力。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '一定先讲“要区分 render 和 effect”，这会让回答结构立刻稳下来。',
        '如果不确定极细节顺序，也不要乱背，回到阶段模型最安全。',
        '把实际价值落到“定位副作用时机 bug”上，会更像真实经验。',
      ]}
      mistakes={[
        '把组件 render 顺序和 effect 顺序混为一谈。',
        '忽略 useLayoutEffect 和 useEffect 是两套不同执行时机。',
        '死背一个顺序表，却解释不了为什么。',
      ]}
      singleColumn
    />
  );
}
