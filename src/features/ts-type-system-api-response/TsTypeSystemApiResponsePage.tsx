import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心目标', value: '成功态、失败态、分页态等结构边界清晰' },
  { label: '关键做法', value: '泛型 + 可判别联合 + 边界校验' },
  { label: '常见反模式', value: '大对象堆一堆可选字段，制造非法状态' },
  { label: '真实场景', value: '请求封装、前后端契约、业务 SDK' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 类型安全的接口返回结构，重点不是统一包一层，而是排除非法状态',
    paragraphs: [
      '很多团队都会把接口结果统一包装成某种协议壳，比如 `{ code, message, data }`。这本身没问题，但真正决定类型安全的不是有没有统一壳，而是你有没有把不同状态之间的边界表达清楚。',
      '如果成功态、失败态、分页态全塞在一个大对象里，再用大量可选字段兜起来，就会让很多理论上不该出现的组合也通过类型检查，例如失败时却还能读到 data。',
      '所以这道题的第一原则，是让非法状态在类型层面尽量无法表达。',
    ],
  },
  {
    title: '2. 最稳的做法通常是用可判别联合区分成功态和失败态',
    paragraphs: [
      '例如统一用 `success: true | false` 或 `status: "success" | "error"` 作为判别字段，把成功态和失败态做成联合。这样调用方先判断状态，再访问 data 或 error，TypeScript 就能自动收窄到正确分支。',
      '相比大对象加可选字段，这种方式的最大优点是“成功态和失败态从定义上分开了”，而不是靠约定提醒开发者别乱用。',
      '所以面试里如果你能主动把“可判别联合”带出来，答案会明显更稳。',
    ],
    codeTitle: '成功态 / 失败态建模',
    code: `type ApiResult<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };`,
  },
  {
    title: '3. 泛型负责承接具体业务数据，而不是把协议结构写死',
    paragraphs: [
      '接口返回壳通常比较统一，但 `data` 部分可能完全不同：有时是用户详情，有时是列表，有时是分页结果，有时是统计结构。这时候响应结构最自然的做法就是泛型化。',
      '例如 `ApiResult<User>`、`ApiResult<Order[]>`、`ApiResult<PageResult<Product>>`。这样统一协议和具体业务载荷就能被清楚拆层。',
      '所以真正好的接口返回类型，通常不是某个写死结构，而是“协议壳 + 泛型数据”的组合。',
    ],
  },
  {
    title: '4. 如果要真的安全，运行时边界校验也要考虑进去',
    paragraphs: [
      'TypeScript 只能约束编译期，不能保证后端真的按约定返回。也就是说，即使你在代码里把响应定义得很漂亮，运行时仍然可能收到一个不合法对象。',
      '所以如果要把这题答完整，最好补一句：边界层需要运行时校验，例如 zod、io-ts 或手写 validator，把真实返回先验证，再进入强类型系统。',
      '这会让你的回答明显更有工程感，因为你没有把静态类型误当成运行时真相。',
    ],
  },
  {
    title: '5. 分页、错误码、traceId 等最好继续在协议层分层抽象',
    paragraphs: [
      '很多系统除了 data 和 error，还有分页信息、错误码、traceId、requestId、meta 等扩展协议字段。比较稳的设计方式是把这些协议概念继续拆层，而不是全部揉进 data。',
      '例如可以单独设计 `PageResult<T>` 承接分页数据，再由 `ApiResult<PageResult<T>>` 组合起来。这样层次更清晰，也更利于 SDK 和请求层封装。',
      '所以接口类型设计本质上也是协议建模问题。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答稳',
    paragraphs: [
      '先讲目标是避免非法状态；再讲成功失败态用可判别联合；然后补泛型承接业务数据；接着说明协议层和业务层分层；最后补运行时校验。',
      '一句话收尾可以这样说：类型安全的接口返回结构，核心是“统一协议壳 + 泛型载荷 + 可判别联合 + 边界运行时校验”。',
    ],
  },
];

export default function TsTypeSystemApiResponsePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="TypeScript Type System"
      company="面试-TypeScript 类型系统类"
      issue="Issue 05"
      title="如何设计一套类型安全的接口返回结构"
      strapline="真正的安全，不是字段凑齐，而是非法状态在类型上就写不出来。"
      abstract="这道题真正考的是协议建模能力。高分答案要同时覆盖成功失败态边界、泛型承载、运行时校验和协议层抽象。"
      leadTitle="从协议壳、状态判别到边界校验，把接口返回讲成完整契约"
      lead="如果你只说“我会定义一个 `ApiResponse<T>`”，答案会太薄。更完整的回答，应该强调统一协议壳只是起点，真正关键的是让成功态和失败态不混淆，并把边界真实性纳入考虑。"
      answerOutline={[
        '先讲目标是排除非法状态',
        '再讲成功/失败态可判别联合',
        '然后讲泛型和协议层分层',
        '最后补边界运行时校验',
      ]}
      quickAnswer="一句话答法：设计类型安全的接口返回结构时，我会先统一协议层，再用可判别联合明确区分成功态和失败态，避免一个大对象加很多可选字段制造非法状态；同时用泛型承接不同业务 `data` 类型，并在边界层增加运行时校验，确保返回结构既在编译期可推导，也在运行时可信。"
      pullQuote="统一响应壳不难，难的是让错误状态和成功状态别再混在一起。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲“避免非法状态”，比直接上代码更有高度。',
        '可判别联合是这题的关键得分点。',
        '补运行时校验会让答案更像真实工程经验。',
      ]}
      mistakes={[
        '只写 `ApiResponse<T>`，却没处理成功/失败态边界。',
        '用大对象可选字段堆协议，导致非法状态合法化。',
        '忽略运行时边界校验，以为 TypeScript 足够。',
      ]}
      singleColumn
    />
  );
}
