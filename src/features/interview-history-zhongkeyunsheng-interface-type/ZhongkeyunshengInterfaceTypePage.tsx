import {
  InterviewEditorialPage,
  type EditorialComparisonTable,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '共同点', value: '都能描述对象结构，也都支持泛型' },
  { label: '核心差异', value: 'interface 可合并，type 可表达任意类型别名' },
  { label: '高频场景', value: '公共契约 vs 联合/映射/条件类型' },
  { label: '答题重点', value: '先讲重叠区，再讲边界和实践选择' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 先讲相同点：定义对象结构时，interface 和 type 的重叠区很大',
    paragraphs: [
      '如果只是描述一个普通对象结构，比如用户信息、组件 props、接口返回体，那么 `interface User { name: string }` 和 `type User = { name: string }` 在很多场景下都能工作。函数参数、返回值、泛型约束里，你都能看到二者出现。',
      '因此这道题最忌讳开口就说“它们完全不一样”。面试官真正想听的不是你背一个口号，而是你先承认二者在对象建模上的重叠，再讲清它们真正的分界线在哪里。',
      '先把这个前提说出来，会显得你不是在背模板，而是在按真实的 TypeScript 使用体验作答。',
    ],
    codeTitle: '对象结构场景下二者都能工作',
    code: `interface UserProfile {
  id: string;
  name: string;
}

type UserProfileAlias = {
  id: string;
  name: string;
};`,
  },
  {
    title: '2. interface 更偏“对象契约”，最大的特征是 declaration merging',
    paragraphs: [
      '`interface` 最大的独特能力是同名声明合并。也就是说，同名接口在不同位置再次声明时，TypeScript 会自动把它们合并成一个更完整的接口。这在扩展全局对象、增强第三方库类型、补充 DOM 或 window 类型时非常常见。',
      '除此之外，`interface extends` 的语义也比较贴近“继承一个对象契约”，所以当你定义的是可扩展的公共数据结构、组件 props 基础接口、SDK 暴露模型时，`interface` 的意图通常更清晰。',
      '因此你可以把 interface 理解成“面向对象结构和可扩展契约”的写法。它不是只能定义对象，但它在对象契约这件事上语义最强。',
    ],
    bullets: [
      '同名 interface 可以合并，这一点非常关键。',
      '适合公共 API、库类型增强、全局声明扩展。',
      '类通过 implements interface 表达契约也最自然。',
    ],
    codeTitle: 'declaration merging 示例',
    code: `interface Window {
  appVersion: string;
}

interface Window {
  trackEvent(name: string): void;
}

window.appVersion;
window.trackEvent("open");`,
  },
  {
    title: '3. type 更偏“类型表达式别名”，强项是组合和运算',
    paragraphs: [
      '`type` 的价值不止是给对象起别名，它几乎可以给任意类型表达式起名字。比如联合类型、交叉类型、元组、字面量联合、条件类型、映射类型、工具类型，这些都是 type alias 的核心舞台。',
      '一旦问题进入“类型运算”的领域，通常就会转向 `type`。例如你要表达 `A | B`、按条件决定返回类型、根据 `keyof` 批量映射属性、或者定义一组字符串字面量状态，`type` 都比 `interface` 更直接。',
      '所以可以把 type 理解为“类型层面的别名工具”。它的适用范围更广，不只面向对象结构，而是面向整个 TypeScript 类型系统的表达能力。',
    ],
    bullets: [
      '联合类型、元组、条件类型、映射类型都更适合 type。',
      '很多内置工具类型本质上也是 type alias。',
      '只要涉及类型计算，通常优先想到 type。',
    ],
    codeTitle: 'type 更擅长的类型表达',
    code: `type RequestStatus = "idle" | "loading" | "success" | "error";

type Point = [number, number];

type ReadonlyFields<T> = {
  readonly [K in keyof T]: T[K];
};

type ApiResult<T> = T extends Error ? never : { data: T };`,
  },
  {
    title: '4. 它们不是互斥关系，真实项目里经常配合使用',
    paragraphs: [
      '`interface` 可以 `extends` 一个最终解析为对象结构的 type alias；反过来，`type` 也可以通过交叉类型 `&` 把多个 interface 组合起来。所以工程里二者不是二选一，而是看当前问题更像“声明一个公共对象契约”，还是“做一段类型表达与计算”。',
      '一个非常稳的实践建议是：对外暴露、希望未来可继续扩展的对象模型优先用 `interface`；内部复杂类型组合、联合状态、工具类型和映射推导优先用 `type`。这样既照顾语义，也照顾表达能力。',
      '这种回答方式比“永远用 interface”或“type 完全能替代 interface”更接近真实项目，也更容易让面试官认可。',
    ],
    codeTitle: 'interface 与 type 配合使用',
    code: `type Timestamped = {
  createdAt: string;
};

interface UserEntity extends Timestamped {
  id: string;
  name: string;
}

type UserCardProps = UserEntity & {
  mode: "compact" | "full";
};`,
  },
  {
    title: '5. 面试里真正容易失分的，不是记不住概念，而是结论说得太绝对',
    paragraphs: [
      '如果你只说“能用 interface 就不用 type”，面试官很可能会继续追问联合类型、工具类型、声明合并，然后你就容易露出边界不清的问题。相反，如果你把答案建立在“相同点很多，但场景不同”上，整体会更稳。',
      '另外，也不要轻易重复“interface 性能更好”之类脱离上下文的说法。对绝大多数业务代码而言，真正重要的是语义清晰、扩展方式正确、团队规范统一，而不是把这题说成编译器性能玄学。',
      '总结时记住一句就行：interface 更像可扩展对象契约，type 更像通用类型表达式别名。对象契约和类型运算，是这道题最核心的两条主线。',
    ],
  },
];

const comparisonTable: EditorialComparisonTable = {
  title: 'interface / type 高频比较表',
  intro:
    '表格只是帮助你快速定锚。真正答题时，最好把“为什么适合这个场景”也说出来，而不是只丢一个结论。',
  headers: ['维度', 'interface', 'type'],
  rows: [
    ['对象结构声明', '可以', '可以'],
    ['声明合并', '支持', '不支持'],
    ['联合类型', '不适合主表达', '强项'],
    ['元组', '不适合', '直接支持'],
    ['条件 / 映射类型', '基本不做这类表达', '核心能力'],
    ['公共可扩展 API', '更常见', '可用，但语义没那么强'],
    ['复杂工具类型', '不擅长', '更自然'],
  ],
};

export default function ZhongkeyunshengInterfaceTypePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 02"
      title="interface 和 type 的区别"
      strapline="相同点很多，但 declaration merging 与类型表达能力，是这道题最关键的分界线。"
      abstract="这题最容易被答成一句“能用 interface 就不用 type”。那样太薄。更稳的说法是先承认二者在对象建模上的重叠，再明确 interface 偏对象契约，type 偏类型表达与运算。"
      leadTitle="TypeScript 里对象契约与类型表达式的边界"
      lead="这道题并不是要你背一个唯一答案，而是看你是否知道：什么时候只是定义对象形状，什么时候其实是在做类型组合和计算。把“声明合并”和“任意类型表达式别名”这两个点说透，答案就会很完整。"
      answerOutline={[
        '先说二者在对象结构定义上重叠很大',
        '再说 interface 的声明合并和对象契约语义',
        '然后说 type 在联合、映射、条件类型上的表达优势',
        '最后给出项目实践里的选择原则，避免结论绝对化',
      ]}
      quickAnswer="一句话答法：interface 和 type 都能描述对象结构，但 interface 更偏可扩展的对象/类契约，支持同名声明合并；type 更偏通用类型表达式别名，不仅能描述对象，还能描述联合、元组、交叉、条件类型、映射类型等。实践上，可扩展公共对象契约常用 interface，复杂类型组合和工具类型场景更常用 type。"
      pullQuote="如果这个类型未来要给别人扩展，优先想到 interface；如果你在做类型运算，优先想到 type。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲共同点，再讲差异，最后落到实践建议，这样逻辑最稳。',
        '被问到 props 更喜欢用哪个时，可以回答“看团队规范，但可扩展对象契约偏 interface，复杂联合与工具类型偏 type”。',
        '被追问类能否实现 type 时，补一句“类可以 implements 一个对象形状的 type alias”。',
      ]}
      mistakes={[
        '上来只背“能用 interface 就不用 type”，没有解释语义和边界。',
        '忽略 declaration merging，导致 interface 的独特价值没有讲出来。',
        '没提到 union、tuple、mapped type、conditional type，导致 type 的优势场景说不完整。',
      ]}
      comparisonTable={comparisonTable}
      singleColumn
    />
  );
}
