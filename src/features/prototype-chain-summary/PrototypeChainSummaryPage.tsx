import { SectionCard } from '../../common/ui/SectionCard';
import styles from './PrototypeChainSummaryPage.module.css';

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

const definitionCards = [
  {
    title: '`prototype` 是函数对象上的“共享方法区”',
    detail:
      '普通构造函数通常会有一个 `prototype` 属性。通过 `new` 创建出来的实例，会把这个对象接到自己的原型链上，所以这里很适合放共享方法。'
  },
  {
    title: '对象真正参与查找的是 `[[Prototype]]`',
    detail:
      '实例对象在底层有一个内部槽位 `[[Prototype]]`，它决定“找不到属性时下一步往哪找”。业务代码里通常用 `Object.getPrototypeOf(obj)` 读取它。'
  },
  {
    title: '`__proto__` 只是历史访问器，不是首选 API',
    detail:
      '它能读写对象原型，但属于历史遗留接口。理解题目时可以认识它，业务代码和教学代码里优先用 `Object.getPrototypeOf` / `Object.setPrototypeOf`。'
  },
  {
    title: '原型链是“查找路径”，不是“拷贝路径”',
    detail:
      '实例能访问原型方法，不代表方法被复制到实例上。查找到原型上的方法后，再以当前对象作为调用时的 `this` 执行。'
  },
  {
    title: '`class` / `extends` 只是更现代的语法糖',
    detail:
      '它们底层仍然依赖原型和原型链。实例方法还是放在 `ClassName.prototype` 上，继承仍然是让两个 prototype 对象连起来。'
  },
  {
    title: '理解原型链的重点是“命中层级”',
    detail:
      '很多 bug 不是值错了，而是你以为命中了实例，实际命中的是原型；或者你以为改掉了原型，实际只是在实例上新增了同名属性。'
  }
] as const;

const relationCards = [
  {
    title: '构造函数',
    detail: '`function User() {}` 本身也是对象，所以它自己也有原型链。',
    signal: 'User.__proto__ === Function.prototype'
  },
  {
    title: '实例对象',
    detail: '`const user = new User()` 后，实例自己的原型通常指向 `User.prototype`。',
    signal: 'Object.getPrototypeOf(user) === User.prototype'
  },
  {
    title: '共享方法区',
    detail: '`User.prototype.sayHi` 这类方法只存一份，多个实例共享访问。',
    signal: 'userA.sayHi === userB.sayHi'
  },
  {
    title: '原型链顶层',
    detail: '普通对象最终会连到 `Object.prototype`，再往上才是 `null`。',
    signal: 'Object.getPrototypeOf(Object.prototype) === null'
  }
] as const;

const relationExample = `function User(name) {
  this.name = name
}

User.prototype.sayHi = function () {
  return "Hi, " + this.name
}

const user = new User("Rocm")

console.log(Object.getPrototypeOf(user) === User.prototype) // true
console.log(User.__proto__ === Function.prototype) // true
console.log(User.prototype.__proto__ === Object.prototype) // true
console.log(Object.getPrototypeOf(Object.prototype) === null) // true`;

const prototypeQuestions = [
  {
    title: '问题 1：`prototype`、`__proto__`、`Object.getPrototypeOf()` 到底分别是什么？',
    answer:
      '`prototype` 通常挂在函数对象上；`__proto__` 是对象访问内部原型的历史访问器；`Object.getPrototypeOf(obj)` 是更规范的读取方式。',
    explanation:
      '最容易记的方式是：讨论“构造函数准备给实例共享什么”时看 `Foo.prototype`；讨论“这个对象查找失败后往哪继续找”时看对象原型，也就是 `Object.getPrototypeOf(foo)`。',
    code: `function Person(name) {
  this.name = name
}

const user = new Person("Rocm")

console.log(Person.prototype === Object.getPrototypeOf(user)) // true
console.log(user.__proto__ === Person.prototype) // true
console.log(Object.getPrototypeOf(user) === Person.prototype) // true`
  },
  {
    title: '问题 2：为什么函数本身也有原型链？',
    answer:
      '因为函数在 JavaScript 里也是对象。既然是对象，它也会沿着自己的原型链去找属性，只不过函数对象通常会连到 `Function.prototype`。',
    explanation:
      '这题经常用来打通“函数是对象”这个概念。构造函数既有自己的原型链，也有一个专门给实例使用的 `prototype` 属性，这两个层面不要混在一起。',
    code: `function User() {}

console.log(typeof User) // function
console.log(User.__proto__ === Function.prototype) // true
console.log(Function.prototype.__proto__ === Object.prototype) // true
console.log(User.prototype.constructor === User) // true`
  },
  {
    title: '问题 3：为什么实例能访问到构造函数 prototype 上的方法？',
    answer:
      '因为实例自己的原型会指向构造函数的 `prototype` 对象，属性查找失败后会沿着这条链继续找。',
    explanation:
      '这就是“共享方法”的基础。方法放在 `prototype` 上时，不会给每个实例各复制一份，但多个实例仍然都能访问到同一个函数。',
    code: `function Counter() {
  this.value = 0
}

Counter.prototype.increment = function () {
  this.value += 1
}

const a = new Counter()
const b = new Counter()

a.increment()

console.log(a.value) // 1
console.log(b.value) // 0
console.log(a.increment === b.increment) // true`
  },
  {
    title: '问题 4：属性查找时，实例属性和原型属性谁优先？',
    answer: '先查对象自身属性，再查原型链。对象自己有同名属性时，会屏蔽掉原型链上的同名属性。',
    explanation:
      '这就是为什么“我给实例赋了值，怎么像把 prototype 改掉了一样”这种感觉经常出现。其实不是改掉了原型，而是查找在实例这一层就提前命中了。',
    code: `function User() {}

User.prototype.role = "guest"

const user = new User()
console.log(user.role) // guest

user.role = "admin"
console.log(user.role) // admin
console.log(User.prototype.role) // guest

delete user.role
console.log(user.role) // guest`
  },
  {
    title: '问题 5：为什么不建议把引用类型直接挂在 prototype 上？',
    answer:
      '因为挂在 prototype 上的数组、对象会被所有实例共享。一个实例修改后，其他实例看到的是同一份数据。',
    explanation:
      '共享方法通常没问题，但共享可变数据很危险。尤其是列表、配置、缓存、表单草稿这类内容，应该放在实例自身上，而不是 prototype 上。',
    code: `function TaskBoard() {}

TaskBoard.prototype.items = []

const boardA = new TaskBoard()
const boardB = new TaskBoard()

boardA.items.push("todo")

console.log(boardA.items) // ["todo"]
console.log(boardB.items) // ["todo"]`
  },
  {
    title: '问题 6：重写 `prototype` 之后，旧实例和新实例会发生什么？',
    answer:
      '旧实例仍然指向旧的 prototype，新实例才会连到新的 prototype。重写并不会回溯修改已经创建好的对象。',
    explanation:
      '这题特别适合检验你是否真的理解“实例持有的是原型对象引用”。`new` 的那一刻连的是当时那个 prototype，对之后的整体替换没有自动追踪能力。',
    code: `function User() {}

User.prototype.say = function () {
  return "old"
}

const first = new User()

User.prototype = {
  say() {
    return "new"
  }
}

const second = new User()

console.log(first.say()) // old
console.log(second.say()) // new`
  }
] as const;

const chainQuestions = [
  {
    title: '问题 7：原型链查找到底是怎么一层层发生的？',
    answer:
      '对象自己没有属性时，就去它的原型上找；原型上也没有，就继续找原型的原型，直到 `null` 为止。',
    explanation:
      '这就是为什么普通对象也能调用 `toString`、`hasOwnProperty` 等方法。不是对象自己定义了这些方法，而是原型链最终帮它找到了。',
    code: `const profile = { name: "Rocm" }

console.log("toString" in profile) // true
console.log(profile.hasOwnProperty("name")) // true
console.log(profile.hasOwnProperty("toString")) // false
console.log(Object.getPrototypeOf(profile) === Object.prototype) // true`
  },
  {
    title: '问题 8：`in` 和 `hasOwnProperty` 为什么结果会不一样？',
    answer:
      '`in` 会检查整个原型链；`hasOwnProperty` 只检查对象自身是否直接拥有这个属性。',
    explanation:
      '这题在排查“数据来自后端还是来自默认对象原型”时非常有用。只要涉及属性来源判断，先区分“自有属性”还是“继承属性”。',
    code: `const settings = { theme: "dark" }

console.log("theme" in settings) // true
console.log(settings.hasOwnProperty("theme")) // true

console.log("toString" in settings) // true
console.log(settings.hasOwnProperty("toString")) // false`
  },
  {
    title: '问题 9：`new` 操作符到底做了哪些事？',
    answer:
      '`new` 大致做四件事：创建新对象、把对象原型连到构造函数的 prototype、以新对象作为 this 执行构造函数、按规则返回对象。',
    explanation:
      '理解这里之后，很多题都能自己推出来，比如为什么实例能访问 prototype 方法、为什么构造函数显式 return 对象时会覆盖默认返回值。',
    code: `function createByNew(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype)
  const result = Constructor.apply(instance, args)

  const isObject = result !== null && (typeof result === "object" || typeof result === "function")
  return isObject ? result : instance
}

function User(name) {
  this.name = name
}

const user = createByNew(User, "Rocm")
console.log(user.name) // Rocm`
  },
  {
    title: '问题 10：`instanceof` 为什么能工作？',
    answer:
      '`instanceof` 的核心判断是：右侧构造函数的 `prototype` 是否出现在左侧对象的原型链上。',
    explanation:
      '所以它不是简单检查“是不是这个函数亲手 new 出来的”，而是在检查链路关系。这也是为什么你手动改原型后，`instanceof` 结果会变化。',
    code: `function Person() {}
function Admin() {}

const user = new Person()

console.log(user instanceof Person) // true
console.log(user instanceof Object) // true

Object.setPrototypeOf(user, Admin.prototype)

console.log(user instanceof Person) // false
console.log(user instanceof Admin) // true`
  },
  {
    title: '问题 11：`class` 和 `extends` 在底层和原型链是什么关系？',
    answer:
      '`class` 只是更现代的写法，实例方法本质上仍然挂在 `ClassName.prototype` 上；`extends` 则是在子类 prototype 和父类 prototype 之间建立连接。',
    explanation:
      '如果把 `class` 语法糖还原掉，你依然会看到 prototype、constructor 和原型链查找逻辑，只是语法更清晰了。',
    code: `class Animal {
  speak() {
    return "sound"
  }
}

class Dog extends Animal {
  bark() {
    return "wang"
  }
}

const dog = new Dog()

console.log(Object.getPrototypeOf(dog) === Dog.prototype) // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype) // true
console.log(dog.speak()) // sound`
  },
  {
    title: '问题 12：为什么 `Object.create(null)` 创建出来的对象看起来“不正常”？',
    answer:
      '因为它的原型就是 `null`，所以它不会继承 `Object.prototype` 上的方法，比如 `toString`、`hasOwnProperty`。',
    explanation:
      '这类对象常用来做“纯字典”，避免原型链干扰。但使用时也要意识到：你不能默认它一定有普通对象那套方法。',
    code: `const dict = Object.create(null)

dict.name = "Rocm"

console.log(Object.getPrototypeOf(dict)) // null
console.log("toString" in dict) // false
console.log(typeof dict.hasOwnProperty) // undefined`
  }
] as const;

const pitfallCards = [
  {
    title: '高频误区 1：把 `prototype` 和对象原型当成一回事',
    detail:
      '`Foo.prototype` 是函数身上的一个属性；`Object.getPrototypeOf(foo)` 才是在讨论对象自己的查找链。前者常用于定义共享成员，后者常用于分析属性查找。',
    points: [
      '先问当前主角是函数对象还是实例对象',
      '函数自己也有原型链，但这和实例原型不是同一层讨论',
      '面试里最常见的混淆就出在这一步'
    ]
  },
  {
    title: '高频误区 2：以为改实例属性就是改原型属性',
    detail:
      '给实例赋值只是让对象自己新增或覆盖一个同名属性，不会同步修改 prototype 上的值。命中层级不同，看起来像“改掉了原型”，其实没有。',
    points: [
      '先用 hasOwnProperty 判断命中位置',
      '删除实例同名属性后，原型上的值会重新显现',
      '调试时不要只看最终读到的值，要看值来自哪一层'
    ]
  },
  {
    title: '高频误区 3：重写整个 `prototype` 后忘记 `constructor`',
    detail:
      '你如果直接把 `Foo.prototype` 换成对象字面量，新对象默认没有把 `constructor` 指回 `Foo`。这在继承题和老代码里特别常见。',
    points: [
      '“往原 prototype 上加方法”和“整体替换 prototype”是两回事',
      '很多工具代码会手动把 constructor 补回去',
      '旧实例不会自动切到新 prototype'
    ]
  },
  {
    title: '高频误区 4：把 `__proto__` 当日常业务 API',
    detail:
      '它有助于理解题目，但不是日常首选。代码里优先使用标准 API，更清楚也更稳定。',
    points: [
      '读取用 Object.getPrototypeOf',
      '创建关联优先考虑 class、Object.create 或正常构造流程',
      '动态改原型通常意味着设计需要再审视'
    ]
  }
] as const;

const diagnosticSteps = [
  {
    title: '第一步：先判断属性是“自有”还是“继承”',
    detail: '遇到“为什么能访问到这个属性”时，先查对象自己有没有，再看原型链。'
  },
  {
    title: '第二步：看到 `prototype` 先定位主角是不是函数',
    detail: '如果题目在讨论 `Foo.prototype`，你大概率站在构造函数视角；如果在讨论对象查找，就要切到实例视角。'
  },
  {
    title: '第三步：看到 `instanceof` 就问 prototype 是否在链上',
    detail: '不要死记结果，直接把对象原型一层层往上推，看右侧 prototype 会不会出现。'
  },
  {
    title: '第四步：看到 `class` / `extends` 先还原成原型连接',
    detail: '只要能把语法糖还原到底层模型，很多看起来高级的继承题都会变简单。'
  }
] as const;

const rules = [
  {
    title: '看到 `prototype`，先区分“函数身上”还是“实例身上”',
    detail:
      '函数对象常见的是 `Foo.prototype`；实例对象常见的是 `Object.getPrototypeOf(foo)`。这一步分不清，后面就会一直混。'
  },
  {
    title: '看到属性读取，先问“对象自己有，还是原型链上有”',
    detail: '很多行为差异的根因只是命中层级不同，不一定是值真的被改掉了。'
  },
  {
    title: '看到 `new`，脑中就过一遍“建对象、连原型、绑 this、返回值”',
    detail: '这四步一旦熟了，实例方法、显式 return 对象、继承关系这些题目就能自己推。'
  },
  {
    title: '看到 `class` / `extends`，也要还原到原型链去理解',
    detail: '语法糖能让代码更顺手，但底层模型仍然是原型对象之间的连接和查找。'
  }
] as const;

export default function PrototypeChainSummaryPage() {
  const allQuestions = [...prototypeQuestions, ...chainQuestions];

  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Content Curation / Prototype Chain</span>
        <h2>原型与原型链总结页</h2>
        <p className={styles.heroLead}>
          这页把 JavaScript 里最容易混淆的原型知识拆成可复盘的结构：定义、关系图式、查找规则、高频问题、常见误区和记忆规则。
          重点不是背术语，而是把 `prototype`、对象原型、`new`、`instanceof`、`class`
          这些点统一回到同一个底层模型里理解。
        </p>
        <div className={styles.heroGrid}>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Questions</span>
            <strong className={styles.heroStat}>12</strong>
            <p>覆盖共享方法、查找链、`new` 过程、`instanceof`、`class` 继承、`Object.create(null)` 等高频题。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Focus</span>
            <strong className={styles.heroStat}>Lookup First</strong>
            <p>先判断属性命中在哪一层，再谈继承、覆盖、共享和判断结果，很多题都会自然展开。</p>
          </article>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Scenarios</span>
            <strong className={styles.heroStat}>面试 + 业务</strong>
            <p>不仅能解释题目输出，还能解释为什么工具类、类组件、适配层和字典对象会牵涉到原型链。</p>
          </article>
        </div>
      </header>

      <SectionCard
        note="用意：先把最容易混淆的定义拆开。"
        title="块 1：基础定义（先统一底层模型）"
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
        note="用意：把“函数、prototype、实例、Object.prototype”这几个角色的关系一次串起来。"
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
        <CodeBlock code={relationExample} title="Relationship Map" />
      </SectionCard>

      <SectionCard
        note="用意：聚焦 prototype 本身最容易考、最容易混的点。"
        title="块 3：prototype 相关高频问题"
      >
        <div className={styles.columns}>
          {prototypeQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>Prototype</span>
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
              <CodeBlock code={item.code} title="Prototype Example" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：聚焦原型链查找、`new`、`instanceof` 和 class 继承背后的机制。"
        title="块 4：原型链相关高频问题"
      >
        <div className={styles.columns}>
          {chainQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>Prototype Chain</span>
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
              <CodeBlock code={item.code} title="Chain Example" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把遇到题目时的拆解顺序固定下来，避免只靠背答案。"
        title="块 5：分析题目的四步法"
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
        note="用意：列出最容易在面试和业务里说错的地方。"
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
        note="用意：给复盘和面试前快速过一遍的判断规则。"
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
        note="用意：快速回顾这页涵盖的问题范围。"
        title="块 8：问题总览"
      >
        <div className={styles.columns}>
          {allQuestions.map((item) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>
                  {item.title.includes('new') ||
                  item.title.includes('instanceof') ||
                  item.title.includes('原型链') ||
                  item.title.includes('class') ||
                  item.title.includes('Object.create')
                    ? 'Chain'
                    : 'Prototype'}
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
