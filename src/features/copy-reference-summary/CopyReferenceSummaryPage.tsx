import { useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import styles from './CopyReferenceSummaryPage.module.css';

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

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'undefined') {
    return 'undefined';
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (value instanceof Date) {
    return `Date(${value.toISOString()})`;
  }

  if (value instanceof Map) {
    return `Map(${JSON.stringify(Array.from(value.entries()))})`;
  }

  if (value instanceof Set) {
    return `Set(${JSON.stringify(Array.from(value.values()))})`;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

type RuntimeExecutor = (log: (...args: unknown[]) => void) => void;

function collectRuntimeOutput(run: RuntimeExecutor) {
  const logs: string[] = [];

  const log = (...args: unknown[]) => {
    logs.push(args.map((item) => formatValue(item)).join(' '));
  };

  try {
    run(log);
  } catch (error) {
    logs.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return logs;
}

function RuntimePanel({ run, note }: { run: RuntimeExecutor; note: string }) {
  const [outputs, setOutputs] = useState(() => collectRuntimeOutput(run));

  return (
    <div className={styles.runtimeBox}>
      <div className={styles.runtimeHeader}>
        <span className={styles.runtimeLabel}>运行结果</span>
        <button className={styles.runButton} onClick={() => setOutputs(collectRuntimeOutput(run))} type="button">
          重新运行
        </button>
      </div>
      <div className={styles.outputList}>
        {outputs.map((item, index) => (
          <div className={styles.outputRow} key={`${item}-${index + 1}`}>
            <span className={styles.outputIndex}>{index + 1}</span>
            <pre className={styles.outputValue}>{item}</pre>
          </div>
        ))}
      </div>
      <p className={styles.runtimeNote}>{note}</p>
    </div>
  );
}

type Question = {
  title: string;
  answer: string;
  explanation: string;
  code: string;
  runtimeNote: string;
  run: RuntimeExecutor;
};

const definitionCards = [
  {
    title: '赋值对象变量时，复制的是“引用关系”',
    detail:
      '把一个对象赋给另一个变量时，并没有复制出新对象，只是让两个变量都指向同一块堆内存。'
  },
  {
    title: '浅拷贝只复制第一层',
    detail:
      '展开运算符、`Object.assign`、数组 `slice` / `concat` 这类常见方案，只会拷贝外层容器，内部嵌套对象仍然共享引用。'
  },
  {
    title: '深拷贝要递归复制嵌套结构',
    detail:
      '真正的深拷贝要让每一层对象、数组、Map、Set 等都得到新的实例，而不是继续共用旧引用。'
  },
  {
    title: '函数传参不是“按引用传递”，更准确是共享传递',
    detail:
      '调用函数时，实参的值会拷贝给形参；如果这个值本身是一个对象引用，那么形参与实参会共享同一个对象。'
  },
  {
    title: '`structuredClone` 是现代浏览器里更稳的深拷贝方案',
    detail:
      '它能处理很多 JSON 方案处理不了的数据类型，比如 `Date`、`Map`、`Set`、`ArrayBuffer`，但仍然不能拷贝函数。'
  },
  {
    title: '面试重点是区分“变量变了”还是“对象内容变了”',
    detail:
      '很多题看起来像“引用传递”，本质上只是同一个对象内容被改了；如果只是重绑变量，不会反向改掉外部变量本身。'
  }
] as const;

const relationCards = [
  {
    title: '赋值',
    detail: '`const b = a` 时，若 `a` 是对象，`b` 只是拿到同一个对象引用。',
    signal: 'One Object, Two Variables'
  },
  {
    title: '浅拷贝',
    detail: '外层是新的，但嵌套对象仍然和原对象共享。',
    signal: 'New Shell, Shared Nested'
  },
  {
    title: '深拷贝',
    detail: '外层和内层都要生成新副本，后续修改互不影响。',
    signal: 'Fully Detached'
  },
  {
    title: '函数传参',
    detail: '形参拿到的是一份值拷贝；若值是对象引用，则共享对象本体。',
    signal: 'Pass By Sharing'
  }
] as const;

const relationExample = `const source = {
  name: "Rocm",
  profile: { city: "Hangzhou" }
}

const assigned = source
const shallow = { ...source }
const deep = structuredClone(source)

assigned.name = "Changed"
shallow.profile.city = "Shanghai"
deep.profile.city = "Beijing"

console.log(source.name) // Changed
console.log(source.profile.city) // Shanghai
console.log(deep.profile.city) // Beijing`;

const copyQuestions: Question[] = [
  {
    title: '问题 1：为什么 `const b = a` 之后改 `b.name`，`a.name` 也变了？',
    answer:
      '因为对象赋值不会创建新对象，`a` 和 `b` 都指向同一个对象。改的是同一份数据，而不是两份独立副本。',
    explanation:
      '这类题最容易被误说成“按引用传递”。更准确的说法是：变量里保存的是对象引用值，赋值时只是复制了这个引用值。',
    code: `const a = { name: "Rocm" }
const b = a

b.name = "Updated"

console.log(a.name)
console.log(a === b)`,
    runtimeNote: '第一条输出体现对象内容被共享；第二条输出证明两个变量确实指向同一个对象。',
    run(log) {
      const a = { name: 'Rocm' };
      const b = a;

      b.name = 'Updated';

      log(a.name);
      log(a === b);
    }
  },
  {
    title: '问题 2：为什么展开运算符拷贝后，改嵌套对象仍然会影响原对象？',
    answer:
      '因为展开运算符只做浅拷贝。最外层对象是新的，但里面的嵌套对象仍然沿用旧引用。',
    explanation:
      '面试里只要对象里还有对象、数组、Map、Set 这类嵌套结构，就要立刻意识到浅拷贝不够。很多线上 bug 都发生在“以为已经拷贝干净了”。',
    code: `const source = {
  theme: "light",
  config: { locale: "zh-CN" }
}

const copy = { ...source }
copy.config.locale = "en-US"

console.log(source.config.locale)
console.log(source === copy)
console.log(source.config === copy.config)`,
    runtimeNote: '外层对象已经不同，但嵌套的 `config` 仍然是同一个引用。',
    run(log) {
      const source = {
        theme: 'light',
        config: { locale: 'zh-CN' }
      };

      const copy = { ...source };
      copy.config.locale = 'en-US';

      log(source.config.locale);
      log(source === copy);
      log(source.config === copy.config);
    }
  },
  {
    title: '问题 3：数组浅拷贝后，为什么修改元素内部对象也会联动？',
    answer:
      '因为数组的 `slice`、展开运算符、`concat` 等也只是浅拷贝。数组容器是新的，但元素如果是对象，仍然共享原来的引用。',
    explanation:
      '很多列表编辑 bug 就出在这里。尤其是表格编辑、表单草稿和拖拽排序，外层数组改了不代表内部项已经解耦。',
    code: `const list = [
  { id: 1, done: false },
  { id: 2, done: false }
]

const copied = [...list]
copied[0].done = true

console.log(list[0].done)
console.log(list === copied)
console.log(list[0] === copied[0])`,
    runtimeNote: '第三条输出是这题的关键：新数组里第一个元素和老数组里的第一个元素还是同一个对象。',
    run(log) {
      const list = [
        { id: 1, done: false },
        { id: 2, done: false }
      ];

      const copied = [...list];
      copied[0].done = true;

      log(list[0].done);
      log(list === copied);
      log(list[0] === copied[0]);
    }
  },
  {
    title: '问题 4：函数参数里改对象属性，为什么外部对象也跟着变；但直接给形参重新赋对象却不影响外部？',
    answer:
      '因为形参拿到的是对象引用值的副本。通过这个引用去改对象内容，改到的是同一个对象；但把形参重新指向新对象，只会改形参自己的绑定。',
    explanation:
      '这是“共享传递”最经典的考点。要区分“改对象内容”和“改变量指向”是两件事。',
    code: `function updateProfile(user) {
  user.name = "Updated"
  user = { name: "Other" }
  console.log("inside:", user.name)
}

const profile = { name: "Rocm" }
updateProfile(profile)

console.log("outside:", profile.name)`,
    runtimeNote: '函数内部后半段只是把 `user` 重新绑到新对象，外部的 `profile` 仍然指向原来的对象。',
    run(log) {
      function updateProfile(user: { name: string }) {
        user.name = 'Updated';
        user = { name: 'Other' };
        log(`inside: ${user.name}`);
      }

      const profile = { name: 'Rocm' };
      updateProfile(profile);
      log(`outside: ${profile.name}`);
    }
  }
] as const;

const cloneQuestions: Question[] = [
  {
    title: '问题 5：`JSON.parse(JSON.stringify(obj))` 为什么不是通用深拷贝？',
    answer:
      '因为它只能处理 JSON 支持的数据类型，函数、`undefined`、`Symbol` 会丢失，`Date` 会变字符串，`Map` / `Set` 会丢结构。',
    explanation:
      '这个方案适合“纯 JSON 数据”，不适合复杂业务对象。面试时要主动说明它的边界，而不是把它当万能答案。',
    code: `const source = {
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  skip: undefined,
  sayHi() { return "hi" }
}

const cloned = JSON.parse(JSON.stringify(source))

console.log(typeof cloned.createdAt)
console.log("skip" in cloned)
console.log("sayHi" in cloned)`,
    runtimeNote: '输出会体现 `Date` 被序列化成字符串，`undefined` 和函数属性都丢了。',
    run(log) {
      const source = {
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        skip: undefined,
        sayHi() {
          return 'hi';
        }
      };

      const cloned = JSON.parse(JSON.stringify(source)) as { createdAt: string };

      log(typeof cloned.createdAt);
      log('skip' in cloned);
      log('sayHi' in cloned);
    }
  },
  {
    title: '问题 6：`structuredClone` 解决了什么，仍然解决不了什么？',
    answer:
      '它能正确深拷贝很多内建复杂类型，比如 `Date`、`Map`、`Set`、`Blob`、`ArrayBuffer`，但不能拷贝函数、DOM 节点等不可结构化克隆的值。',
    explanation:
      '现在如果运行环境支持，`structuredClone` 往往是更稳的默认答案。但面试里最好补一句：它也不是所有值都能拷。',
    code: `const source = {
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  tags: new Set(["react", "ts"])
}

const cloned = structuredClone(source)

console.log(cloned.createdAt instanceof Date)
console.log(cloned.tags instanceof Set)
console.log(cloned.tags === source.tags)`,
    runtimeNote: '这里既能看出类型保住了，也能看出内部集合已经和原对象脱钩。',
    run(log) {
      const source = {
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        tags: new Set(['react', 'ts'])
      };

      const cloned = structuredClone(source);

      log(cloned.createdAt instanceof Date);
      log(cloned.tags instanceof Set);
      log(cloned.tags === source.tags);
    }
  },
  {
    title: '问题 7：深拷贝后再改嵌套对象，为什么原对象不受影响？',
    answer:
      '因为真正的深拷贝会把嵌套对象也复制成新实例，后续修改只会作用在新对象树上。',
    explanation:
      '这题是为了和浅拷贝形成对照。面试里不要只会说定义，要能拿出一个嵌套层级变化的例子证明“已经彻底断开”。',
    code: `const source = {
  profile: {
    city: "Hangzhou",
    skills: ["React", "TypeScript"]
  }
}

const cloned = structuredClone(source)
cloned.profile.city = "Shanghai"
cloned.profile.skills.push("Node.js")

console.log(source.profile.city)
console.log(source.profile.skills.length)
console.log(source.profile === cloned.profile)`,
    runtimeNote: '最后一条输出是关键，它证明嵌套层对象也已经不是同一个引用。',
    run(log) {
      const source = {
        profile: {
          city: 'Hangzhou',
          skills: ['React', 'TypeScript']
        }
      };

      const cloned = structuredClone(source);
      cloned.profile.city = 'Shanghai';
      cloned.profile.skills.push('Node.js');

      log(source.profile.city);
      log(source.profile.skills.length);
      log(source.profile === cloned.profile);
    }
  },
  {
    title: '问题 8：如果对象里有循环引用，哪些方案会出问题？',
    answer:
      'JSON 方案会直接报错，因为它无法序列化循环引用；`structuredClone` 可以处理很多循环引用场景。',
    explanation:
      '这题很适合拉开候选人层次。知道浅拷贝不够只是入门，知道复杂对象和循环引用带来的限制，才说明你理解的是实际工程问题。',
    code: `const source = { name: "loop" }
source.self = source

try {
  JSON.stringify(source)
} catch (error) {
  console.log("json error:", error instanceof Error)
}

const cloned = structuredClone(source)
console.log(cloned !== source)
console.log(cloned.self === cloned)`,
    runtimeNote: '先看 JSON 方案失败，再看 `structuredClone` 是否能保留循环结构。',
    run(log) {
      const source: { name: string; self?: unknown } = { name: 'loop' };
      source.self = source;

      try {
        JSON.stringify(source);
      } catch (error) {
        log(`json error: ${error instanceof Error}`);
      }

      const cloned = structuredClone(source);
      log(cloned !== source);
      log(cloned.self === cloned);
    }
  }
] as const;

const pitfallCards = [
  {
    title: '高频误区 1：把“引用类型”理解成变量本身存在栈里和堆里两个对象',
    detail:
      '真正重要的是：变量里拿着一个可以指向对象的值。赋值、传参、比较时要看这个值是不是同一个，而不是背模糊的“栈堆故事”。',
    points: [
      '面试解释时不要只说“对象在堆里”就结束',
      '要说明变量之间是否共享同一个对象引用',
      '最终仍然要回到行为层：改谁会影响谁'
    ]
  },
  {
    title: '高频误区 2：把展开运算符当成深拷贝',
    detail:
      '对象和数组展开运算符都只做浅拷贝。只要有嵌套结构，后续修改就可能回写到源数据。',
    points: [
      '第一层看起来没问题，不代表深层也安全',
      '表单默认值、配置对象、列表项最容易踩坑',
      '修改嵌套层前先确认是否需要深拷贝'
    ]
  },
  {
    title: '高频误区 3：把函数参数修改误说成“按引用传递”',
    detail:
      'JavaScript 更准确的说法是按值传递，只不过对象值本身是一个引用值。形参和实参因此共享同一个对象，但不是同一个变量。',
    points: [
      '改对象内容会影响外部',
      '重绑形参不会影响外部变量绑定',
      '这就是 pass-by-sharing 的核心'
    ]
  },
  {
    title: '高频误区 4：把 JSON 方案当万能深拷贝',
    detail:
      '它只能处理纯 JSON 数据，对日期、函数、正则、Map、Set、循环引用都有明显局限。',
    points: [
      '纯接口返回数据时可以考虑',
      '复杂状态对象时要谨慎',
      '现代环境优先考虑 structuredClone 或自定义方案'
    ]
  }
] as const;

const diagnosticSteps = [
  {
    title: '第一步：先看是赋值、传参，还是拷贝',
    detail: '不同问题根本不是同一类。赋值通常不产生新对象，拷贝才在讨论要不要复制。'
  },
  {
    title: '第二步：判断是否只有第一层被复制',
    detail: '只要看到 spread、`Object.assign`、`slice`、`concat`，默认先按浅拷贝理解。'
  },
  {
    title: '第三步：看修改发生在“变量绑定”还是“对象内容”',
    detail: '改绑定和改对象是两套完全不同的行为，这一步经常决定面试题答案。'
  },
  {
    title: '第四步：最后再审视数据类型边界',
    detail: '如果对象里有 Date、Map、Set、函数、循环引用，就要立刻评估具体深拷贝方案是否可靠。'
  }
] as const;

const rules = [
  {
    title: '赋值对象变量时，默认先想“共享同一个对象”',
    detail: '没有显式拷贝动作时，不要脑补已经有了新对象。'
  },
  {
    title: '看到 spread / Object.assign / slice，默认先按浅拷贝理解',
    detail: '除非只处理纯一层数据，否则要继续追问嵌套层是否仍然共享。'
  },
  {
    title: '解释传参时，优先说“共享传递”而不是“按引用传递”',
    detail: '这会让你的表述更准确，也更容易解释“改属性会生效，重绑形参不会生效”。'
  },
  {
    title: '选择深拷贝方案时，要先看数据类型范围',
    detail: '纯 JSON、复杂对象、循环引用、性能约束，都会直接影响你该怎么选。'
  }
] as const;

export default function CopyReferenceSummaryPage() {
  const allQuestions = [...copyQuestions, ...cloneQuestions];

  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>JS Content / Copy And Reference</span>
        <h2>深拷贝、浅拷贝与引用传递</h2>
        <p className={styles.heroLead}>
          这页把前端面试里最常见的拷贝与引用问题放在一起讲清楚：对象赋值、浅拷贝、深拷贝、函数传参、
          `structuredClone`、JSON 方案边界和循环引用。重点不是死背结论，而是拿到题后能准确说出“有没有新对象”“哪一层共享”“为什么外部会受影响”。
        </p>
        <div className={styles.heroGrid}>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Questions</span>
            <strong className={styles.heroStat}>8</strong>
            <p>覆盖对象赋值、浅拷贝陷阱、函数传参、JSON 深拷贝边界、`structuredClone` 与循环引用。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Focus</span>
            <strong className={styles.heroStat}>Shared Or Detached</strong>
            <p>先判断现在拿到的是同一个对象，还是新的副本；再判断共享发生在哪一层。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Runtime</span>
            <strong className={styles.heroStat}>Live Output</strong>
            <p>每道核心题都带运行结果展示，不只看代码，还能直接对照输出理解行为。</p>
          </article>
        </div>
      </header>

      <SectionCard note="用意：先把赋值、拷贝、传参三个概念拆开。" title="块 1：基础定义（先统一术语）">
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
        note="用意：先把赋值、浅拷贝、深拷贝、传参之间的关系串起来。"
        title="块 2：核心关系速览"
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
        <CodeBlock code={relationExample} title="Copy vs Reference Map" />
      </SectionCard>

      <SectionCard
        note="用意：先解决赋值、浅拷贝和函数传参里最常见的理解偏差。"
        title="块 3：赋值与浅拷贝高频问题"
      >
        <div className={styles.columns}>
          {copyQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>Reference</span>
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
              <CodeBlock code={item.code} title="Reference Example" />
              <RuntimePanel note={item.runtimeNote} run={item.run} />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：聚焦真正的深拷贝方案、边界和工程中的常见坑。"
        title="块 4：深拷贝高频问题"
      >
        <div className={styles.columns}>
          {cloneQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>Clone</span>
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
              <CodeBlock code={item.code} title="Clone Example" />
              <RuntimePanel note={item.runtimeNote} run={item.run} />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard note="用意：把这类题固定成一套稳定的拆解顺序。" title="块 5：四步拆题法">
        <div className={styles.stepsGrid}>
          {diagnosticSteps.map((item) => (
            <article className={styles.ruleCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard note="用意：集中列出面试里最容易说错的说法。" title="块 6：常见误区">
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

      <SectionCard note="用意：复盘时快速过一遍判断规则。" title="块 7：记忆规则">
        <div className={styles.rules}>
          {rules.map((item) => (
            <article className={styles.ruleCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard note="用意：快速回顾这页覆盖的问题范围。" title="块 8：问题总览">
        <div className={styles.columns}>
          {allQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>
                  {item.title.includes('structuredClone') ||
                  item.title.includes('JSON') ||
                  item.title.includes('循环引用')
                    ? 'Clone'
                    : 'Reference'}
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
