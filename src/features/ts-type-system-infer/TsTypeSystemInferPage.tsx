import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '一句话', value: '条件类型里的“临时提取变量”' },
  { label: '典型能力', value: '从函数、Promise、数组等结构中拆出内部类型' },
  { label: '高频工具', value: 'ReturnType、Parameters、Awaited、InstanceType' },
  { label: '核心价值', value: '让类型系统能从结构里抽信息' },
];

const sections: EditorialSection[] = [
  {
    title: '1. infer 最适合被理解成“类型模式匹配时顺手抓出的变量”',
    paragraphs: [
      '很多人会把 `infer` 当成黑魔法，其实完全可以用一句很直白的话概括：当条件类型在匹配某种结构时，我想把其中某一段类型提取出来并给它起个临时名字，这时就用 `infer`。',
      '因此 infer 不是独立存在的关键字，它必须嵌在条件类型里，并且依附于某种结构匹配。例如“如果 T 看起来像一个函数，那我就把返回值类型提出来”。',
      '这个理解一旦到位，很多内置工具类型都会变得很自然。',
    ],
  },
  {
    title: '2. 最典型的场景，是从函数类型里提取返回值或参数',
    paragraphs: [
      '像 `ReturnType<T>` 这种工具，本质上就在做一件事：如果 T 能匹配成函数类型，那么用 `infer R` 把返回值类型 R 拿出来。参数列表也是同理。',
      '所以 infer 的核心不是“创建新类型”，而是“从现有类型结构中提取一部分信息”。',
      '面试里优先用函数返回值这个例子解释 infer，通常最容易让对方听懂。',
    ],
    codeTitle: '从函数里提取返回值',
    code: `type MyReturnType<T> =
  T extends (...args: never[]) => infer R ? R : never;`,
  },
  {
    title: '3. 第二类高频场景，是拆包装类型',
    paragraphs: [
      '除了函数，很多类型本身也像容器，比如 `Promise<T>`、数组、构造器、模板字符串。infer 在这里也很常见，因为它特别适合把外壳拆开，拿到里面包着的真实类型。',
      '比如 `Awaited<T>` 就是在判断某个类型是不是 Promise，如果是，就把 Promise 里包着的值类型拿出来。',
      '因此 infer 的一个通用心智是：匹配结构，拆外壳，取内部类型。',
    ],
  },
  {
    title: '4. 为什么内置工具类型离不开 infer',
    paragraphs: [
      '只要一个工具类型的目标是“从已有类型里提取信息”，infer 基本就会登场。比如 `ReturnType` 提取函数返回值，`Parameters` 提取参数元组，`InstanceType` 提取构造器实例类型，`Awaited` 提取 Promise 最终值类型。',
      '这些工具类型的共性是：它们不是在凭空构造类型，而是在“读结构、抽信息”。',
      '所以回答这题时，最好把 infer 和工具类型的共性绑定起来，而不是只报几个名字。',
    ],
  },
  {
    title: '5. infer 的边界：必须依赖匹配，不能单独胡乱使用',
    paragraphs: [
      'infer 不是任何地方都能用。它必须出现在条件类型的匹配位置，而且只有匹配成功才有意义。如果结构不匹配，就会走到 else 分支。',
      '所以更准确地说，infer 是条件类型里的“提取变量”，而不是一种独立推导机制。',
      '这句话如果能讲出来，说明你已经把 infer 放回正确语境了。',
    ],
  },
  {
    title: '6. 面试里怎样把 infer 讲完整',
    paragraphs: [
      '先讲 infer 是条件类型里的临时提取变量；再举函数返回值和 Promise 拆包两个例子；然后列出几个常见工具类型；最后补 infer 必须依附于结构匹配的边界。',
      '一句话收尾可以这样说：infer 的本质，就是在条件类型匹配成功时，把某段内部类型提取出来供后续使用。',
    ],
  },
];

export default function TsTypeSystemInferPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="TypeScript Type System"
      company="面试-TypeScript 类型系统类"
      issue="Issue 03"
      title="infer 是怎么理解的，常见用在哪些工具类型里"
      strapline="infer 不是玄学，它做的就是结构匹配时的“提取”。"
      abstract="这道题真正想听的不是你会不会背 `ReturnType`，而是你是否知道 TypeScript 怎样从已有类型结构里抽出一段内部类型。"
      leadTitle="把 infer 放回条件类型和结构匹配的语境里"
      lead="如果把 infer 理解成“匹配到结构后，顺手把里面一段类型抓出来”，它就不再神秘。很多常见工具类型，其实都在做这件事。"
      answerOutline={[
        '先讲 infer 的本质是条件类型里的提取变量',
        '再举函数返回值和 Promise 拆包例子',
        '然后讲它和常见工具类型的关系',
        '最后说明 infer 必须依赖匹配结构',
      ]}
      quickAnswer="一句话答法：`infer` 可以理解成条件类型里的临时推导变量，用来在结构匹配成功时，把某一段内部类型提取出来。它常见于 `ReturnType`、`Parameters`、`Awaited`、`InstanceType` 等工具类型里，本质上都是在“从现有类型结构中抽取信息”。"
      pullQuote="infer 最关键的价值，不是生成类型，而是从结构里拿类型。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '优先用函数返回值和 Promise 两个例子解释 infer，最稳。',
        '一定补一句“infer 不是独立存在的，它依附于条件类型匹配”。',
        '列工具类型时最好说明它们在抽什么，而不只是报名字。',
      ]}
      mistakes={[
        '把 infer 说成万能推导器，脱离条件类型语境。',
        '只会背 ReturnType 的名字，不会解释原理。',
        '说不清 infer 和结构匹配之间的关系。',
      ]}
      singleColumn
    />
  );
}
