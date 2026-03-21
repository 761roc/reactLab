import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '一句话本质', value: '状态驱动视图，事件再把输入回写到状态' },
  { label: 'React 特点', value: '没有内建 v-model，靠受控组件自行组合' },
  { label: '高频场景', value: 'input、select、checkbox、表单库封装' },
  { label: '常见追问', value: '受控/非受控、性能、复杂表单如何抽象' },
];

const sections: EditorialSection[] = [
  {
    title: '1. React 里的“双向绑定”不是框架魔法，而是单向数据流的组合结果',
    paragraphs: [
      '很多人提到双向绑定，第一反应是 Vue 的 `v-model`。但 React 的思路不一样。React 并没有提供一个内建语法告诉你“自动双向绑定”，它更强调单向数据流：状态流向视图，用户交互再通过事件把变化回写到状态。',
      '因此如果要用一句人话解释 React 如何实现双向绑定，最稳的说法是：通过受控组件，把输入框的 `value` 绑定到 state，再在 `onChange` 里把用户输入写回 state。视图和状态因此形成一个闭环。',
      '这里一定要把“受控组件”说出来，因为 React 里的双向绑定本质上不是特殊指令，而是“value + onChange + state”这套组合模式。',
    ],
    bullets: [
      '状态到视图：`value={state}`',
      '视图到状态：`onChange -> setState`',
      '闭环成立，但底层仍然是单向数据流',
    ],
    codeTitle: '最基础的双向绑定写法',
    code: `function NameInput() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}`,
  },
  {
    title: '2. 为什么说它仍然是单向数据流，而不是传统意义上的“自动同步”',
    paragraphs: [
      '表面看起来，输入框和状态好像在双向同步，但从架构上看，数据流向仍然是清晰可拆开的。state 变化时，React 重新渲染，新的 `value` 决定 UI 呈现；用户输入时，浏览器先触发事件，React 事件处理器再显式调用 `setState` 更新状态。',
      '也就是说，React 从来没有放弃单向数据流。它只是让你把“从输入到状态的回写逻辑”写出来。这个区别很重要，因为面试官常常会用“双向绑定”这个口头说法来问，但真正想听的是你是否知道 React 的内部心智仍然是单向的。',
      '如果你能主动补一句“React 的双向绑定本质上是单向数据流闭环，而不是模板语法级的自动联动”，通常会显得更懂框架思想。',
    ],
  },
  {
    title: '3. 受控组件和非受控组件的边界，是这道题最常见的延伸',
    paragraphs: [
      '受控组件是 React 推荐的主流方案，因为状态统一放在 React 里，校验、联动、提交、重置都更容易管理。非受控组件则把真实值保存在 DOM 内部，通过 `ref` 在需要时读取。它更像传统表单写法，在简单场景下也有用，但可控性弱。',
      '所以如果面试官追问“为什么不用非受控”，你可以回答：简单输入、低干预场景可以非受控，但只要涉及联动校验、动态表单、统一提交、回填编辑，就更适合受控方案。',
      '这道题的得分点，不是简单站队，而是知道什么情况下需要把表单状态显式纳入 React 管理。',
    ],
    bullets: [
      '受控：值在 React state 中，适合复杂表单。',
      '非受控：值在 DOM 中，适合简单低干预输入。',
      '复杂业务通常离不开受控模式。',
    ],
    codeTitle: '非受控组件示例',
    code: `function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input ref={inputRef} defaultValue="hello" />
      <button onClick={() => console.log(inputRef.current?.value)}>Read</button>
    </>
  );
}`,
  },
  {
    title: '4. 复杂表单里的“双向绑定”，本质上要解决的不只是回写，还包括校验、联动和一致性',
    paragraphs: [
      '真实项目中，很少只有一个输入框。你通常还要处理格式校验、字段联动、异步校验、默认值回填、草稿保存、依赖显示隐藏等问题。此时“value + onChange”只是起点，真正的难点在于如何管理表单状态和副作用。',
      '这也是为什么 React 生态里会出现 Formik、React Hook Form、Ant Design Form 这类库。它们不是在发明新的双向绑定原理，而是在这一基本闭环上继续封装：字段注册、校验生命周期、错误状态、提交状态、性能优化。',
      '所以回答这题时，如果能从“单个 input”自然过渡到“表单系统抽象”，会更像真实开发经验，而不是只会写示例代码。',
    ],
  },
  {
    title: '5. 性能问题经常出在“每个字符输入都导致大范围重渲染”',
    paragraphs: [
      '受控组件的代价是每次输入都会触发状态更新和重新渲染。如果一个大表单把所有字段状态都放在一个很高层的组件里，用户每敲一个字，整棵表单甚至周边大区域都可能重新渲染，性能就会变差。',
      '因此复杂表单里常见的优化方向包括：缩小状态作用域、按字段拆分组件、使用 `memo`、减少不必要联动、对重计算逻辑做延迟处理，或者使用 subscription 模式的表单库。',
      '面试里如果被追问“受控组件会不会卡”，不要泛泛回答“可能会”，而要落到“更新范围过大”这个根因上。',
    ],
    bullets: [
      '不是受控本身慢，而是状态作用域太大。',
      '表单库常用字段级订阅来降低重渲染。',
      '复杂联动表单尤其要关注更新半径。',
    ],
  },
  {
    title: '6. 面试里怎样把 React 双向绑定讲完整',
    paragraphs: [
      '最稳的顺序是：先说 React 没有内建双向绑定语法，而是通过受控组件实现；然后解释 `value` 和 `onChange` 如何形成闭环；再补受控和非受控的区别；最后落到复杂表单里的校验、联动和性能问题。',
      '如果你只说“用 useState 就行”，答案会显得太浅；如果你能顺手补一句“本质上仍然是单向数据流，只是把视图变化回写到 state”，整体层次会明显更高。',
      '最后可以用一句话收尾：React 实现双向绑定的方式不是提供模板魔法，而是用受控组件把 state、view 和 event 三者连成闭环。',
    ],
  },
];

export default function ZhongkeyunshengReactTwoWayBindingPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 05"
      title="react 如何实现一个双向绑定"
      strapline="React 没有内建 v-model，它靠受控组件把状态、视图和事件回写连成闭环。"
      abstract="这道题表面是在问表单写法，实际上考的是你是否理解 React 的单向数据流模型，以及受控组件为什么能在这个模型下实现所谓的“双向绑定”。"
      leadTitle="从受控组件讲起，把双向绑定还原成单向数据流闭环"
      lead="只说 `useState + onChange` 还不够。更完整的回答应该说明：React 里并不存在模板级的自动双向绑定，所谓双向绑定本质上是 state 驱动 UI，再通过事件显式把输入回写到 state。"
      answerOutline={[
        '先讲 React 里的双向绑定本质仍是单向数据流',
        '再讲受控组件的 value 和 onChange 闭环',
        '然后讲受控/非受控边界与复杂表单抽象',
        '最后补性能和面试里的完整答法',
      ]}
      quickAnswer="一句话答法：React 通过受控组件实现所谓的双向绑定，即把输入组件的 `value` 绑定到 state，再在 `onChange` 中读取用户输入并调用 `setState` 更新状态。这样状态变化会重新驱动视图，视图输入又会回写状态，形成闭环；但从架构上看，它依然是单向数据流。"
      pullQuote="React 的双向绑定，不是魔法指令，而是 `value + onChange + state` 的受控闭环。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '一定要把“React 仍然是单向数据流”说出来，这比单纯说受控组件更完整。',
        '被追问时顺手区分受控和非受控，再落到复杂表单库的封装。',
        '如果说性能，重点讲“更新范围过大”，不要只说“input 会卡”。',
      ]}
      mistakes={[
        '只回答 `useState + onChange`，没有讲受控组件和单向数据流的关系。',
        '把 React 双向绑定误解成模板层自动同步，而不是显式事件回写。',
        '忽略复杂表单里的校验、联动和性能问题。',
      ]}
      singleColumn
    />
  );
}
