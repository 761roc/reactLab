import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: 'any', value: '放弃类型检查，读写都放行' },
  { label: 'unknown', value: '先未知，后收窄，比 any 安全' },
  { label: 'never', value: '不可能出现的值或到不了的分支' },
  { label: '主线', value: '放弃检查 / 保留未知 / 表达不可能' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 这三个类型名字都很“特殊”，但它们解决的其实是三类完全不同的问题',
    paragraphs: [
      '回答这道题时，最稳的开头不是挨个背定义，而是先把它们放回问题域里。`any` 解决的是“我现在不想让类型系统管我”；`unknown` 解决的是“我现在不知道它是什么，但后面要先确认再用”；`never` 解决的是“这里按道理根本不应该有值”。',
      '所以这三个词虽然都很常见，但代表的是三种不同态度：跳过检查、延后确认、表达不可能。只要先把这层讲清，面试官会明显感觉你不是在背术语。',
      '很多失分就失在把它们都说成“特殊类型”，却说不清差异背后的意义。',
    ],
  },
  {
    title: '2. any：自由度最高，但代价是直接绕开 TypeScript 的保护',
    paragraphs: [
      '`any` 的特点非常直接：对它做什么基本都不会报错。你可以访问不存在的属性、调用随便的方法，也可以把它赋值给别的具体类型。它相当于在告诉编译器：这里别检查了，我自己承担风险。',
      '因此 `any` 的问题不是“能不能用”，而是“用了之后类型系统就失效了”。一旦 `any` 在业务链路里扩散，后面的安全性会越来越差。',
      '实践里，我只会把它放在迁移期、极小范围兜底、第三方声明严重缺失的场景中，而不会把它当默认解法。',
    ],
    codeTitle: 'any 会直接绕过保护',
    code: `let value: any = 'hello';
value.foo.bar();

const count: number = value;`,
  },
  {
    title: '3. unknown：它也是未知，但你不能在未确认前随便使用',
    paragraphs: [
      '`unknown` 可以理解成“安全版 any”。任何值都能赋给它，因为它本来就表示“当前未知”；但它不能直接赋给更具体的类型，也不能直接访问属性或调用方法，除非你先做收窄。',
      '这让 `unknown` 非常适合系统边界的数据，比如接口响应、用户输入、反序列化结果、catch 捕获的错误。进入系统时先承认它是未知的，之后再通过类型守卫或运行时校验缩小范围。',
      '所以一句很稳的话是：`unknown` 不是更麻烦的 any，而是把“先确认再使用”强制写进类型系统。',
    ],
    codeTitle: 'unknown 要先收窄',
    code: `function printLength(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.length);
  }
}`,
  },
  {
    title: '4. never：最适合表达“不应该发生”以及“已经处理完所有情况”',
    paragraphs: [
      '`never` 最容易被误解成空值类型，但它真正表示的是“不可能有值”。例如一个总是抛错的函数可以返回 `never`；联合类型经过穷尽检查后，如果所有分支都处理完了，剩余变量也应该被收窄成 `never`。',
      '这使得 `never` 在控制流分析和穷尽检查里非常有价值。它不是拿来承载数据的，而是拿来告诉编译器：如果走到这里，说明逻辑有问题。',
      '面试里如果只说“never 表示不会返回”，还不够完整；最好顺手把它和 exhaustive check 绑起来讲。',
    ],
    codeTitle: 'never 的典型价值',
    code: `function assertNever(value: never): never {
  throw new Error(String(value));
}`,
  },
  {
    title: '5. 真正值得讲的是使用边界：any 用于过渡，unknown 用于边界，never 用于不可能',
    paragraphs: [
      '这道题高分答案通常都会落到使用边界。`any` 只该在不得已的过渡区出现，而且范围要尽量小；`unknown` 适合接住外部世界进入系统的未知数据；`never` 则适合表达类型设计里的“禁止状态”或逻辑上的“已无剩余分支”。',
      '如果你把结论浓缩成一句：`any` 是跳过、`unknown` 是延后确认、`never` 是彻底不可能，整体会非常清楚。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答稳',
    paragraphs: [
      '推荐顺序是：先讲三者解决的问题不同；再讲赋值与使用规则；然后给出边界场景；最后强调业务里默认优先 `unknown` 而不是 `any`，以及 `never` 在穷尽检查里的价值。',
      '一句话收尾可以这样说：`any` 代表放弃类型系统，`unknown` 代表保留未知但强制收窄，`never` 代表这个值从逻辑上就不应该存在。',
    ],
  },
];

export default function TsTypeSystemAnyUnknownNeverPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="TypeScript Type System"
      company="面试-TypeScript 类型系统类"
      issue="Issue 01"
      title="any、unknown、never 的区别和适用场景"
      strapline="一个是直接跳过检查，一个是先未知后确认，一个是根本不可能存在。"
      abstract="这道题看似基础，实则很能区分“背定义”和“懂边界”。真正的得分点是把它们分别放回放弃检查、边界输入和穷尽设计的语境里。"
      leadTitle="把三种“特殊类型”还原成三种不同的工程态度"
      lead="如果你只会背 any 最宽、unknown 更安全、never 最窄，这道题会很薄。更完整的答法应该强调它们分别解决什么问题，以及在真实业务里应该放在哪里。"
      answerOutline={[
        '先讲三者分别在解决什么问题',
        '再讲使用限制和赋值规则',
        '然后落到迁移兜底、边界输入和穷尽检查场景',
        '最后给出清晰的使用边界结论',
      ]}
      quickAnswer="一句话答法：`any` 表示直接放弃类型检查，几乎对它做什么都不会报错；`unknown` 表示当前未知，但在使用前必须先做类型收窄，因此比 `any` 安全；`never` 表示不可能有值，常用于永不返回的函数和联合类型穷尽检查。实践上，`any` 只适合短期过渡，`unknown` 适合边界输入，`never` 适合表达不可能状态。"
      pullQuote="`any` 是放弃，`unknown` 是克制，`never` 是排除。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲语义差异，再讲语法规则，这样更像真的理解。',
        '被问场景时优先答边界输入、迁移兜底和穷尽检查。',
        '顺手强调“默认优先 unknown 而不是 any”很加分。',
      ]}
      mistakes={[
        '把 unknown 说成只是更严格的 any。',
        '把 never 理解成 null 或 undefined。',
        '只背术语，不会落到真实场景边界。',
      ]}
      singleColumn
    />
  );
}
