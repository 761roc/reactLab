import { SectionCard } from '../../common/ui/SectionCard';
import styles from './ClosureThisSummaryPage.module.css';

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

const closureQuestions = [
  {
    title: '问题 1：为什么循环里注册的回调最后打印的是同一个值？',
    answer: '`var` 是函数作用域，循环结束后所有回调共享的是同一个 `i`。如果想保留每次迭代的值，要用 `let` 或再包一层函数作用域。',
    explanation: '这类题本质不是“异步有问题”，而是“闭包引用的是变量本身，不是创建时的值副本”。`let` 在每次迭代都会创建新的绑定，所以结果不同。',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log("var:", i)
  }, 0)
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => {
    console.log("let:", j)
  }, 0)
}

// 输出:
// var: 3
// var: 3
// var: 3
// let: 0
// let: 1
// let: 2`
  },
  {
    title: '问题 2：闭包为什么会让数据“保留下来”？',
    answer: '因为内部函数引用了外部函数的变量，只要这个内部函数还活着，这部分词法环境就不能被释放。',
    explanation: '闭包最常见的价值就是“封装状态”。像计数器、缓存器、once 函数，本质都是让某些变量不暴露到全局，但又能持续被访问。',
    code: `function createCounter() {
  let count = 0

  return {
    increment() {
      count += 1
      return count
    },
    getValue() {
      return count
    }
  }
}

const counter = createCounter()
counter.increment() // 1
counter.increment() // 2
counter.getValue()  // 2`
  },
  {
    title: '问题 3：闭包为什么也可能引发问题？',
    answer: '最常见的问题是无意中保留了不该长期存在的大对象、DOM 引用或旧状态，导致内存占用增加或逻辑读到过期数据。',
    explanation: '在前端项目里，闭包问题经常出现在事件监听、定时器、异步回调和 React effect 中。核心不是“闭包不好”，而是“闭包把你引用的东西保住了”。',
    code: `function bindHeavyListener() {
  const hugeData = new Array(100000).fill("cached")

  function handleResize() {
    console.log(hugeData.length)
  }

  window.addEventListener("resize", handleResize)

  return () => {
    window.removeEventListener("resize", handleResize)
  }
}

// 如果不清理监听器，hugeData 也会一直被闭包持有`
  }
] as const;

const thisQuestions = [
  {
    title: '问题 4：普通函数里的 this 到底指向谁？',
    answer: '`this` 不是在函数定义时决定的，而是在调用时决定的。看“谁调用了它”，而不是“它写在哪里”。',
    explanation: '同一个函数，用不同方式调用，`this` 可以完全不同。直接调用、对象方法调用、`call/apply/bind` 调用，结果都可能不一样。',
    code: `const user = {
  name: "Rocm",
  speak() {
    console.log(this.name)
  }
}

user.speak() // Rocm

const fn = user.speak
fn() // 严格模式下通常是 undefined，因为不再是 user 调用`
  },
  {
    title: '问题 5：为什么把对象方法当回调传出去后，this 会丢？',
    answer: '因为一旦脱离原对象调用，这个函数就只是“普通函数调用”，原来的对象不再是调用者。',
    explanation: '这在事件、定时器、Promise 回调里非常常见。要么提前 `bind`，要么用箭头函数包一层，确保真正执行时仍然带着正确上下文。',
    code: `const panel = {
  title: "Dashboard",
  printTitle() {
    console.log(this.title)
  }
}

setTimeout(panel.printTitle, 0) // undefined

setTimeout(() => panel.printTitle(), 0) // Dashboard

const boundPrint = panel.printTitle.bind(panel)
setTimeout(boundPrint, 0) // Dashboard`
  },
  {
    title: '问题 6：箭头函数为什么“没有自己的 this”？',
    answer: '箭头函数不会创建自己的 `this`，它会直接捕获外层词法作用域里的 `this`。',
    explanation: '这就是为什么类组件、对象方法内部经常用箭头函数做回调。它不是“自动绑定当前对象”，而是“沿用外层上下文的 this”。',
    code: `const widget = {
  name: "Editor",
  mount() {
    setTimeout(() => {
      console.log(this.name)
    }, 0)
  }
}

widget.mount() // Editor

// 如果这里用 function() { console.log(this.name) }
// 那么 this 就不再指向 widget`
  },
  {
    title: '问题 7：call、apply、bind 的区别是什么？',
    answer: '`call` 和 `apply` 都是“立刻调用”，区别在于参数传法；`bind` 不会立刻执行，而是返回一个绑定了 this 的新函数。',
    explanation: '前端里最常见的是用 `bind` 修复回调丢失 `this` 的问题。`call/apply` 更常用于手动指定一次性调用上下文。',
    code: `function greet(prefix, suffix) {
  console.log(prefix + this.name + suffix)
}

const user = { name: "Rocm" }

greet.call(user, "Hi, ", "!")
greet.apply(user, ["Hello, ", "!!!"])

const boundGreet = greet.bind(user, "Welcome, ")
boundGreet("~")`
  }
] as const;

const pitfallCards = [
  {
    title: '闭包相关误区',
    detail: '很多人把闭包理解成“内部函数记住外部值”，但更准确的说法是“内部函数保留了对外部词法环境的访问能力”。',
    points: [
      '闭包拿到的是变量引用，不一定是创建瞬间的值',
      '闭包本身不是性能问题，长期持有大对象才可能是问题',
      '在 React 中，过期闭包比“不会写闭包”更常见'
    ]
  },
  {
    title: 'this 相关误区',
    detail: '最常见误区是把 this 当成“函数归属对象”。实际上 this 取决于调用方式，而不是定义位置。',
    points: [
      '对象里定义函数，不代表 this 永远指向这个对象',
      '箭头函数不是万能解法，它只是继承外层 this',
      '脱离对象的回调最容易丢 this'
    ]
  }
] as const;

const rules = [
  {
    title: '判断闭包问题时，先问“这个函数引用了谁”',
    detail: '如果它引用了会变化的状态、超大对象、DOM、定时器上下文，就要考虑是否会读到旧值或导致资源长时间不释放。'
  },
  {
    title: '判断 this 指向时，先问“它是怎么被调用的”',
    detail: '不要先看函数写在哪个对象里，要先看最终执行那一刻是谁调用它。'
  },
  {
    title: '面试题和业务问题要统一到同一个底层模型',
    detail: '循环打印、定时器回调、事件监听、React stale closure，本质上都是作用域和调用方式问题。只要底层模型清楚，题目只是换皮。'
  }
] as const;

export default function ClosureThisSummaryPage() {
  const allQuestions = [...closureQuestions, ...thisQuestions];

  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Content Curation / Closure & This</span>
        <h2>闭包与 this 指向总结页</h2>
        <p className={styles.heroLead}>
          这页专门整理前端里最常见、也最容易出错的两类基础问题：闭包和 `this` 指向。页面按“问题、答案、解读、代码”
          的格式组织，适合拿来做面试复盘、知识扫盲和开发前排雷。
        </p>
        <div className={styles.heroGrid}>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Questions</span>
            <strong className={styles.heroStat}>7</strong>
            <p>覆盖循环回调、状态保留、内存占用、方法脱离对象、箭头函数、call/apply/bind 等高频问题。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Focus</span>
            <strong className={styles.heroStat}>Answer + Why</strong>
            <p>不只是给结论，还说明底层原因，避免只会背“箭头函数绑定 this”这种表面说法。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Goal</span>
            <strong className={styles.heroStat}>Practical</strong>
            <p>把这类题统一还原成作用域与调用方式问题，便于迁移到 React、事件、定时器等真实场景。</p>
          </article>
        </div>
      </header>

      <SectionCard
        note="用意：集中整理闭包问题，每题都给答案、解读和代码。"
        title="块 1：闭包高频问题"
      >
        <div className={styles.columns}>
          {closureQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>Closure</span>
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
              <CodeBlock code={item.code} title="Closure Example" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：集中整理 this 指向问题，强调“调用方式”比“定义位置”更重要。"
        title="块 2：this 指向高频问题"
      >
        <div className={styles.columns}>
          {thisQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>This</span>
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
              <CodeBlock code={item.code} title="This Example" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把容易说错、记错的点单独列出来。"
        title="块 3：常见误区"
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
        note="用意：把闭包和 this 统一成一套可复用的判断规则。"
        title="块 4：记忆规则"
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
        title="块 5：问题总览"
      >
        <div className={styles.columns}>
          {allQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>{item.title.includes('this') || item.title.includes('call') || item.title.includes('箭头') ? 'This' : 'Closure'}</span>
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
