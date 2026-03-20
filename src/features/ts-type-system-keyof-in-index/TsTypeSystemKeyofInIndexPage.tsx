import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: 'keyof', value: '拿对象类型的键名联合' },
  { label: 'in', value: '遍历联合键名并生成新结构' },
  { label: 'T[K]', value: '通过键取对应属性类型' },
  { label: '主线', value: '拿 key -> 遍历 key -> 取 value type' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 这三个概念最好放在一条链上理解，而不是分散死记',
    paragraphs: [
      '如果把 `keyof`、`in`、索引访问类型拆开去记，很容易越学越碎。更稳的理解方式是把它们放在同一条对象类型计算链上：先拿到一个对象类型的 key 集合，再遍历这些 key 去生成新结构，最后通过 key 取出对应属性类型。',
      '因此一句最直观的话就是：`keyof` 负责拿 key，`in` 负责遍历 key，`T[K]` 负责拿 value type。',
      '只要这个顺序先立住，后面为什么它们会频繁一起出现就很容易理解了。',
    ],
  },
  {
    title: '2. keyof：解决“如何把对象类型的属性名提取出来”',
    paragraphs: [
      '`keyof` 的作用是把对象类型的所有属性名提出来，组成联合类型。比如 `keyof User` 可能得到 `"id" | "name"`。',
      '它的价值在于让“属性名”本身进入类型系统，从而可以被约束、推导和复用。很多类型安全 API 的第一步，都是先用 `keyof` 把合法字段范围限定出来。',
      '所以 `keyof` 最核心的作用，就是把对象结构里的 key 抽象成一个可运算的联合类型。',
    ],
    codeTitle: 'keyof 示例',
    code: `type User = {
  id: string;
  name: string;
};

type UserKeys = keyof User;`,
  },
  {
    title: '3. 索引访问类型 T[K]：解决“拿到 key 后，如何反推出对应值类型”',
    paragraphs: [
      '如果 `keyof` 把合法字段名拿出来，那么 `T[K]` 就是在说：给定对象类型 T 和某个键 K，请告诉我这个键对应的属性类型是什么。',
      '例如 `User["name"]` 会得到 `string`。如果 K 本身是联合，`T[K]` 也会得到多个属性类型组成的联合。',
      '这一步在安全读取函数、表单字段映射、组件列配置设计中都非常常见，因为你需要从 key 反推 value 的类型。',
    ],
  },
  {
    title: '4. in：解决“如何遍历一组 key，并按规则批量生成新对象类型”',
    paragraphs: [
      '`in` 最典型的场景是 mapped type。它像类型系统里的 for-in，用来遍历一组键名，并为每个键生成新的属性定义。',
      '比如 `readonly [K in keyof T]: T[K]`，就是对 T 的每个属性做一次遍历，再给它们统一加上 readonly。',
      '因此 `in` 不是拿 key，也不是取 value，它负责的是“批量重建结构”。',
    ],
    codeTitle: 'in 用于映射类型',
    code: `type ReadonlyFields<T> = {
  readonly [K in keyof T]: T[K];
};`,
  },
  {
    title: '5. 真正常见的是三者组合使用，而不是单独出现',
    paragraphs: [
      '对象类型工具几乎都在做类似事情：先用 `keyof T` 拿到键集合，再用 `[K in ...]` 遍历这些键，最后用 `T[K]` 把原值类型带回来。这就是 `Partial<T>`、`Readonly<T>`、很多自定义工具类型背后的骨架。',
      '所以面试里最值得讲的不是单个语法点，而是它们如何一起构成对象类型计算链路。',
      '一句浓缩总结就是：拿 key、遍历 key、带回 value type。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答稳',
    paragraphs: [
      '先给出三者的职责分工；再分别举一个简单示例；然后说明它们为什么经常被一起使用；最后落到工具类型和业务场景，比如安全读取字段、重建表单 schema、重写接口结构。',
      '一句话收尾可以这样说：`keyof`、`in`、索引访问类型是对象类型计算的三件套，一个负责拿 key，一个负责遍历 key，一个负责带出值类型。',
    ],
  },
];

export default function TsTypeSystemKeyofInIndexPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="TypeScript Type System"
      company="面试-TypeScript 类型系统类"
      issue="Issue 02"
      title="keyof、in、索引访问类型分别解决什么问题"
      strapline="别拆开背，把它们放回对象类型计算链路里理解。"
      abstract="这道题高分回答的关键，不是背三个语法，而是讲清楚它们在对象类型计算中的分工与配合关系。"
      leadTitle="从“拿 key、遍历 key、取 value type”讲清对象类型计算"
      lead="如果先把这三者放到同一条链路里，再分别解释职责，整个题目会非常清楚，也更容易自然过渡到 mapped type 和工具类型。"
      answerOutline={[
        '先讲三者在对象类型计算里各自负责什么',
        '再逐个解释 keyof、in 和 T[K]',
        '然后说明它们为什么总是一起出现',
        '最后落到工具类型和业务层用途',
      ]}
      quickAnswer="一句话答法：`keyof` 解决的是“如何拿到一个对象类型的所有属性名”；`in` 解决的是“如何遍历这些属性名并批量生成新类型”；索引访问类型 `T[K]` 解决的是“已知 key 后，如何取出这个 key 对应的属性类型”。它们常常一起使用，构成对象类型计算的基础链路。"
      pullQuote="先拿 key，再遍历 key，最后把 value type 带回来。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '不要分散答，按一条链路回答最稳。',
        '举 `Readonly<T>` 这类简单 mapped type 例子会很直观。',
        '顺手提工具类型，会让答案更像真实使用经验。',
      ]}
      mistakes={[
        '会写语法，却说不清各自在解决什么问题。',
        '把 in 和 keyof 的职责混掉。',
        '不会解释三者为什么经常一起出现。',
      ]}
      singleColumn
    />
  );
}
