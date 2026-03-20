import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '泛型、联合类型、类型守卫、infer 和常见坑。' },
  { label: 'Core', value: 'Type Modeling', detail: 'TS 题的核心不是背语法，而是你会不会把数据关系表达清楚。' },
  { label: 'Scenes', value: '组件 / 接口', detail: '表单、接口响应、组件 props、工具类型里都经常出现。' },
] as const;

const definitions = [
  { title: '泛型是把类型也当参数传', detail: '它让一段逻辑在保持约束的前提下适配多种数据。' },
  { title: '联合类型表示“可能是这些类型之一”', detail: '关键不在写 `|`，而在缩小范围前不能乱用成员。' },
  { title: '类型守卫的本质是缩小类型范围', detail: '运行时代码告诉编译器：现在可以把值看成更具体的类型。' },
  { title: '`infer` 用来在条件类型里提取一部分类型信息', detail: '它经常出现在工具类型和函数返回值提取里。' },
  { title: 'TypeScript 只存在于开发和编译阶段', detail: '运行时没有 TS 类型，所以类型系统不能替代真正的数据校验。' },
  { title: '好的 TS 设计是帮助约束变化点', detail: '不是把所有代码都写成谜语类型。' },
] as const;

const relations = [
  { title: '泛型', detail: '同一套逻辑，服务多个具体类型。', signal: 'Reusable With Constraints' },
  { title: '联合类型', detail: '先承认不确定，再缩小范围。', signal: 'Narrow Before Use' },
  { title: '类型守卫', detail: '用运行时判断帮编译器收窄。', signal: 'Runtime Hint' },
  { title: 'infer', detail: '从已有类型结构里提取一部分。', signal: 'Extract Type Info' },
] as const;

const relationCode = `不确定的值
-> 先用联合类型表达
-> 通过守卫缩小范围
-> 需要复用时引入泛型
-> 需要提取结构时用 infer`;

const basics = [
  {
    title: '问题 1：泛型到底在解决什么问题？',
    answer: '它让你在不丢失类型信息的前提下复用逻辑，而不是一上来就把参数写成 `any`。',
    explanation: '回答时最好强调“复用”和“保留类型关系”。',
    code: `function pickFirst<T>(list: T[]): T | undefined {
  return list[0];
}`,
    codeTitle: 'Generic Function',
  },
  {
    title: '问题 2：联合类型和交叉类型怎么区分？',
    answer: '联合类型是“可能是 A 或 B”，交叉类型是“同时具备 A 和 B”。',
    explanation: '这类题不要只背符号，最好把语义讲出来。',
    code: `type Result = Success | Failure;
type UserWithMeta = User & { source: string };`,
    codeTitle: 'Union vs Intersection',
  },
  {
    title: '问题 3：为什么联合类型的值不能直接访问某些属性？',
    answer: '因为在没缩小范围之前，编译器无法保证每一种可能类型上都有这个属性。',
    explanation: '核心不是“TS 不聪明”，而是“当前信息还不够安全”。',
    code: `type Animal = { kind: 'cat'; meow: () => void } | { kind: 'dog'; bark: () => void };

function speak(animal: Animal) {
  if (animal.kind === 'cat') animal.meow();
}`,
    codeTitle: 'Narrow Union Before Use',
  },
  {
    title: '问题 4：类型守卫常见写法有哪些？',
    answer: '常见有 `typeof`、`instanceof`、`in`、判别字段，以及自定义谓词函数。',
    explanation: '这题说出“自定义类型谓词”通常会更加分。',
    code: `function isSuccess(value: ApiResult): value is SuccessResult {
  return value.ok === true;
}`,
    codeTitle: 'Custom Type Guard',
  },
] as const;

const practical = [
  {
    title: '问题 5：`infer` 最常见的实际用途是什么？',
    answer: '就是从现有类型结构里提取一部分类型，比如函数返回值、Promise 内部值、数组元素类型。',
    explanation: '如果只背语法，很容易显得抽象；说出“提取已有类型信息”会更落地。',
    code: `type UnwrapPromise<T> = T extends Promise<infer Value> ? Value : T;
type Result = UnwrapPromise<Promise<string>>;`,
    codeTitle: 'Infer Extraction',
  },
  {
    title: '问题 6：为什么不建议滥用 `any`？',
    answer: '因为一旦用了 `any`，后续很多约束都会断掉，类型系统给你的保护基本就消失了。',
    explanation: '工程里真正可怕的不是一个 `any`，而是它一路把调用链都污染掉。',
    code: `function request(data: any) {
  return data.user.name;
}`,
    codeTitle: 'Any Breaks Safety',
  },
  {
    title: '问题 7：组件开发里泛型常见在哪？',
    answer: '表格、下拉框、表单字段映射、请求封装这些高度复用但又要保留字段关系的地方特别常见。',
    explanation: '能把 TS 题拉回组件和业务，会更像真实项目经验。',
    code: `type SelectProps<T> = {
  options: T[];
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
};`,
    codeTitle: 'Generic Component Props',
  },
  {
    title: '问题 8：TypeScript 题最后怎么答得更成熟？',
    answer: '强调“类型是建模工具，不是炫技工具”，并把它和 API 约束、组件边界、可维护性联系起来。',
    explanation: '这会比单纯展示复杂工具类型更有说服力。',
    code: `类型设计目标
-> 表达真实数据关系
-> 约束高风险边界
-> 提升重构安全性`,
    codeTitle: 'TS Design Goal',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先看你是在表达不确定性还是复用关系', detail: '前者偏联合，后者偏泛型。' },
  { title: '第二步：遇到联合先缩小，再访问成员', detail: '这是 TS 题最常见的正确顺序。' },
  { title: '第三步：提取已有结构时再想 infer', detail: '不要一上来就把类型写成谜语。' },
  { title: '第四步：把类型设计拉回真实业务边界', detail: '类型最终是为了让协作和重构更稳。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 TS 题答成纯语法题', detail: '真正重要的是你能不能表达数据关系和使用边界。', points: ['建模', '约束', '可维护性'] },
  { title: '高频误区 2：联合类型不做缩小就硬访问属性', detail: '这正是 TS 不让你通过的地方。', points: ['先缩小', '再使用', '避免假设'] },
  { title: '高频误区 3：到处上 `any`', detail: '短期快，长期会把整个调用链的类型价值清空。', points: ['污染调用链', '失去提示', '重构风险上升'] },
  { title: '高频误区 4：为了炫技写过度复杂的类型', detail: '可读性差、维护成本高，团队往往不买账。', points: ['能表达就够', '清晰优先', '别过度嵌套'] },
] as const;

const rules = [
  { title: '泛型看复用，联合看不确定', detail: '先用这句快速判断题型。' },
  { title: '联合类型先缩小范围再操作', detail: '这是最稳的 TS 使用顺序。' },
  { title: 'infer 是提取，不是炫技', detail: '只在确实要从结构中拿类型信息时用。' },
  { title: '类型要服务业务边界', detail: '别让 TS 成为阅读障碍。' },
] as const;

export default function TypeScriptInterviewSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / TypeScript"
      title="TypeScript 常见题"
      lead="TypeScript 面试题经常被答成“语法背诵”，但真正有区分度的地方在于你能不能用类型把业务关系说清楚。这页重点放在泛型、联合类型、类型守卫和 infer 的实际理解方式。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把几类类型工具分清）"
      definitionsNote="用意：先知道每种能力在解决哪类问题。"
      definitions={definitions}
      relationsTitle="块 2：类型建模主线速览"
      relationsNote="用意：把泛型、联合、守卫、infer 放回同一条思考链。"
      relations={relations}
      relationCodeTitle="Type Modeling Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把泛型、联合和守卫答稳。', label: 'TS Basics', questions: basics },
        { title: '块 4：工程实践问题', note: '用意：再把 infer、组件开发和类型设计价值落到实际场景。', label: 'TS Practice', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 TS 类型题时按建模顺序来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把高频踩坑点提前拆掉。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆最稳的答题主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={engineeringTheme}
    />
  );
}
