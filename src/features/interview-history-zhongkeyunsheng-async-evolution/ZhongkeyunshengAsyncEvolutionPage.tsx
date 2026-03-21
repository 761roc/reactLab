import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '演进主线', value: '控制回调地狱、统一错误处理、改善流程表达' },
  { label: '4 个阶段', value: 'callback -> promise -> generator -> async/await' },
  { label: '核心问题', value: '异步编排、错误传播、可读性、组合能力' },
  { label: '答题关键', value: '每一步都说明解决了上一代什么痛点' },
];

const sections: EditorialSection[] = [
  {
    title: '1. callback：最原始的异步形式，解决的是“任务完成后怎么通知调用方”',
    paragraphs: [
      '最早期的异步编程方式就是回调函数。它解决的第一个问题非常直接：异步任务不是立刻完成的，所以要在任务结束后有一个办法把结果交还给调用方。',
      '比如 Ajax、定时器、事件监听，本质上都需要“未来某个时刻再执行一段逻辑”。callback 正是这个入口。它让异步不再只能阻塞等待，而是把后续逻辑注册为完成后的回调。',
      '但它的问题也很明显：多层异步嵌套时容易形成 callback hell，错误处理分散，控制流难以阅读和复用。',
    ],
    codeTitle: 'callback 的基本形态',
    code: `readFile('a.txt', (error, data) => {
  if (error) {
    return console.error(error);
  }

  console.log(data);
});`,
  },
  {
    title: '2. Promise：解决的是回调地狱、状态不可控和错误链路分散',
    paragraphs: [
      'Promise 出现后，异步结果被抽象成一个有状态的对象，状态从 pending 走向 fulfilled 或 rejected。这样异步任务不再只是“塞一个回调进去”，而是变成可以链式处理和统一传递错误的结果对象。',
      '它解决了 callback 的几个大痛点：第一，链式调用让顺序异步更平坦；第二，`catch` 让错误传播更加集中；第三，`Promise.all` 等组合能力让并发异步编排更自然。',
      '所以 Promise 的核心贡献，不只是语法变好看，而是给异步建立了统一的状态模型和组合模型。',
    ],
    bullets: [
      '状态统一：pending / fulfilled / rejected。',
      '错误传播统一：then 链和 catch。',
      '组合能力增强：all、race、allSettled 等。',
    ],
    codeTitle: 'Promise 链式调用',
    code: `fetchUser()
  .then((user) => fetchOrders(user.id))
  .then((orders) => console.log(orders))
  .catch((error) => console.error(error));`,
  },
  {
    title: '3. Generator：解决的是“如何把异步流程写得像同步流程”，但需要执行器配合',
    paragraphs: [
      'Promise 虽然解决了很多问题，但链式 then 在复杂流程里仍然会让代码读起来像“回调的另一种形式”。Generator 提供了一个新的思路：把函数执行过程暂停和恢复，从而让异步流程可以被“分步驱动”。',
      '通过 `yield`，Generator 可以把异步任务一个个抛出来，再由外部执行器决定何时继续执行。这让“异步流程控制”这件事更像写同步代码。',
      '但 Generator 自己并不自动处理异步。它必须和 runner 或 co 这类执行器配合，才能把 yield 出来的 Promise 接起来。因此它更像一座桥梁：证明了异步流程可以被写得更线性，但仍然缺少语言级直接支持。',
    ],
    codeTitle: 'Generator + 执行器思路',
    code: `function* task() {
  const user = yield fetchUser();
  const orders = yield fetchOrders(user.id);
  return orders;
}`,
  },
  {
    title: '4. async / await：解决的是让异步编排正式进入语言级线性表达',
    paragraphs: [
      'async / await 可以看作是 Promise + Generator 思想的语言级落地。它让你以接近同步代码的写法表达异步流程，同时保留 Promise 的错误传播和组合能力。',
      '`await` 的本质并不是阻塞线程，而是把后续逻辑挂到 Promise 完成之后再继续执行；`async` 函数本身仍然返回 Promise。所以它没有推翻 Promise，而是在 Promise 之上提供了更好的书写体验。',
      '它解决的核心问题，是让复杂异步流程不再依赖层层 then 或额外执行器，代码可读性、维护性和错误处理都更自然。',
    ],
    bullets: [
      '语义上更接近同步流程。',
      '底层仍建立在 Promise 之上。',
      'try/catch 让错误处理更贴近同步思维。',
    ],
    codeTitle: 'async / await 写法',
    code: `async function loadData() {
  try {
    const user = await fetchUser();
    const orders = await fetchOrders(user.id);
    return orders;
  } catch (error) {
    console.error(error);
  }
}`,
  },
  {
    title: '5. 这 4 个阶段不是彼此推翻，而是在不断补齐异步编程的痛点',
    paragraphs: [
      'callback 解决的是“未来执行”；Promise 解决的是“异步结果状态化、可链式、可统一处理错误”；Generator 解决的是“流程表达线性化”；async / await 则把这种线性化能力用语言级语法固定下来。',
      '也就是说，每一步都不是前一步完全错误，而是前一步在复杂场景下暴露了新的问题，于是社区和语言继续往前演进。',
      '如果你用“每一代解决了上一代什么问题”这个主线去讲，面试官会明显感受到你不是背 API，而是在理解编程范式的演变。',
    ],
  },
  {
    title: '6. 面试里怎样把异步方案演进题讲完整',
    paragraphs: [
      '最推荐的答法是按时间顺序讲，每一步都回答两个问题：它解决了什么问题？它还有什么不足？这样整个结构会非常清晰。',
      '比如 callback 解决异步通知，但带来回调地狱；Promise 解决链式和错误传播，但复杂流程可读性仍一般；Generator 让流程更线性，但要依赖执行器；async / await 则在 Promise 之上把线性异步流程变成语言级能力。',
      '一句话收尾很好用：这 4 个阶段本质上是在持续解决异步编排、错误处理和可读性问题。',
    ],
  },
];

export default function ZhongkeyunshengAsyncEvolutionPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="面试史档案"
      company="中科云声"
      issue="Issue 12"
      title="回调函数演进的 4 个阶段都解决了什么问题"
      strapline="异步方案演进的主线，不是语法炫技，而是持续解决编排、错误处理和可读性问题。"
      abstract="这道题的关键不在于背定义，而在于用演进视角解释：callback、promise、generator、async/await 分别是如何针对上一代异步方案的痛点做改进的。"
      leadTitle="按“上一代痛点 -> 下一代补位”来讲，会比背术语更有说服力"
      lead="回答这题时，最稳的方式就是按时间顺序讲：callback 先解决异步通知，Promise 再统一状态与错误处理，Generator 把流程变得可暂停可恢复，async/await 则把线性异步表达做成语言级能力。"
      answerOutline={[
        '先讲 callback 解决了什么原始问题',
        '再讲 Promise 如何统一状态和错误传播',
        '然后讲 Generator 如何改善流程表达',
        '最后讲 async/await 如何把异步流程写成线性代码',
      ]}
      quickAnswer="一句话答法：callback 解决的是异步任务完成后如何通知调用方；Promise 解决的是回调地狱、状态不可控和错误处理分散；Generator 解决的是让异步流程可以暂停和恢复，从而更接近线性表达；async/await 则在 Promise 基础上把这种线性异步写法做成语言级能力，让复杂流程更易读、更易维护。"
      pullQuote="这 4 个阶段不是互相推翻，而是在不断修补异步编排的痛点。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '按时间顺序讲最稳，每一代都回答“解决了什么、还有什么不足”。',
        '说 Generator 时别忘了补“它需要执行器配合”，这是高频追问点。',
        '最后一定强调 async/await 仍然建立在 Promise 之上。',
      ]}
      mistakes={[
        '只会背概念，不会解释每一代为什么会出现。',
        '把 async/await 误解成完全脱离 Promise 的新机制。',
        '说 Generator 时忽略它本身不自动处理异步这一点。',
      ]}
      singleColumn
    />
  );
}
