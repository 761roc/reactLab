import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心目标', value: '用近似 O(n) 的方式判断哪些节点需要复用或重建' },
  { label: '关键假设', value: '不同类型节点通常生成不同树；同层比较而非跨层全量搜索' },
  { label: 'key 作用', value: '帮助 React 识别同层列表项的稳定身份' },
  { label: '高频追问', value: '为什么不能乱用 index 作为 key' },
];

const sections: EditorialSection[] = [
  {
    title: '1. React diff 不是最优树编辑算法，而是工程上可接受的近似策略',
    paragraphs: [
      '如果完全求解两棵树的最小编辑成本，理论复杂度会很高，不适合频繁运行在 UI 更新过程中。React 的做法是基于业务常见模式做工程化假设，从而把问题降到近似 O(n) 的级别。',
      '所以 React diff 的重点不是“绝对最优”，而是“足够快且通常够用”。如果面试里先把这层目标讲清，后面的假设就更容易理解。',
      'React 并不是不知道更精确的算法，而是 UI 场景里更看重可接受的性能和简单稳定的规则。',
    ],
  },
  {
    title: '2. 第一条核心假设：不同类型的节点，通常可以直接认为不是同一棵子树',
    paragraphs: [
      'React 的第一条重要假设是：如果节点类型不同，例如从 `div` 变成 `span`，或者从一个组件类型变成另一个组件类型，那么它们通常不值得继续深度复用，而是直接视为替换。',
      '这条规则极大减少了复杂比较的空间，因为 React 不需要跨类型去穷举最佳匹配，而是可以快速决定“这个分支基本重建”。',
      '这也是为什么组件类型变化时，你常常会看到整块子树重新挂载。',
    ],
  },
  {
    title: '3. 第二条核心假设：同层节点按顺序比较，列表重排依赖 key 提示身份',
    paragraphs: [
      'React 默认会把同一层的子节点按顺序比较。对于普通静态结构，这已经足够。但一旦进入列表增删改、重排场景，仅凭位置就不够了，因为同一个业务实体可能从第 2 位移动到第 5 位。',
      '这时 key 就非常关键。key 的作用不是给 DOM 节点加一个特殊属性，而是告诉 React：这个节点在兄弟节点中的稳定身份是谁。这样 React 才能知道是“移动并复用原节点”，还是“删掉旧节点再创建新节点”。',
      '所以 key 的核心不是为了消除警告，而是为了让 diff 在列表场景下复用正确对象。',
    ],
    codeTitle: '列表身份提示',
    code: `{items.map((item) => (
  <Row key={item.id} item={item} />
))}`,
  },
  {
    title: '4. 为什么乱用 index 作为 key 会出问题',
    paragraphs: [
      '如果列表只是纯展示、顺序永远不变，用 index 作为 key 有时不会立即出问题。但一旦列表发生插入、删除、排序或过滤，index 就不再代表稳定身份，只代表当前位置。',
      '这样 React 可能把原本属于 A 项的组件实例和状态错误地复用到 B 项上，表现为输入框内容错位、选中状态错位、动画异常等。',
      '所以 index 不是绝对不能用，而是只有在列表稳定、无重排、无局部状态时才勉强可接受。真实业务里更稳的做法仍然是使用真实唯一 id。',
    ],
  },
  {
    title: '5. key 影响的不只是性能，还影响状态复用正确性',
    paragraphs: [
      '很多人只把 key 理解成性能优化开关，这不够完整。更重要的是，key 会影响 React 是否把某个组件实例视为“同一个东西”。一旦 key 变了，React 很可能会重新挂载组件，从而丢掉原来的局部 state 和 effect 生命周期。',
      '反过来，如果两个本不该复用的节点用了相同 key，React 可能错误复用旧实例。',
      '所以 key 本质上是在参与组件身份管理，而不仅是 diff 速度优化。',
    ],
  },
  {
    title: '6. 面试里怎样把 diff 和 key 讲完整',
    paragraphs: [
      '推荐答法是：先说 React diff 为了性能使用近似策略，而不是最优树编辑算法；再讲两条核心假设：不同类型节点通常直接替换，同层节点按顺序比较；然后重点解释 key 是如何帮助 React 在列表场景识别稳定身份的；最后补充 index key 的问题和 key 对状态复用的影响。',
      '一句话收尾很好用：React diff 的核心不是“算得最精确”，而是基于合理假设快速判断哪些节点该复用；而 key 的价值在于让列表中的身份判断更准确。',
    ],
  },
];

export default function ReactMechanismDiffKeyPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="React Mechanism"
      company="React 机制类"
      issue="Issue 03"
      title="React diff 的核心假设是什么，为什么 key 很重要"
      strapline="key 不是为了解警告，而是在列表场景里给 React 提供稳定身份。"
      abstract="这道题真正考的是你是否知道 React diff 为什么能足够快，以及列表重排时 React 为什么离不开 key 来判断复用关系。"
      leadTitle="从 diff 近似策略讲到列表身份管理"
      lead="如果只说“key 很重要，因为 React 会优化性能”，答案太浅。更稳的说法应该先解释 React diff 为什么采用近似 O(n) 策略，再说明 key 如何帮助 React 在兄弟节点层面识别稳定身份。"
      answerOutline={[
        '先讲 React diff 的工程目标是快速近似而非绝对最优',
        '再讲不同类型节点与同层比较两条核心假设',
        '然后讲 key 如何帮助列表身份识别',
        '最后补 index key 问题和状态复用影响',
      ]}
      quickAnswer="一句话答法：React diff 为了避免高复杂度树编辑算法，采用了基于假设的近似策略，核心包括：不同类型节点通常直接视为不同子树，同层节点按顺序比较；而在列表场景下，顺序不够判断节点身份，所以需要 key 告诉 React 每个兄弟节点的稳定身份，这样 React 才能正确复用组件和 DOM。"
      pullQuote="key 的真正作用，不是消除警告，而是告诉 React“谁还是原来的那个节点”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先把 diff 近似策略的目标讲出来，再谈 key，会更有层次。',
        '不要只讲性能，要补“key 影响组件身份与状态复用”。',
        '被追问 index key 时，重点讲重排和局部状态错位。',
      ]}
      mistakes={[
        '把 key 只理解成性能优化提示。',
        '不会解释 React diff 为何不是全量最优树编辑算法。',
        '说不清 index key 在插入、排序场景下为什么有风险。',
      ]}
      singleColumn
    />
  );
}
