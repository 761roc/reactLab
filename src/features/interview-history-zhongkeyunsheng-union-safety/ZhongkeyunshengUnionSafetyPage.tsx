import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心目标', value: '让不同分支在使用时被正确收窄，而不是混成 any' },
  { label: '关键手段', value: '字面量区分字段 + 类型收窄 + 穷尽检查' },
  { label: '高频场景', value: '请求状态、组件状态机、事件模型、后端响应结构' },
  { label: '常见追问', value: 'discriminated union、never、类型守卫、switch' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 先把问题讲清：联合类型不是把类型堆在一起，而是描述“值可能属于哪几种合法形态”',
    paragraphs: [
      '很多人第一次看到 `type A = B | C`，会把它理解成“这个值同时拥有两边所有属性”，这正是很多类型错误的起点。联合类型真正表达的是：一个值在运行时只会落入若干合法形态中的一种，而不是几种形态的并集对象。',
      '举个最常见的例子，请求状态可能是 loading、success、error 之一。它们共享一部分语义，但每种状态下能访问的数据并不一样。你只有先判断当前到底是哪一种状态，才能安全地访问对应字段。',
      '因此“type 做联合类型如何确保类型安全”这道题，本质不是问你会不会写 `|`，而是问你能否把“多种可能形态”管理成可判别、可收窄、可穷尽检查的结构。',
    ],
    bullets: [
      '联合类型表达的是“多种可能之一”，不是属性无脑叠加。',
      '类型安全的关键是先区分当前分支，再访问该分支特有字段。',
      '只写 `|` 不足以安全，后续收窄机制才是重点。',
    ],
    codeTitle: '联合类型的基本含义',
    code: `type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };`,
  },
  {
    title: '2. 最稳的方案是用可判别联合：给每个分支一个稳定的字面量标识',
    paragraphs: [
      '在 TypeScript 里，最推荐的联合类型设计方式是 discriminated union，也就是“可判别联合”。做法很简单：给每个分支都放一个相同字段名、但不同字面量值的标识字段，比如 `type`、`kind`、`status`。',
      '这样一来，TypeScript 就可以根据这个字段做自动类型收窄。你只要判断 `status === "success"`，编译器就知道当前分支一定是成功态，因此 `data` 字段是安全可访问的。',
      '这就是类型安全的第一道门槛：不要让联合成员之间只靠“隐约不同的属性”去区分，而要主动设计一个可判别字段，让编译器和开发者都能清楚地识别分支。',
    ],
    bullets: [
      '字段名统一，字段值不同，最利于编译器收窄。',
      '常见判别字段名有 `type`、`kind`、`status`。',
      '比起靠 `in` 到处猜字段，可判别联合更清晰、可维护。',
    ],
    codeTitle: '可判别联合示例',
    code: `type PaymentResult =
  | { kind: "cash"; amount: number }
  | { kind: "coupon"; code: string }
  | { kind: "points"; score: number };

function handlePayment(result: PaymentResult) {
  if (result.kind === "coupon") {
    return result.code;
  }
}`,
  },
  {
    title: '3. 类型安全依赖“收窄”过程：先判断，再访问',
    paragraphs: [
      '联合类型本身只是把可能性列出来，真正保证安全的是“收窄”。收窄的意思是：通过条件判断、`switch`、`in`、`typeof`、`instanceof` 或自定义类型守卫，把一个宽泛的联合类型缩小成某个确定分支。',
      '只有在收窄完成后，访问该分支特有属性才是安全的。比如 `state.data` 只有在 `state.status === "success"` 成立时才合理；如果你在联合尚未收窄时直接访问，TypeScript 就应该报错。',
      '所以联合类型的正确使用习惯不是“我知道运行时大概率是成功态，所以先取再说”，而是“先让类型系统知道我已经判断过当前分支”。这就是编译期安全和业务判断的结合点。',
    ],
    bullets: [
      '常见收窄方式：`if`、`switch`、`in`、`typeof`、自定义 guard。',
      '先收窄再访问，是联合类型最核心的使用习惯。',
      '编译器不相信“你心里知道”，只相信显式判断。',
    ],
    codeTitle: '先收窄再访问字段',
    code: `function renderState(state: RequestState) {
  if (state.status === "loading") {
    return "loading...";
  }

  if (state.status === "error") {
    return state.message;
  }

  return state.data.join(", ");
}`,
  },
  {
    title: '4. 进一步确保安全，通常要加穷尽检查：让新分支漏处理时在编译期直接报错',
    paragraphs: [
      '很多人能做到“会收窄”，但做不到“收得完整”。真正稳的联合类型设计，还要考虑未来扩展。比如今天只有 loading、success、error 三种状态，明天新增了 empty。如果你忘了在处理逻辑里加这个分支，业务可能就 silently 出错。',
      '这时就该用穷尽检查，也就是 exhaustive check。最常见写法是在 `switch` 的 `default` 分支里把当前变量赋给 `never`。如果还有未覆盖分支，TypeScript 会直接报错，提醒你这里没有处理完整。',
      '这一步非常能体现你对类型安全的理解，因为它不是只保证“当前能跑”，而是保证“未来加分支时不会漏掉”。',
    ],
    bullets: [
      '穷尽检查适合联合成员数量明确且随时间可能扩展的场景。',
      '`never` 常用于兜底校验“已经没有剩余分支”。',
      '这能把“漏处理分支”的问题前移到编译期。',
    ],
    codeTitle: 'never 做穷尽检查',
    code: `function assertNever(value: never): never {
  throw new Error("Unexpected value: " + JSON.stringify(value));
}

function render(state: RequestState) {
  switch (state.status) {
    case "loading":
      return "loading";
    case "success":
      return state.data.join(",");
    case "error":
      return state.message;
    default:
      return assertNever(state);
  }
}`,
  },
  {
    title: '5. 自定义类型守卫也是确保联合类型安全的重要工具',
    paragraphs: [
      '当你的判断逻辑比较复杂，或者联合分支不能单靠一个简单判断搞定时，自定义类型守卫会非常有用。它允许你把“如何识别某个分支”提炼成一个可复用函数，同时告诉 TypeScript：只要这个函数返回 true，传入值就应被视为某个更具体的类型。',
      '这样做的好处是两层的。第一，业务判断逻辑不会散落在各个地方；第二，类型收窄能力被封装起来，调用方既拿到运行时判断，也拿到编译时推断。',
      '面试里如果被追问“除了 switch 还有什么方式保证安全”，自定义类型守卫就是一个很好的补充点。',
    ],
    bullets: [
      '适合复杂判断或重复判断逻辑。',
      '函数签名里的 `value is Xxx` 是关键。',
      '同时服务运行时判断和编译时收窄。',
    ],
    codeTitle: '自定义类型守卫',
    code: `type Animal =
  | { kind: "cat"; meow: () => void }
  | { kind: "dog"; bark: () => void };

function isCat(animal: Animal): animal is Extract<Animal, { kind: "cat" }> {
  return animal.kind === "cat";
}`,
  },
  {
    title: '6. 真正高频的业务场景，是把联合类型当作状态机或协议模型来设计',
    paragraphs: [
      '联合类型在业务里最有价值的地方，不是写几个示例动物，而是描述“一个对象在不同阶段允许出现哪些合法结构”。这其实就是状态机思维。比如请求状态、支付流程、订单状态、表单提交流程、WebSocket 消息协议，天然都适合用联合类型建模。',
      '这种写法比“一个大对象里全是可选字段”安全得多。因为可选字段模型往往让你写出“既没有 data 又没有 error，但 status 说 success”的非法状态；而可判别联合可以直接把这种非法组合排除掉。',
      '换句话说，联合类型真正的价值不只是类型提示更友好，而是它能帮助你在类型层面表达“哪些状态组合是合法的，哪些从定义上就不允许存在”。',
    ],
    bullets: [
      '比“大对象 + 一堆可选字段”更能避免非法状态。',
      '适合协议、流程、状态机和消息建模。',
      '类型安全其实来自“非法状态不可表达”。',
    ],
    codeTitle: '避免非法状态的联合设计',
    code: `type AsyncData<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };`,
  },
  {
    title: '7. 常见不安全写法，往往不是联合类型本身的问题，而是设计和使用方式的问题',
    paragraphs: [
      '最常见的坑有三个。第一，没有区分字段，导致成员之间难以判别，只能到处写断言。第二，把很多字段都写成可选字段，结果制造出大量理论上不该存在的非法组合。第三，明明是联合类型，却一上来就用 `as` 强行断言，等于绕过了类型系统。',
      '如果你频繁需要 `as SomeType` 才能访问字段，通常不是 TypeScript 太严格，而是你的联合设计不够清晰。一个好的联合类型，应该让大多数场景都能靠收窄自然访问，而不是靠断言“骗过”编译器。',
      '所以这道题的高分答案里，除了讲正确做法，也最好顺手指出：避免过度断言、避免滥用可选字段、避免模糊分支边界。这能体现你不仅会用，还知道什么用法不稳。',
    ],
    bullets: [
      '少用 `as` 暴力断言，多用可判别字段和收窄。',
      '避免把联合成员做成“模糊大对象”。',
      '设计清晰，类型安全才能自然成立。',
    ],
    codeTitle: '不推荐的大对象可选字段模型',
    code: `type BadState = {
  status: "loading" | "success" | "error";
  data?: string[];
  message?: string;
};`,
  },
  {
    title: '8. 面试里怎样回答这题最完整',
    paragraphs: [
      '一个很稳的答题顺序是：先说联合类型表达“值属于多种合法形态之一”；再说要用可判别字段设计成 discriminated union；接着说明使用时必须通过 `if`、`switch` 或 guard 做收窄；然后补 `never` 穷尽检查，防止未来漏分支；最后落到真实业务里的状态机和协议建模。',
      '如果面试官继续追问“为什么这比可选字段更安全”，你就回答：因为联合类型能把非法状态排除在类型定义之外，而不是等运行时再碰运气。这个回答非常稳。',
      '最后可以用一句话收尾：联合类型的安全，不是来自 `|` 这个符号本身，而是来自“可判别设计 + 显式收窄 + 穷尽检查”这一整套约束。',
    ],
  },
];

export default function ZhongkeyunshengUnionSafetyPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 04"
      title="type 做联合类型如何确保类型安全"
      strapline="联合类型的重点不在于会不会写 `|`，而在于你能不能把分支设计成可判别、可收窄、可穷尽检查。"
      abstract="这道题考的是 TypeScript 建模能力。联合类型如果只停留在语法层面，很容易写出模糊对象和大量断言；真正安全的做法，是用 discriminated union 把状态和协议设计清楚，让非法状态从类型定义上就无法出现。"
      leadTitle="把联合类型从“多个可能”变成“受控分支模型”"
      lead="联合类型真正强大的地方，不只是说“这个值可能是 A 或 B”，而是能进一步表达：每种分支各自有哪些字段、应该怎么判断、如何保证未来新增分支时不会漏处理。回答这题时，最好围绕可判别字段、类型收窄和穷尽检查展开。"
      answerOutline={[
        '先讲联合类型描述的是“多种合法形态之一”',
        '再讲可判别联合如何帮助编译器自动收窄',
        '然后讲 if/switch/guard 与 never 穷尽检查',
        '最后落到状态机、协议模型和常见误区',
      ]}
      quickAnswer="一句话答法：type 做联合类型想确保类型安全，核心不是只写 `A | B | C`，而是把每个分支设计成带有稳定字面量标识的可判别联合，然后在使用时通过 `if`、`switch` 或自定义类型守卫进行收窄，并在需要时用 `never` 做穷尽检查。这样才能保证访问字段时分支明确、未来新增成员时不会漏处理。"
      pullQuote="联合类型的真正安全，来自“先判别，再收窄，再穷尽检查”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲“联合类型表示多种形态之一”，再讲 discriminated union，不要一上来就丢术语。',
        '一定要把 `never` 穷尽检查提一下，这是这道题很加分的点。',
        '举业务例子时优先选请求状态、支付状态、消息协议，这些最容易让面试官共鸣。',
      ]}
      mistakes={[
        '把联合类型误解成同时拥有所有属性，导致访问字段时逻辑混乱。',
        '只会写 `|`，不会设计区分字段，也不会做收窄和穷尽检查。',
        '用一个大对象加很多可选字段替代联合类型，制造出大量非法状态。',
      ]}
      singleColumn
    />
  );
}
