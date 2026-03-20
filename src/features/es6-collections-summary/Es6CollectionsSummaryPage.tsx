import type { CSSProperties } from 'react';
import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';

const themeStyle = {
  '--kp-hero-border': '#bfdbfe',
  '--kp-hero-radial-1': 'rgba(59, 130, 246, 0.15)',
  '--kp-hero-radial-2': 'rgba(34, 197, 94, 0.12)',
  '--kp-hero-bg': '#f8fbff',
  '--kp-eyebrow-border': '#bfdbfe',
  '--kp-eyebrow-bg': '#eff6ff',
  '--kp-eyebrow-text': '#1d4ed8',
  '--kp-signal-border': '#bfdbfe',
  '--kp-signal-bg': '#eff6ff',
  '--kp-signal-text': '#1d4ed8',
  '--kp-answer-border': '#bfdbfe',
  '--kp-answer-bg': '#eff6ff',
  '--kp-explain-border': '#bbf7d0',
  '--kp-explain-bg': '#f0fdf4',
  '--kp-code-accent': '#93c5fd',
  '--kp-tag-border': '#bfdbfe',
  '--kp-tag-bg': '#eff6ff',
  '--kp-tag-text': '#1d4ed8',
  '--kp-button-border': '#93c5fd',
  '--kp-button-text': '#1d4ed8',
  '--kp-button-hover': '#eff6ff',
} as CSSProperties;

const heroCards = [
  {
    label: 'Questions',
    value: '8',
    detail: '覆盖 `Map`、`Set`、`WeakMap`、`WeakSet`、键类型、去重、GC 语义和典型使用场景。'
  },
  {
    label: 'Focus',
    value: 'Collection Semantics',
    detail: '核心不是背 API，而是分清“能存什么”“怎么迭代”“会不会阻止垃圾回收”。'
  },
  {
    label: 'Scenarios',
    value: '缓存 / 去重 / 元信息',
    detail: '这些集合类型非常适合做去重、对象元信息存储、临时缓存和访问状态标记。'
  }
] as const;

const definitions = [
  {
    title: '`Map` 是真正意义上的键值集合',
    detail: '键可以是任意类型，不像普通对象那样主要围绕字符串键工作。'
  },
  {
    title: '`Set` 是值唯一集合',
    detail: '它最常见的用途是去重和快速判断某个值是否已经出现。'
  },
  {
    title: '`WeakMap` 的键只能是对象',
    detail: '它不会阻止键对象被垃圾回收，适合存放对象的附加元信息。'
  },
  {
    title: '`WeakSet` 只能存对象引用',
    detail: '它常用于标记某个对象是否已经处理过、访问过、缓存过。'
  },
  {
    title: '`Map` / `Set` 都保留插入顺序',
    detail: '这让它们在需要稳定遍历顺序的场景里比对象更直观。'
  },
  {
    title: '弱引用集合不能被枚举',
    detail: '因为元素可能随时被回收，如果允许遍历，语义会变得不稳定。'
  }
] as const;

const relations = [
  {
    title: '`Object` vs `Map`',
    detail: '对象偏向结构化数据；`Map` 偏向运行时键值集合和任意类型键。',
    signal: 'String Key vs Any Key'
  },
  {
    title: '`Array` vs `Set`',
    detail: '数组强调顺序与重复项；`Set` 强调唯一性与快速存在性判断。',
    signal: 'Ordered vs Unique'
  },
  {
    title: '`Map` vs `WeakMap`',
    detail: '`Map` 可枚举、键不限类型；`WeakMap` 只接受对象键，且不阻止 GC。',
    signal: 'Enumerable vs Weak'
  },
  {
    title: '`Set` vs `WeakSet`',
    detail: '`Set` 可存任意值并可遍历；`WeakSet` 只能存对象引用且不可遍历。',
    signal: 'Value Store vs Marker'
  }
] as const;

const relationCode = `const map = new Map()
const user = { id: 1 }

map.set(user, "active")
map.set("role", "admin")

const set = new Set([1, 2, 2, 3])
const weakMap = new WeakMap([[user, { loaded: true }]])
const weakSet = new WeakSet([user])

console.log(map.get(user)) // active
console.log(set.size) // 3
console.log(weakMap.get(user).loaded) // true
console.log(weakSet.has(user)) // true`;

const collectionQuestions = [
  {
    title: '问题 1：什么时候应该用 `Map`，而不是普通对象？',
    answer: '当你需要任意类型键、稳定的插入顺序、频繁增删或更清晰的集合语义时，`Map` 往往更合适。',
    explanation:
      '对象更适合描述“固定结构数据”，`Map` 更适合描述“运行时动态键值集合”。这是两类场景，不只是 API 写法不同。',
    code: `const cache = new Map()
const node = { id: 1 }

cache.set(node, "mounted")
cache.set("theme", "light")

console.log(cache.get(node))
console.log(cache.get("theme"))`,
    codeTitle: 'Map Example'
  },
  {
    title: '问题 2：为什么很多人用 `Set` 来做数组去重？',
    answer: '因为 `Set` 天然保证值唯一。把数组放进去再转回数组，就能快速得到去重结果。',
    explanation:
      '这适合原始值去重场景。要注意：对象去重只看引用是否相同，不会按内容深度比较。',
    code: `const ids = [1, 2, 2, 3, 3, 4]
const uniqueIds = [...new Set(ids)]

console.log(uniqueIds)

const list = [{ id: 1 }, { id: 1 }]
console.log(new Set(list).size) // 2`,
    codeTitle: 'Set Dedup Example'
  },
  {
    title: '问题 3：`Map` 的键比较规则有什么容易忽略的点？',
    answer: '`Map` 对对象键比较的是引用身份，不是结构内容；对原始值则按 `SameValueZero` 规则比较。',
    explanation:
      '这意味着两个看起来内容一样的对象，作为键时仍然是两个不同键。这和对象属性访问的字符串化行为完全不同。',
    code: `const map = new Map()

map.set({ id: 1 }, "first")
map.set({ id: 1 }, "second")

console.log(map.size) // 2

const key = { id: 2 }
map.set(key, "stable")
console.log(map.get(key))`,
    codeTitle: 'Key Equality Example'
  },
  {
    title: '问题 4：为什么 `WeakMap` 不允许用字符串做键？',
    answer: '因为 `WeakMap` 的设计目标是让键对象可以被垃圾回收，所以键必须是对象引用，原始值不符合这个语义。',
    explanation:
      '面试里要把“弱引用”说清楚：不是值变弱，而是集合不会因为保存了这个键就阻止该对象被回收。',
    code: `const meta = new WeakMap()
const user = { id: 1 }

meta.set(user, { visited: true })
console.log(meta.get(user))

// meta.set("name", "rocm") // TypeError`,
    codeTitle: 'WeakMap Key Example'
  }
] as const;

const weakQuestions = [
  {
    title: '问题 5：为什么 `WeakMap` / `WeakSet` 不能遍历？',
    answer: '因为它们的元素可能随时被垃圾回收，如果允许枚举，结果会变得不可预测。',
    explanation:
      '不能遍历是它们的设计特征，不是功能缺失。它们更适合“辅助存储”而不是“主数据集合”。',
    code: `const visited = new WeakSet()
const node = { id: 1 }

visited.add(node)
console.log(visited.has(node))

// for (const item of visited) {} // TypeError`,
    codeTitle: 'WeakSet Example'
  },
  {
    title: '问题 6：`WeakMap` 在前端里最典型的实际场景是什么？',
    answer: '给 DOM 节点、组件实例或任意对象挂载元信息，而不想手动清理这份映射时，`WeakMap` 很合适。',
    explanation:
      '例如节点布局缓存、请求状态附着、对象私有元数据，这些都不应该反过来阻止对象被释放。',
    code: `const layoutCache = new WeakMap()

function rememberLayout(node, layout) {
  layoutCache.set(node, layout)
}

function readLayout(node) {
  return layoutCache.get(node)
}`,
    codeTitle: 'Metadata Cache Example'
  },
  {
    title: '问题 7：`Set` 做对象去重为什么经常不符合预期？',
    answer: '因为 `Set` 对对象比较的是引用，不是内容。两个内容相同但引用不同的对象仍会被视为不同值。',
    explanation:
      '如果你想按对象某个字段去重，通常要先映射成主键，或配合 `Map` 按业务主键重建集合。',
    code: `const users = [{ id: 1 }, { id: 1 }, { id: 2 }]
const direct = [...new Set(users)]

const deduped = [...new Map(users.map((item) => [item.id, item])).values()]

console.log(direct.length) // 3
console.log(deduped.length) // 2`,
    codeTitle: 'Object Dedup Example'
  },
  {
    title: '问题 8：`Map` / `Set` 和对象 / 数组的性能题该怎么答？',
    answer: '不要泛泛说谁更快，而要看操作模式。高频增删查、集合语义明确时，`Map` / `Set` 通常更合适；固定结构展示数据时，对象 / 数组更自然。',
    explanation:
      '这类题不应回答成“永远用 Map”。数据结构选择首先是语义问题，其次才是性能微调。',
    code: `const selectedIds = new Set()

function toggle(id) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id)
    return
  }

  selectedIds.add(id)
}`,
    codeTitle: 'Set Toggle Example'
  }
] as const;

const diagnosticSteps = [
  {
    title: '第一步：先问这是“结构化对象”还是“运行时集合”',
    detail: '如果是动态键值、缓存、标记和去重，优先想到 `Map` / `Set`。'
  },
  {
    title: '第二步：再问键或值是否必须是对象',
    detail: '一旦涉及弱引用语义，立刻切到 `WeakMap` / `WeakSet` 的判断模型。'
  },
  {
    title: '第三步：判断是否需要遍历和序列化',
    detail: '需要遍历、调试、序列化时，弱引用集合通常不是首选。'
  },
  {
    title: '第四步：对象去重要先确认按“引用”还是按“业务主键”',
    detail: '很多集合题本质不是 ES6 API 题，而是“你到底想按什么维度去重”。'
  }
] as const;

const pitfalls = [
  {
    title: '高频误区 1：把 `Map` 当成语法更潮的对象',
    detail: '它不是对象替代品，而是针对运行时集合语义设计的数据结构。',
    points: ['对象适合结构描述', 'Map 适合动态集合', '不要为了新而新']
  },
  {
    title: '高频误区 2：认为 `Set` 可以按对象内容自动去重',
    detail: '对象比较的是引用身份，不是内容深比较。',
    points: ['相同结构不等于相同引用', '对象去重常要配合主键', 'Map 往往比 Set 更好用']
  },
  {
    title: '高频误区 3：把弱引用集合当成普通容器来遍历',
    detail: '弱引用集合就是为了辅助存储而设计，不能当主数据集合来迭代展示。',
    points: ['不能遍历', '不能安全统计大小', '更适合缓存和元信息']
  },
  {
    title: '高频误区 4：性能题只会说“Map 更快”',
    detail: '真正好的回答应该结合场景和语义，而不是抛一个绝对结论。',
    points: ['先讲数据结构匹配', '再讲增删查模式', '最后再谈性能']
  }
] as const;

const rules = [
  {
    title: '动态键值集合先想到 `Map`',
    detail: '尤其是键不是字符串、需要保序、需要高频增删查时。'
  },
  {
    title: '去重与存在性判断先想到 `Set`',
    detail: '但对象去重要先确认是不是按引用去重。'
  },
  {
    title: '对象元信息缓存先想到 `WeakMap`',
    detail: '不想因为缓存反过来阻止对象被释放时尤其适合。'
  },
  {
    title: '看到弱引用集合，就默认它不是拿来遍历的',
    detail: '它的重点是生命周期管理，而不是展示与遍历。'
  }
] as const;

export default function Es6CollectionsSummaryPage() {
  return (
    <KnowledgeSummaryPage
      definitions={definitions}
      definitionsNote="用意：先把四种 ES6 集合的定位拆开。"
      definitionsTitle="块 1：基础定义（先分清集合语义）"
      diagnosticNote="用意：拿到题时，先按这套顺序判断数据结构。"
      diagnosticSteps={diagnosticSteps}
      diagnosticTitle="块 5：四步拆题法"
      eyebrow="JS Content / ES6 Collections"
      heroCards={heroCards}
      lead="这页把 `Map`、`Set`、`WeakMap`、`WeakSet` 放到同一个模型里理解：它们分别适合存什么、为什么会有弱引用语义、和对象 / 数组到底差在哪。重点不是背 API，而是搞清楚什么时候该选哪一个。"
      overviewNote="用意：快速回顾这页覆盖的核心问题。"
      overviewTitle="块 8：问题总览"
      pitfalls={pitfalls}
      pitfallsNote="用意：集中处理 ES6 集合题里最常见的错误表达。"
      pitfallsTitle="块 6：常见误区"
      questionGroups={[
        {
          title: '块 3：Map / Set 高频问题',
          note: '用意：先把最常见的键值集合和去重问题讲透。',
          label: 'Collections',
          questions: collectionQuestions,
        },
        {
          title: '块 4：WeakMap / WeakSet 高频问题',
          note: '用意：把弱引用集合和真实前端场景绑定起来理解。',
          label: 'Weak Collections',
          questions: weakQuestions,
        },
      ]}
      relationCode={relationCode}
      relationCodeTitle="Collections Map"
      relations={relations}
      relationsNote="用意：把 `Object / Array / Map / Set / WeakMap / WeakSet` 的关系一次串起来。"
      relationsTitle="块 2：核心关系速览"
      rules={rules}
      rulesNote="用意：面试复盘时快速过一遍最稳定的判断规则。"
      rulesTitle="块 7：记忆规则"
      themeStyle={themeStyle}
      title="ES6 集合类型总结页"
    />
  );
}
