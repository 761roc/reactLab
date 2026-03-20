import { SectionCard } from '../../common/ui/SectionCard';
import styles from './EventLoopSummaryPage.module.css';

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightPlainSegment(text: string) {
  return text
    .replace(
      /\b(import|export|from|const|let|var|return|if|else|for|while|switch|case|break|continue|new|type|interface|extends|implements|async|await|function|class|try|catch|finally|throw|in|of)\b/g,
      '<span class="' + styles.tokenKeyword + '">$1</span>'
    )
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="' + styles.tokenBoolean + '">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="' + styles.tokenNumber + '">$1</span>')
    .replace(/\b([A-Za-z_$][\w$]*)(?=\s*\()/g, '<span class="' + styles.tokenFunction + '">$1</span>')
    .replace(/(&lt;\/?)([A-Za-z][\w.-]*)(?=[\s&gt;])/g, `$1<span class="${styles.tokenTag}">$2</span>`);
}

function highlightCode(code: string) {
  const escaped = escapeHtml(code);
  const matcher =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;

  let result = '';
  let lastIndex = 0;
  let match = matcher.exec(escaped);

  while (match) {
    const currentIndex = match.index;
    const plain = escaped.slice(lastIndex, currentIndex);
    result += highlightPlainSegment(plain);

    const token = match[0];
    const tokenClass =
      token.startsWith('//') || token.startsWith('/*') ? styles.tokenComment : styles.tokenString;

    result += `<span class="${tokenClass}">${token}</span>`;
    lastIndex = currentIndex + token.length;
    match = matcher.exec(escaped);
  }

  result += highlightPlainSegment(escaped.slice(lastIndex));

  return result;
}

function CodeBlock({ code, title }: { code: string; title: string }) {
  const lines = highlightCode(code).split('\n');

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{title}</span>
        <span>JS / TS Example</span>
      </div>
      <pre className={styles.codePre}>
        <code>
          {lines.map((line, index) => (
            <span className={styles.codeLine} key={`${title}-${index + 1}`}>
              <span className={styles.lineNumber}>{index + 1}</span>
              <span
                className={styles.lineContent}
                dangerouslySetInnerHTML={{ __html: line.length > 0 ? line : '&nbsp;' }}
              />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

const definitionCards = [
  {
    title: '调用栈负责“当前正在执行谁”',
    detail:
      '同步代码会直接进入调用栈执行。只有当调用栈清空后，事件循环才会考虑把队列里的异步回调推进来。'
  },
  {
    title: '宏任务是“一轮一轮推进的任务单元”',
    detail:
      '`script`、`setTimeout`、`setInterval`、I/O、UI 事件等通常会进入宏任务队列。每一轮事件循环通常先取一个宏任务执行。'
  },
  {
    title: '微任务会在当前宏任务结束后立即清空',
    detail:
      '`Promise.then`、`catch`、`finally`、`queueMicrotask`、`MutationObserver` 这类回调属于微任务，优先级高于下一轮宏任务。'
  },
  {
    title: '`async/await` 本质上仍然建立在 Promise 上',
    detail:
      '`await` 后面的继续执行部分通常会以微任务形式恢复，所以它不是“阻塞线程”，而是“暂停当前 async 函数，稍后恢复”。'
  },
  {
    title: '渲染通常发生在一轮任务与微任务处理之后',
    detail:
      '浏览器通常会在合适的时机做布局、绘制和合成。面试里常见结论是：微任务会先于下一次渲染机会。'
  },
  {
    title: '理解事件循环的重点是“谁先入栈，谁进哪个队列”',
    detail:
      '只背“微任务比宏任务快”不够。真正要能解释清楚的是：同步先跑，当前宏任务结束后清空微任务，再进入下一轮宏任务。'
  }
] as const;

const relationCards = [
  {
    title: 'Step 1 · 跑同步代码',
    detail: '脚本加载后先直接执行同步语句，遇到异步 API 只注册回调，不会立刻执行回调体。',
    signal: 'Call Stack First'
  },
  {
    title: 'Step 2 · 当前宏任务结束',
    detail: '当前这轮同步代码结束后，调用栈清空，事件循环开始检查微任务队列。',
    signal: 'End Of Current Task'
  },
  {
    title: 'Step 3 · 清空微任务',
    detail: '这一步会把当前已排入的微任务依次执行完，直到微任务队列真正清空。',
    signal: 'Flush Microtasks'
  },
  {
    title: 'Step 4 · 进入下一轮',
    detail: '然后才有机会渲染，或取下一个宏任务继续跑，比如 `setTimeout` 回调。',
    signal: 'Next Macrotask'
  }
] as const;

const relationExample = `console.log("sync start")

setTimeout(() => {
  console.log("timeout")
}, 0)

Promise.resolve().then(() => {
  console.log("promise then")
})

queueMicrotask(() => {
  console.log("microtask")
})

console.log("sync end")

// 输出顺序:
// sync start
// sync end
// promise then
// microtask
// timeout`;

const queueQuestions = [
  {
    title: '问题 1：为什么 `Promise.then` 往往比 `setTimeout(..., 0)` 更早执行？',
    answer:
      '因为 `Promise.then` 属于微任务，而 `setTimeout` 属于下一轮宏任务。当前宏任务结束后会先清空微任务，再进入下一轮宏任务。',
    explanation:
      '这里的关键不是“0 毫秒就马上执行”，而是“0 毫秒只是最早可被调度的时间”。真正开始执行还要等当前调用栈清空，并且还得排在微任务之后。',
    code: `console.log("start")

setTimeout(() => {
  console.log("timeout")
}, 0)

Promise.resolve().then(() => {
  console.log("then")
})

console.log("end")

// start
// end
// then
// timeout`
  },
  {
    title: '问题 2：当前宏任务结束后，微任务会执行到什么程度？',
    answer:
      '会一直执行到微任务队列清空为止。如果微任务里又继续塞入新的微任务，这些新微任务也会在同一轮里继续被执行。',
    explanation:
      '这就是为什么“无限递归微任务”会拖住页面，让下一轮宏任务和渲染机会都迟迟等不到。微任务优先级高，但滥用会造成饥饿问题。',
    code: `console.log("A")

Promise.resolve().then(() => {
  console.log("B")
  Promise.resolve().then(() => {
    console.log("C")
  })
})

setTimeout(() => {
  console.log("D")
}, 0)

// A
// B
// C
// D`
  },
  {
    title: '问题 3：`script` 整体为什么也会被当成一个宏任务？',
    answer:
      '因为浏览器需要把当前整段脚本作为一个完整的执行单元来处理。只有这段脚本跑完，才会进入微任务清空和下一轮调度。',
    explanation:
      '这能解释一个常见现象：哪怕脚本中间注册了很多微任务，它们也不会在脚本尚未结束时插进来，而是要等整个脚本这轮同步逻辑结束。',
    code: `console.log("1")

Promise.resolve().then(() => {
  console.log("2")
})

console.log("3")

// 1
// 3
// 2`
  },
  {
    title: '问题 4：多个 `setTimeout(..., 0)` 会不会绝对按 0ms 同时执行？',
    answer:
      '不会。它们只是进入宏任务队列等待调度，仍然要排队，并受最小延迟、浏览器实现和主线程占用影响。',
    explanation:
      '面试里更重要的结论是：`setTimeout` 不能保证精确时间，只能保证“不会早于这个时间尝试进入调度”。',
    code: `console.time("delay")

setTimeout(() => {
  console.timeEnd("delay")
}, 0)

for (let i = 0; i < 1_000_000_000; i++) {
  if (i === 1_000_000_000 - 1) {
    console.log("heavy sync done")
  }
}`
  },
  {
    title: '问题 5：`queueMicrotask` 和 `Promise.then` 的定位有什么相似点？',
    answer:
      '它们都会把回调安排进微任务队列，所以都发生在当前宏任务之后、下一轮宏任务之前。',
    explanation:
      '面试里通常不要求深挖差异，重点是知道它们都属于微任务体系，可以用来表达“当前同步逻辑之后立刻执行”的意图。',
    code: `console.log("sync")

queueMicrotask(() => {
  console.log("microtask by queueMicrotask")
})

Promise.resolve().then(() => {
  console.log("microtask by promise")
})`
  }
] as const;

const asyncQuestions = [
  {
    title: '问题 6：`async/await` 为什么看起来像同步代码，但执行顺序又不是完全同步？',
    answer:
      '因为 `await` 会把后续逻辑拆开。遇到 `await` 时，函数会先返回一个 Promise，等被等待的值完成后，再以微任务的形式恢复执行。',
    explanation:
      '这就是为什么 `await` 后面的代码不会立刻继续，而是要等当前同步逻辑走完，再在后续微任务阶段恢复。',
    code: `async function run() {
  console.log("async start")
  await Promise.resolve()
  console.log("after await")
}

console.log("script start")
run()
console.log("script end")

// script start
// async start
// script end
// after await`
  },
  {
    title: '问题 7：`await 123` 这种等待非 Promise 值时，后面的代码会不会同步继续？',
    answer:
      '不会。哪怕等待的是普通值，`await` 也会把它包成已完成的 Promise，然后让后续逻辑在微任务阶段恢复。',
    explanation:
      '这是一个很常见的迷惑点。`await` 不是只对异步请求有效，它的语义是“把后面逻辑挂到 Promise 恢复点上”。',
    code: `async function demo() {
  console.log("before")
  await 123
  console.log("after")
}

console.log("A")
demo()
console.log("B")

// A
// before
// B
// after`
  },
  {
    title: '问题 8：为什么 `async` 函数里抛错能被 `.catch` 捕获？',
    answer:
      '`async` 函数天然返回 Promise。函数里抛出的异常会转成这个 Promise 的 rejected 状态，所以可以被 `.catch` 或外层 `try/catch` 处理。',
    explanation:
      '这能帮助你把“同步 throw”和“异步 reject”统一理解。`async` 函数只是帮你把这层包装自动做了。',
    code: `async function loadUser() {
  throw new Error("network failed")
}

loadUser().catch((error) => {
  console.log(error.message)
})`
  },
  {
    title: '问题 9：浏览器为什么不会在每一行代码之后都立刻渲染？',
    answer:
      '因为渲染也是有成本的。浏览器通常会把脚本执行、样式计算、布局和绘制安排在合适的节奏里，而不是每次数据改一点就立刻整页重绘。',
    explanation:
      '面试回答不用过度细抠浏览器内部实现，核心结论是：长时间同步任务会阻塞渲染机会，所以页面会“卡住”。',
    code: `button.textContent = "loading..."

const start = Date.now()
while (Date.now() - start < 3000) {
  // block main thread
}

button.textContent = "done"

// 用户往往看不到中间的 loading 状态及时渲染`
  },
  {
    title: '问题 10：为什么页面会因为大量微任务或超长同步任务而卡顿？',
    answer:
      '因为主线程被持续占用时，浏览器拿不到新的渲染机会，也无法及时响应输入事件。微任务如果不断追加，也会让下一轮任务迟迟进不来。',
    explanation:
      '这类题最后都要落到“主线程资源竞争”。前端性能优化里把大任务切片、把重活挪到 Web Worker，本质都在解决这件事。',
    code: `function scheduleHeavyWork(items) {
  let index = 0

  function runChunk() {
    const end = Math.min(index + 100, items.length)

    while (index < end) {
      doWork(items[index])
      index += 1
    }

    if (index < items.length) {
      setTimeout(runChunk, 0)
    }
  }

  runChunk()
}`
  }
] as const;

const pitfallCards = [
  {
    title: '高频误区 1：把“异步”理解成“并行执行”',
    detail:
      '事件循环里的很多异步只是“延后回调时机”，不是让 JavaScript 主线程同时执行两段代码。真正并行通常要借助 Worker 或浏览器底层能力。',
    points: [
      '同步代码始终先跑当前调用栈',
      '回调要等队列调度，不会凭空插队到当前栈中',
      '异步 API 和并行计算不是一个概念'
    ]
  },
  {
    title: '高频误区 2：只背“微任务优先于宏任务”，却解释不清为什么',
    detail:
      '真正的解释必须带上“当前宏任务结束后先清空微任务，再进入下一轮宏任务”这套顺序。',
    points: [
      '不要把优先级背成一句口号',
      '要能画出“script -> microtasks -> timeout”的顺序',
      '题目一换皮，仍然回到同一个调度模型'
    ]
  },
  {
    title: '高频误区 3：以为 `setTimeout(fn, 0)` 就等于立刻执行',
    detail:
      '它只能保证“最早不早于 0ms 尝试进入调度”，不能保证立刻执行，更不能抢在微任务和长同步任务之前。',
    points: [
      '主线程忙时，timeout 会被整体延后',
      '不同环境有最小延迟和限流策略',
      '时间到了也只是进入候选队列，不是立刻跑'
    ]
  },
  {
    title: '高频误区 4：以为 `await` 会阻塞整个线程',
    detail:
      '`await` 只会暂停当前 async 函数的继续执行，不会让整个 JavaScript 引擎停住。其他同步逻辑照样继续跑。',
    points: [
      'await 不是 sleep',
      '它更像“注册恢复点，然后先把控制权还出去”',
      '后续恢复通常依赖微任务'
    ]
  }
] as const;

const diagnosticSteps = [
  {
    title: '第一步：先把同步日志全列出来',
    detail: '题目一上来先找同步代码，它们必然先于当前轮里注册的异步回调输出。'
  },
  {
    title: '第二步：标记回调属于微任务还是宏任务',
    detail: '`Promise.then`、`await` 后续、`queueMicrotask` 归到微任务；`setTimeout`、事件、I/O 归到宏任务。'
  },
  {
    title: '第三步：每轮结束后先清空微任务',
    detail: '这一步是绝大多数输出题的分水岭。只要当前宏任务还没结束，微任务就不会先插进来。'
  },
  {
    title: '第四步：再进入下一轮宏任务或渲染机会',
    detail: '如果还剩定时器、事件回调，就按新的轮次继续分析。遇到长任务时，顺便解释卡顿与渲染阻塞。'
  }
] as const;

const rules = [
  {
    title: '先同步，后微任务，再下一轮宏任务',
    detail: '这是事件循环题最核心的总规则，绝大多数输出题都能从这里展开。'
  },
  {
    title: '`await` 后面的代码几乎都要按“微任务恢复”去理解',
    detail: '它写起来像同步，但恢复时机依旧属于异步调度。'
  },
  {
    title: '`setTimeout(..., 0)` 表示尽快，不表示立刻',
    detail: '时间参数是最早调度时机，不是绝对执行时刻。'
  },
  {
    title: '能解释卡顿，就把话题落回“主线程是否被长期占用”',
    detail: '同步大任务、微任务饥饿、频繁重排，本质都在抢主线程。'
  }
] as const;

export default function EventLoopSummaryPage() {
  const allQuestions = [...queueQuestions, ...asyncQuestions];

  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Content Curation / Event Loop</span>
        <h2>事件循环与异步总结页</h2>
        <p className={styles.heroLead}>
          这页把前端面试里最常见的异步问题统一回到事件循环模型里理解：调用栈、宏任务、微任务、`Promise`、`async/await`、
          渲染时机和主线程阻塞。重点不是死背某道输出题，而是拿到题后能自己推演顺序、解释原因。
        </p>
        <div className={styles.heroGrid}>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Questions</span>
            <strong className={styles.heroStat}>10</strong>
            <p>覆盖 `Promise.then`、`setTimeout`、`queueMicrotask`、`await`、渲染时机和卡顿原因。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Focus</span>
            <strong className={styles.heroStat}>Queue Model</strong>
            <p>先分清同步、微任务、宏任务，再看每轮结束后如何调度，输出顺序就不会乱。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Scenarios</span>
            <strong className={styles.heroStat}>输出题 + 性能题</strong>
            <p>不仅能解释日志顺序，也能解释为什么页面卡顿、为什么 loading 不立刻出现。</p>
          </article>
        </div>
      </header>

      <SectionCard
        note="用意：先把事件循环题里最基础的几个角色讲清楚。"
        title="块 1：基础定义（先有统一模型）"
      >
        <div className={styles.definitionGrid}>
          {definitionCards.map((item) => (
            <article className={styles.definitionCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把一轮事件循环的节奏先固定下来。"
        title="块 2：执行顺序速览"
      >
        <div className={styles.relationGrid}>
          {relationCards.map((item) => (
            <article className={styles.relationCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <span className={styles.signal}>{item.signal}</span>
            </article>
          ))}
        </div>
        <CodeBlock code={relationExample} title="Event Loop Timeline" />
      </SectionCard>

      <SectionCard
        note="用意：先把最常考的队列优先级和输出顺序题讲透。"
        title="块 3：队列与调度高频问题"
      >
        <div className={styles.columns}>
          {queueQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>Queues</span>
                <span className={styles.label}>Question</span>
              </div>
              <strong>{item.title}</strong>
              <div className={styles.answerBox}>
                <span>答案</span>
                <p>{item.answer}</p>
              </div>
              <div className={styles.explainBox}>
                <span>解读</span>
                <p>{item.explanation}</p>
              </div>
              <CodeBlock code={item.code} title="Queue Example" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把 async/await、渲染时机和主线程阻塞这些进阶题一起串起来。"
        title="块 4：异步与渲染高频问题"
      >
        <div className={styles.columns}>
          {asyncQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>Async</span>
                <span className={styles.label}>Question</span>
              </div>
              <strong>{item.title}</strong>
              <div className={styles.answerBox}>
                <span>答案</span>
                <p>{item.answer}</p>
              </div>
              <div className={styles.explainBox}>
                <span>解读</span>
                <p>{item.explanation}</p>
              </div>
              <CodeBlock code={item.code} title="Async Example" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把输出题的推导过程固定成一套稳定步骤。"
        title="块 5：四步拆题法"
      >
        <div className={styles.stepsGrid}>
          {diagnosticSteps.map((item) => (
            <article className={styles.ruleCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把最容易背错、说错的点集中列出来。"
        title="块 6：常见误区"
      >
        <div className={styles.columns}>
          {pitfallCards.map((item) => (
            <article className={styles.pitfallCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：复盘时快速过一遍最稳定的判断规则。"
        title="块 7：记忆规则"
      >
        <div className={styles.rules}>
          {rules.map((item) => (
            <article className={styles.ruleCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：快速回顾这页覆盖的问题范围。"
        title="块 8：问题总览"
      >
        <div className={styles.columns}>
          {allQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>
                  {item.title.includes('await') || item.title.includes('渲染') || item.title.includes('卡顿')
                    ? 'Async'
                    : 'Queues'}
                </span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
