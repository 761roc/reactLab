import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '一句话理解', value: '让类型像参数一样可传入、可复用、可约束' },
  { label: '核心收益', value: '复用逻辑同时保留类型信息，不退化成 any' },
  { label: '高频位置', value: '函数、接口、类型别名、类、工具类型、库 API' },
  { label: '常见追问', value: '约束、默认类型、infer、实际业务场景' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 先用一句人话解释：泛型就是“给类型留一个参数”',
    paragraphs: [
      '很多人一听到泛型就开始背 `<T>`、`extends`、`keyof`，结果把这题答得很技术细节，却没有先把核心概念讲明白。更稳的说法是：泛型就是把“未来才能确定的具体类型”抽出来，先写成一个类型参数，等真正使用时再传进去。',
      '如果没有泛型，你想写一个“返回传入值”的函数，可能要么写死成 `string` 版本、`number` 版本各一份，要么直接写成 `any`。前者重复，后者丢类型。泛型的价值就在于：逻辑只写一份，但返回值仍然和输入值保持精确对应。',
      '所以泛型不是为了让类型更复杂，而是为了在“复用逻辑”和“保留类型信息”之间取得平衡。面试时如果先把这句讲清，再往下展开，整体会自然很多。',
    ],
    bullets: [
      '泛型的本质不是某个语法，而是“类型参数化”。',
      '它解决的是复用时类型丢失的问题。',
      '最典型的对照就是 `any` 和“多个重复版本函数”。',
    ],
    codeTitle: '最小泛型示例',
    code: `function identity<T>(value: T): T {
  return value;
}

const a = identity<string>("hello");
const b = identity(123);`,
  },
  {
    title: '2. 为什么需要泛型：因为很多逻辑结构相同，但处理的数据类型不固定',
    paragraphs: [
      '真实开发里，经常会遇到“算法逻辑相同，但数据类型不一样”的场景。比如拿数组第一个元素、把结果包成统一响应结构、缓存某个值、封装表单字段、定义请求函数，这些逻辑本身并不依赖某一个具体类型。',
      '如果不用泛型，你就会走向两个极端：一种是重复写很多版本，例如 `getFirstString`、`getFirstNumber`、`getFirstUser`；另一种是偷懒写成 `any`，导致调用方拿到的结果没有任何类型保护。泛型的出现，就是为了让你写一份通用逻辑，同时把具体类型从调用处带回来。',
      '因此你可以把泛型理解成“类型世界里的函数参数”。函数参数解决运行时值的复用，泛型参数解决编译时类型的复用。这个类比在面试里非常好用。',
    ],
    bullets: [
      '不使用泛型，通常只能在“重复代码”和“丢失类型”之间选一个。',
      '泛型让类型信息从调用方流回函数、类或接口内部。',
      '函数参数之于值，泛型参数之于类型。',
    ],
    codeTitle: '不用泛型 vs 使用泛型',
    code: `function getFirstNumber(list: number[]) {
  return list[0];
}

function getFirstString(list: string[]) {
  return list[0];
}

function getFirst<T>(list: T[]): T | undefined {
  return list[0];
}`,
  },
  {
    title: '3. 泛型最常出现的地方之一，是函数：输入类型决定输出类型',
    paragraphs: [
      '函数泛型是最基础也最常被问到的场景。它的关键不在于你会不会写 `<T>`，而在于你知道：当函数的返回类型依赖输入类型时，泛型就是最自然的表达方式。',
      '比如一个 `wrapInArray` 函数，传入 `string` 就应该得到 `string[]`，传入 `User` 就应该得到 `User[]`。这里的核心关系是“输入和输出同源”，而不是单纯声明一个固定的联合类型。',
      '面试官通常想看你是否理解这种“类型跟着数据流动”的感觉。只要你能把“调用方决定具体 T 是什么”讲出来，函数泛型这块就答得比较稳。',
    ],
    bullets: [
      '函数泛型常见于“返回值依赖参数类型”的情况。',
      '很多封装函数、请求函数、工具函数都离不开它。',
      '调用时可以显式传类型，也常常能靠推导自动得到。',
    ],
    codeTitle: '函数泛型与类型推导',
    code: `function wrapInArray<T>(value: T): T[] {
  return [value];
}

const names = wrapInArray("Rocm");   // string[]
const ids = wrapInArray(101);        // number[]`,
  },
  {
    title: '4. 泛型也常用于接口、类型别名和类，用来表达“结构可复用，但内部字段类型可变化”',
    paragraphs: [
      '除了函数，泛型还经常挂在接口、类型别名和类上。最典型的例子是统一响应结构：无论返回用户、商品还是订单，外层结构都可能是 `{ code, message, data }`，只有 `data` 的具体类型不一样。这时就适合写成 `ApiResponse<T>`。',
      '类的场景也类似。比如一个 `StorageBox<T>`，你希望它可以存 `string`，也可以存 `User`，但同一个实例内部保持一致的类型约束。这里泛型描述的是“这个结构未来装什么，由实例化时决定”。',
      '所以当一个“结构模板”固定、但内部某些字段或成员类型需要变化时，泛型接口、泛型类型别名和泛型类就会非常合适。',
    ],
    bullets: [
      '接口/类型别名适合统一数据结构模板。',
      '类适合统一行为模板，但存储数据类型在实例化时决定。',
      '像 `Promise<T>`、`Map<K, V>`、`Set<T>` 都属于这种模式。',
    ],
    codeTitle: '泛型接口 / 类型别名 / 类',
    code: `type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

class StorageBox<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }
}`,
  },
  {
    title: '5. 约束泛型同样重要：不是所有 T 都能做任何事',
    paragraphs: [
      '很多初学者把泛型理解成“任意类型都行”，然后一上来就在函数里写 `value.length`，结果 TypeScript 报错。原因很简单：如果 T 可以是任何类型，那它未必一定有 `length` 属性。',
      '这时就要用到泛型约束，也就是 `T extends Xxx`。它表示：T 虽然还是一个待定类型，但它至少要满足某个最小结构。比如你只要求“这个值必须有 `length` 属性”，那就可以约束成 `T extends { length: number }`。',
      '面试里如果你能讲到这一层，说明你知道泛型不是无限制自由发挥，而是“在抽象和边界之间做控制”。这是很加分的。',
    ],
    bullets: [
      '泛型负责抽象，约束负责边界。',
      '常见组合是 `extends`、`keyof`、索引访问类型。',
      '很多高级泛型题本质上都是“加约束再做映射或推导”。',
    ],
    codeTitle: '泛型约束示例',
    code: `function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
  },
  {
    title: '6. 泛型在业务里最常见的使用面：接口返回、组件封装、Hook、表单和工具类型',
    paragraphs: [
      '如果面试官问“泛型都用在哪些方面”，不要只答函数和类，那太教科书。更好的回答是落到业务层：请求封装里的 `request<T>()`，用于描述接口返回数据；React 里自定义 Hook 的返回值和参数关联；组件库里表格、表单、下拉框之类根据数据模型推导字段；以及 TypeScript 工具类型对对象属性做批量加工。',
      '例如一个表格组件 `<Table<T>>`，你传什么行数据结构进去，列定义、渲染函数、点击回调都应该跟着变成对应的类型。又比如 `useRequest<T>()`，你请求用户列表时得到 `User[]`，请求订单详情时得到 `OrderDetail`。这些都离不开泛型。',
      '真正成熟的回答，不是说“泛型用在很多地方”，而是能指出：凡是存在“模板固定，但具体数据类型由使用方决定”的场景，泛型都非常高频。',
    ],
    bullets: [
      '请求封装：`request<T>()`、`ApiResponse<T>`',
      'React / Hook：`useRequest<T>()`、泛型组件 Props',
      '工具类型：`Partial<T>`、`Pick<T, K>`、`Record<K, T>`',
    ],
    codeTitle: '业务里常见的泛型接口',
    code: `async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as Promise<T>;
}

const users = await request<{ id: string; name: string }[]>("/api/users");`,
  },
  {
    title: '7. 高级一点的泛型题，通常会和条件类型、映射类型、infer 一起出现',
    paragraphs: [
      '面试深入一点时，泛型往往不会单独出现，而是和条件类型、映射类型、`infer` 一起考。因为真正强大的地方不只是“传一个 T”，而是“根据 T 进一步计算出新类型”。',
      '比如 `ReturnType<T>` 会从函数类型里推导返回值，`Parameters<T>` 会推导参数元组，很多你日常在用的工具类型，底层都是“泛型 + 条件类型 + infer”的组合。',
      '如果你不想把答案讲得太硬核，可以简单说：基础泛型解决复用，进阶泛型解决类型计算。这样既点到为止，又不会显得浅。',
    ],
    bullets: [
      '基础层：参数化类型。',
      '进阶层：基于 T 做判断、映射和推导。',
      '很多内置工具类型都是这一套组合。',
    ],
    codeTitle: 'infer 示例',
    code: `type MyReturnType<T> = T extends (...args: never[]) => infer R ? R : never;

type Result = MyReturnType<() => Promise<string>>; // Promise<string>`,
  },
  {
    title: '8. 面试里怎样把“泛型”讲得既清楚又不空泛',
    paragraphs: [
      '一个很稳的答题顺序是：先解释泛型本质是“类型参数化”；再说明它解决的是复用逻辑时类型信息丢失的问题；然后按函数、接口/类型别名、类、工具类型、业务封装几个层面举例；最后补一句泛型约束和进阶用法。',
      '如果你只会写语法，很容易把这题答成碎片知识点堆砌；但如果你能把它归纳成“让模板复用，同时让具体类型由调用方决定”，整个回答就会非常有主线。',
      '总结一句最适合收尾的话是：泛型让 TypeScript 的抽象不是建立在 `any` 之上，而是建立在“可复用且有类型约束的模板”之上。',
    ],
  },
];

export default function ZhongkeyunshengGenericsPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 03"
      title="如何理解 TS 中的泛型，都用在哪些方面"
      strapline="泛型的重点不是 `<T>` 这个符号，而是“类型也能像参数一样被传入和复用”。"
      abstract="这道题本质上考的是你是否理解 TypeScript 的抽象能力。泛型不是为了炫技，而是为了在复用逻辑时仍然保留精确类型，让代码摆脱重复和 any。"
      leadTitle="把“类型参数化”讲成人话，再落到真实业务场景"
      lead="如果只背语法，这题会很空。更好的回答方式是先讲泛型解决什么问题，再讲它最常出现在哪些位置，最后补约束和进阶能力。只要围绕“模板复用 + 类型不丢”这条主线展开，答案就很完整。"
      answerOutline={[
        '先讲泛型本质是给类型留参数',
        '再讲它解决复用逻辑时的类型丢失问题',
        '然后按函数、接口/类、业务封装、工具类型展开使用场景',
        '最后补充约束、infer 和实际面试答法',
      ]}
      quickAnswer="一句话答法：TypeScript 泛型就是把类型做成参数，让一份逻辑模板在不同类型下复用，同时保留精确的类型关系。它最常用在函数、接口、类型别名、类、请求封装、组件和工具类型里；当你需要“逻辑结构固定，但具体数据类型由使用方决定”时，泛型通常就是最自然的方案。"
      pullQuote="函数参数复用的是值，泛型参数复用的是类型。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲“为什么需要泛型”，再讲“泛型怎么写”，顺序不要反过来。',
        '回答使用场景时尽量落到真实业务：请求封装、Hook、组件库、工具类型。',
        '如果被追问高级一点的点，顺手补 `extends`、`keyof`、`infer` 就够了。',
      ]}
      mistakes={[
        '只会背 `<T>` 语法，不会解释泛型到底解决什么问题。',
        '把泛型回答成“任何类型都可以”，却说不清约束为什么重要。',
        '使用场景只答函数和类，没有落到接口返回、Hook、组件和工具类型。',
      ]}
    />
  );
}
