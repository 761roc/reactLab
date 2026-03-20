import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心目标', value: '正确使用最顺手，错误使用尽早暴露' },
  { label: '关键手段', value: '联合类型、互斥 props、泛型透传、默认场景设计' },
  { label: '高频组件', value: 'Button、Table、Modal、FormField、Select' },
  { label: '主线', value: '语义清晰、变体明确、扩展受控、误用难写' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 组件类型设计本质上是 API 设计，而不是给 props 写个 interface 就完了',
    paragraphs: [
      '很多人回答这类题时，会停留在“我会给 props 写 interface”。这当然没错，但太浅。真正好的组件类型设计，目标不是把所有 props 列出来，而是让组件 API 语义清晰、默认使用顺手、错误组合尽早被类型系统拦住。',
      '所以组件类型设计更像一件 API 设计工作：你要想清楚用户最常怎么用它、有哪些互斥模式、哪些扩展点该开放、哪些边界必须收紧。',
      '如果你先把这层目标说出来，答案的层级会明显更高。',
    ],
  },
  {
    title: '2. 不同使用模式最好显式拆分，而不是堆成一堆可选 props',
    paragraphs: [
      '比如一个 Button 既可能是普通按钮，也可能是链接按钮。如果你把 `href`、`target`、`onClick`、`type` 全部做成可选字段，虽然灵活，但也会允许大量语义冲突组合。',
      '更稳的做法通常是把不同模式做成可判别联合，让链接模式和按钮模式各自有独立约束。这样调用方更清楚，类型系统也更容易拦截误用。',
      '所以一个高频原则是：模式越不同，越应该显式拆分，而不是全塞进一个大 props 对象里。',
    ],
    codeTitle: '互斥模式示例',
    code: `type ButtonProps =
  | { kind: 'button'; onClick: () => void; href?: never }
  | { kind: 'link'; href: string; onClick?: never };`,
  },
  {
    title: '3. 泛型只该出现在“调用方数据模型需要透传进来”的地方',
    paragraphs: [
      '像 Table、Select、FormField 这类组件，通常需要把调用方的数据模型带进组件内部，让列配置、渲染函数、value 和 onChange 自动对齐。这种场景非常适合用泛型。',
      '但如果组件本身并不依赖外部数据结构，硬塞泛型只会让 API 更重、更难用。',
      '所以讲这题时，最好顺手补一句：泛型是为数据模型透传服务的，不是为了让类型看起来更高级。',
    ],
  },
  {
    title: '4. 默认场景要尽量简单，高级场景再逐步开放扩展点',
    paragraphs: [
      '一个组件类型是否“好用”，很多时候不在于它有多少能力，而在于最常见场景是否够直白。比如 80% 的用法能不能少传几个 props 就搞定，默认值是否合理，名称是否贴合语义。',
      '在此基础上，再通过有限的扩展点承接高级场景，而不是一开始就把 API 面积铺得过大。',
      '所以组件类型设计里，约束和易用其实是一体两面：默认简单，扩展受控。',
    ],
  },
  {
    title: '5. 真正“不容易误用”，通常要靠互斥约束和错误组合不可表达',
    paragraphs: [
      '如果一个组件存在受控/非受控、单选/多选、链接/按钮、同步/异步等互斥模式，最稳的方案往往是让这些模式在类型上明确分开，而不是靠文档提醒用户别乱传。',
      '因为好的组件类型设计，不是要求调用者记住所有规则，而是让类型系统替你守规则。',
      '所以这道题里很值得强调的一点是：类型应该主动帮助避免误用，而不是只是被动描述字段。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答稳',
    paragraphs: [
      '先讲目标是“引导正确使用”；再讲用联合类型拆分模式、用互斥 props 控制错误组合；然后讲泛型只在需要透传数据模型时使用；最后补默认场景设计和受控扩展点。',
      '一句话收尾可以这样说：好的组件类型设计，不是把所有自由都暴露出来，而是把最常见用法做得顺手，把错误用法做得写不出来。',
    ],
  },
];

export default function TsTypeSystemComponentTypingPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="TypeScript Type System"
      company="面试-TypeScript 类型系统类"
      issue="Issue 06"
      title="如何为一个组件设计类型，既好用又不容易误用"
      strapline="组件类型不是 props 罗列，而是“如何引导正确使用”的 API 设计。"
      abstract="这道题真正考的是类型驱动的 API 设计能力。高分回答要同时讲语义、模式边界、泛型透传、默认场景和误用约束。"
      leadTitle="把组件类型设计当成 API 设计，而不是字段堆叠"
      lead="如果只说“给组件写个 interface”，答案会很浅。更完整的说法是：我会围绕主要使用模式、互斥约束、泛型透传和默认场景去设计类型，让组件易用且难误用。"
      answerOutline={[
        '先讲组件类型设计的目标是引导正确使用',
        '再讲模式拆分和互斥约束',
        '然后讲泛型透传与默认场景设计',
        '最后落到错误组合不可表达的原则',
      ]}
      quickAnswer="一句话答法：为组件设计类型时，我会把重点放在 API 语义和误用约束上，而不是堆大量可选 props。常见做法是用联合类型拆分不同模式、用互斥约束限制错误组合、在需要时用泛型透传调用方数据模型，并通过默认值和受控扩展点让常见场景更顺手。"
      pullQuote="组件类型设计最好的状态，是常见用法自然，错误用法难写。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '把这题当 API 设计题回答，会更有层次。',
        '一定提联合类型和互斥 props，这是高频得分点。',
        '泛型只在需要透传调用方模型时再用，不要滥用。',
      ]}
      mistakes={[
        '把所有 props 堆成一个大可选对象。',
        '只强调灵活，不强调误用边界。',
        '泛型使用无边界，导致 API 变重变晦涩。',
      ]}
      singleColumn
    />
  );
}
