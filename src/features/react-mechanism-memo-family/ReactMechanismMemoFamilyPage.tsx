import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: 'React.memo', value: '控制组件是否跳过重渲染' },
  { label: 'useMemo', value: '缓存某次计算结果' },
  { label: 'useCallback', value: '缓存函数引用本身' },
  { label: '关键前提', value: '优化前先确认瓶颈与收益' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 这三个 API 常被混用，但它们解决的问题其实不在同一层',
    paragraphs: [
      '很多人会把 `memo`、`useMemo`、`useCallback` 统称成“性能优化三件套”，这没错，但还不够精确。更稳的讲法是：`React.memo` 主要控制组件是否需要重新渲染，`useMemo` 主要缓存某次计算结果，`useCallback` 主要缓存函数引用。',
      '也就是说，一个作用在组件层，一个作用在值层，一个作用在函数引用层。只要先把层级分开，后面就不容易混。',
      '这也是这道题最核心的第一步。',
    ],
  },
  {
    title: '2. React.memo 解决的是“父组件更新时，子组件是否可以跳过”',
    paragraphs: [
      '默认情况下，父组件重新渲染时，子组件也会跟着重新执行。`React.memo` 的作用是：如果 props 没有变化，就允许 React 跳过这个子组件的重新渲染。',
      '它的适用前提是：子组件本身渲染代价不小，而且 props 在很多次更新里其实并没有变。',
      '所以 `memo` 更像在组件边界上加了一层“props 没变就别重跑”的判断。',
    ],
    codeTitle: '组件级跳过',
    code: `const UserCard = memo(function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
});`,
  },
  {
    title: '3. useMemo 解决的是“某个值的计算成本高，不想每次 render 都重算”',
    paragraphs: [
      '`useMemo` 的核心不是“优化渲染”本身，而是缓存一次昂贵计算的结果。比如大列表筛选、复杂排序、图表配置计算、列定义生成等，如果依赖没变，就可以直接复用上一次结果。',
      '因此 `useMemo` 适合的是“计算结果复用”，不是所有值都值得 memo。对很轻的计算滥用 `useMemo`，反而会增加理解成本。',
      '回答这题时，一定要把“缓存计算结果”说清，而不是简单说“它也能防止重复渲染”。',
    ],
  },
  {
    title: '4. useCallback 解决的是“函数引用不稳定，导致依赖或子组件 props 总在变”',
    paragraphs: [
      '函数组件每次 render 时，函数字面量通常都会重新创建。这样如果你把一个回调传给 `memo` 子组件，或者把它写进 effect 依赖，就可能造成不必要的变化。',
      '`useCallback` 的作用就是在依赖没变时复用同一个函数引用。它本质上不是在“优化函数执行速度”，而是在“稳定函数身份”。',
      '因此可以把它理解成“专门为函数做的 useMemo”。',
    ],
  },
  {
    title: '5. 这三个 API 经常联动使用，但不等于应该默认一起上',
    paragraphs: [
      '在真实项目里，`memo` 往往要配合稳定 props 才能真正生效，而对象、数组、函数引用又恰好可能需要 `useMemo` 或 `useCallback` 来稳定。',
      '但这不意味着每个组件都要默认把三者全套上。优化应该由瓶颈驱动，而不是模板驱动。否则很容易得到一堆复杂代码，但收益几乎没有。',
      '所以高分回答通常会补一句：先量瓶颈，再决定是否需要 memo family，而不是见组件就加。',
    ],
  },
  {
    title: '6. 面试里怎样把这道题答完整',
    paragraphs: [
      '最稳的顺序是：先按层级区分三者；再逐个解释 `React.memo`、`useMemo`、`useCallback` 分别缓存什么；然后补它们常见联动方式；最后强调不要过度优化，要先量瓶颈。',
      '一句话收尾可以这样说：`React.memo` 缓的是组件重渲染，`useMemo` 缓的是计算结果，`useCallback` 缓的是函数引用，它们常常配合使用，但是否值得用必须由实际收益决定。',
    ],
  },
];

export default function ReactMechanismMemoFamilyPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="React Mechanism"
      company="React 机制类"
      issue="Issue 06"
      title="React 中 memo、useMemo、useCallback 分别解决什么问题"
      strapline="三者都叫优化，但分别缓存的是组件、值和函数引用。"
      abstract="这道题高频失分点在于把三个 API 混成同一件事。更好的回答方式是先把它们作用层级分开，再说明它们为何会在真实项目里联动使用。"
      leadTitle="先分层，再解释三种缓存分别在 React 哪一层起作用"
      lead="React 性能题里，最怕的是把 API 名字背成列表。真正有价值的回答，是先区分它们缓存的对象，再回到组件边界、计算结果和函数引用三条主线。"
      answerOutline={[
        '先分清三者分别缓存什么',
        '再逐个讲组件、值和函数引用层面的作用',
        '然后讲它们为何常常联动使用',
        '最后补不要过度优化的原则',
      ]}
      quickAnswer="一句话答法：`React.memo` 解决的是组件在 props 没变时是否可以跳过重渲染；`useMemo` 解决的是某个计算结果是否可以在依赖不变时复用；`useCallback` 解决的是函数引用在多次 render 中是否可以保持稳定。三者都和性能有关，但作用层级不同，不能混为一谈。"
      pullQuote="别把三者都叫“性能优化”，而不去区分到底是谁在缓存什么。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲“缓存对象不同”，这个开头最稳。',
        '回答 useCallback 时，重点讲“稳定函数引用”，不要说成“让函数更快”。',
        '顺手补“优化前先量瓶颈”，会显得更成熟。',
      ]}
      mistakes={[
        '把三者混成“都是防止重复渲染”。',
        '说不清 useMemo 和 useCallback 分别缓存什么。',
        '默认把这三个 API 当通用模板滥用。',
      ]}
      singleColumn
    />
  );
}
