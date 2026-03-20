import type { FeatureGuide } from './feature-guide-types';

export const featureGuides: Partial<Record<string, FeatureGuide>> = {
  'tailwind-demo': {
    heading: 'Tailwind Demo 使用概览',
    description: '这个页面重点演示 Tailwind 在复杂视觉层、状态切换和响应式断点中的组合能力。',
    blocks: [
      {
        title: '适用场景',
        summary: '当你需要快速构建复杂 UI 且希望样式逻辑靠近组件时，Tailwind 的 utility 组合效率很高。',
        bullets: ['适合快速迭代视觉方案', '适合做状态切换样式', '适合模块级样式实验']
      },
      {
        title: '典型写法',
        summary: '通过断点、状态和任意值组合一个较复杂的容器样式。',
        code: {
          language: 'tsx',
          title: 'Responsive + State + Arbitrary Values',
          snippet: `function HeroCard() {
  return (
    <article className="relative rounded-2xl border border-slate-200 p-5
      shadow-[0_10px_40px_-18px_rgba(2,132,199,0.45)]
      lg:grid lg:grid-cols-[1.2fr_0.8fr]">
      <h3 className="text-xl font-bold">Tailwind Composition</h3>
      <p className="mt-2 text-slate-600">Utility classes stay near component logic.</p>
    </article>
  );
}`
        }
      }
    ]
  },
  'responsive-web-demo': {
    heading: 'Responsive Web Demo 使用概览',
    description: '这是一个场景化长网页，覆盖极窄屏、密集数据、粘性布局、局部横向滚动等真实适配难点。',
    blocks: [
      {
        title: '适配策略总览',
        summary: '核心原则是“结构重排优先于缩放”，并且把横向滚动限制在局部容器。',
        bullets: ['320/360/390 宽度专项检查', '小屏按钮保持 44px+', '局部 overflow，不做全局横滚']
      },
      {
        title: '关键 CSS 模式',
        summary: '使用多断点兜底，确保极窄屏时文本、按钮和表格仍可用。',
        code: {
          language: 'css',
          title: 'Small-width Fallback',
          snippet: `.matrixWrap { overflow-x: auto; }
@media (max-width: 420px) {
  .heroActions { flex-direction: column; }
  .primaryAction, .secondaryAction { width: 100%; min-height: 44px; }
}
@media (max-width: 340px) {
  .heroTitle { font-size: 22px; }
  .track { grid-auto-columns: minmax(160px, 88vw); }
}`
        }
      }
    ]
  },
  'shadcn-demo': {
    heading: 'shadcn/ui Demo 使用概览',
    description: '这个页面重点不在单个组件孤立展示，而在于用 shadcn/ui 的拼装思路构建一个两屏以上的复杂工作台页面。',
    blocks: [
      {
        title: 'Step 1 · 先用 Card / Badge / Button 建首屏骨架',
        summary: 'shadcn/ui 常见页面会先搭表面层、标题层级和主次动作，再把数据卡片和状态标签填进去。',
        code: {
          language: 'tsx',
          title: 'Hero Composition',
          snippet: `<Card>
  <CardHeader>
    <Badge>Workspace Status</Badge>
    <CardTitle>Registry preview orchestration</CardTitle>
    <CardDescription>把组件串成真实页面，而不是孤立样式。</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button>Promote Preview</Button>
    <Button variant="secondary">Sync Tokens</Button>
  </CardFooter>
</Card>`
        }
      },
      {
        title: 'Step 2 · 用 Tabs 在单页里切多个信息视图',
        summary: 'Tabs 适合在不离开当前页面上下文的前提下，切换 overview、pipeline、activity 之类的内容面板。',
        bullets: ['不需要新路由即可切内容区', '保持顶部统计和操作栏可见', '适合长页中的中段内容切换']
      },
      {
        title: 'Step 3 · 配置面板中组合 Input / Textarea / Switch / Checkbox',
        summary: 'shadcn/ui 很适合拼密集但清晰的表单面板，关键是 label、hint、间距和边框语义统一。',
        code: {
          language: 'tsx',
          title: 'Control Panel Pattern',
          snippet: `<label className="grid gap-2">
  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Project title</span>
  <Input value={projectName} onChange={...} />
</label>
<Select value={stackPreset} onValueChange={setStackPreset}>
  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
</Select>
<Switch checked={isLiveMode} onCheckedChange={setIsLiveMode} />
<Checkbox checked={publishDocs} onCheckedChange={setPublishDocs} />`
        }
      },
      {
        title: 'Step 4 · 在第二屏安排表格和行级操作',
        summary: '为了证明组件库能支撑真实后台场景，必须把 table、badge、progress 和 row actions 放进同一个密集区。',
        bullets: ['表格要保持列层级清晰', '状态用 badge，进度用 progress', '行操作只保留最常用的 1-2 个']
      }
    ]
  },
  'design-patterns': {
    heading: '设计模式页使用概览',
    description: '这页把前端里最常见的设计模式按“问题域 -> 适用场景 -> 实际案例”整理，适合做开发前选型参考。',
    blocks: [
      {
        title: 'Step 1 · 先按问题域归类，不要直接背术语',
        summary: 'React 场景下，最常见的问题不是“我要不要用某个 GoF 名字”，而是“我要解决组合、状态还是集成问题”。',
        bullets: ['组合问题：Compound / Controlled / Headless', '状态问题：Provider / Hook / Reducer / Container', '集成问题：Adapter / Strategy / Facade']
      },
      {
        title: 'Step 2 · 模式必须绑定真实变化点',
        summary: '没有变化点时，模式只会增加抽象层；有明显变化点时，模式才会真正降低复杂度。',
        code: {
          language: 'tsx',
          title: 'Strategy Selection',
          snippet: `const strategy = file.size > LARGE_LIMIT
  ? multipartUploadStrategy
  : directUploadStrategy;

await strategy.execute(file);`
        }
      },
      {
        title: 'Step 3 · 前端模式通常是组合使用',
        summary: '真实页面里经常不是单独出现一个模式，而是容器组件 + 自定义 Hook + 组合组件一起出现。',
        code: {
          language: 'tsx',
          title: 'Container + Presentational',
          snippet: `function OrdersPageContainer() {
  const query = useOrdersQuery();
  const [filter, setFilter] = useState("pending");

  return (
    <OrdersTable
      rows={query.data ?? []}
      filter={filter}
      onFilterChange={setFilter}
      loading={query.isPending}
    />
  );
}`
        }
      }
    ]
  },
  'closure-this-summary': {
    heading: '闭包与 this 总结页使用概览',
    description: '这页把前端里最常见的闭包和 this 指向问题，统一整理成“题目 -> 答案 -> 解读 -> 代码”的形式。',
    blocks: [
      {
        title: 'Step 1 · 先区分两个底层模型',
        summary: '闭包关注的是词法作用域与变量持有；this 关注的是调用方式与执行上下文。',
        bullets: ['闭包：谁被引用了，谁就可能被保留', 'this：谁调用了函数，谁更可能成为 this']
      },
      {
        title: 'Step 2 · 闭包问题常见在循环、监听器、异步回调',
        summary: '当你看到 for 循环、setTimeout、事件监听、effect 回调时，要先想“这里会不会引用到旧变量或保留大对象”。',
        code: {
          language: 'js',
          title: 'Loop + Closure',
          snippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`
        }
      },
      {
        title: 'Step 3 · this 问题常见在方法脱离对象调用',
        summary: '方法作为回调传出去、赋值给变量、交给事件系统后，最容易出现 this 丢失。',
        code: {
          language: 'js',
          title: 'Method Reference',
          snippet: `const fn = user.speak;
fn(); // this 不再是 user`
        }
      }
    ]
  },
  'prototype-chain-summary': {
    heading: '原型与原型链总结页使用概览',
    description: '这页把 prototype、实例原型、原型链查找、instanceof、class 语法糖等问题统一放回原型模型里理解。',
    blocks: [
      {
        title: 'Step 1 · 先区分函数的 prototype 和实例的原型',
        summary: '构造函数常见的是 `Foo.prototype`；实例常见的是 `Object.getPrototypeOf(foo)`。两者有关联，但不是同一个概念。',
        bullets: ['函数身上的 prototype：给实例共享方法', '实例身上的原型：决定属性查找路径']
      },
      {
        title: 'Step 2 · 所有原型链题都可以还原成属性查找',
        summary: '对象自己没有，就去原型上找；原型也没有，就继续向上，直到 null 为止。',
        code: {
          language: 'js',
          title: 'Property Lookup',
          snippet: `const profile = { name: "Rocm" };
profile.toString(); // 向上找到 Object.prototype.toString`
        }
      },
      {
        title: 'Step 3 · class 只是更现代的语法糖',
        summary: '实例方法本质仍然挂在 prototype 上，继承本质上也还是通过原型链连接。',
        code: {
          language: 'js',
          title: 'Class Prototype',
          snippet: `class User {
  speak() {
    return "hi";
  }
}

console.log(User.prototype.speak);`
        }
      }
    ]
  },
  'event-loop-summary': {
    heading: '事件循环与异步总结页使用概览',
    description: '这页把调用栈、宏任务、微任务、Promise、async/await 与渲染时机整理成一套统一的事件循环模型。',
    blocks: [
      {
        title: 'Step 1 · 先把同步、微任务、宏任务分开',
        summary: '绝大多数输出题都先从这一步开始，先找同步代码，再标记每个回调进入哪个队列。',
        bullets: ['同步代码先执行', '微任务在当前宏任务结束后清空', '宏任务进入下一轮调度']
      },
      {
        title: 'Step 2 · 理解 await 的恢复时机',
        summary: '`await` 写起来像同步，但恢复执行时机仍然建立在 Promise 微任务之上，所以常常出现在输出顺序题里。',
        code: {
          language: 'js',
          title: 'Await Resume',
          snippet: `async function run() {
  console.log("start");
  await Promise.resolve();
  console.log("after");
}`
        }
      },
      {
        title: 'Step 3 · 把卡顿问题落回主线程占用',
        summary: '长同步任务和微任务饥饿都会拖住渲染机会，所以事件循环不仅是输出题，也和性能优化强相关。',
        code: {
          language: 'js',
          title: 'Chunk Heavy Work',
          snippet: `function runChunked(list) {
  let index = 0;
  function tick() {
    const end = Math.min(index + 100, list.length);
    while (index < end) index += 1;
    if (index < list.length) setTimeout(tick, 0);
  }
  tick();
}`
        }
      }
    ]
  },
  'copy-reference-summary': {
    heading: '深拷贝、浅拷贝与引用传递使用概览',
    description: '这页把对象赋值、浅拷贝、深拷贝和函数参数共享传递放在同一个模型里讲清楚，并且加入了运行结果展示。',
    blocks: [
      {
        title: 'Step 1 · 先区分赋值、浅拷贝和深拷贝',
        summary: '很多题不是“深拷贝写法题”，而是先要判断当前到底有没有创建新对象。',
        bullets: ['赋值：默认共享同一个对象', '浅拷贝：第一层是新的', '深拷贝：嵌套层也要断开']
      },
      {
        title: 'Step 2 · 传参问题要按共享传递理解',
        summary: '函数参数拿到的是一份值拷贝；如果这个值恰好是对象引用，就会共享同一个对象本体。',
        code: {
          language: 'js',
          title: 'Pass By Sharing',
          snippet: `function update(user) {
  user.name = "Updated";
  user = { name: "Other" };
}`
        }
      },
      {
        title: 'Step 3 · 深拷贝方案必须看数据类型边界',
        summary: 'JSON 方案适合纯数据对象，`structuredClone` 更适合现代复杂数据，但也并非能处理所有值。',
        code: {
          language: 'js',
          title: 'Structured Clone',
          snippet: `const cloned = structuredClone(source);
console.log(cloned.tags === source.tags); // false`
        }
      }
    ]
  },
  'browser-url-lifecycle': {
    heading: '从输入 URL 到页面展示使用概览',
    description: '这页把地址解析、DNS、连接建立、资源请求和页面渲染放到一条完整链路里讲清楚。',
    blocks: [
      { title: 'Step 1 · 先把链路分成网络阶段和渲染阶段', summary: '前半段偏请求和连接，后半段偏解析和页面生成。', bullets: ['URL 解析', 'DNS / TCP / TLS', 'HTML / CSS / JS 渲染'] },
      { title: 'Step 2 · 流程题最好顺手带上性能视角', summary: '这样回答不会停留在背顺序，而是能自然连到白屏、首屏慢和调试思路。', code: { language: 'js', title: 'Main Flow', snippet: `URL -> DNS -> TCP/TLS -> HTTP -> HTML/CSS/JS -> Render` } },
    ]
  },
  'browser-cache-summary': {
    heading: '浏览器缓存使用概览',
    description: '这页把强缓存、协商缓存和常见缓存头用更工程化的方式整理起来。',
    blocks: [
      { title: 'Step 1 · 先问有没有发请求', summary: '没发请求偏强缓存，发了再看是不是协商缓存。', bullets: ['强缓存：直接用', '协商缓存：先确认'] },
      { title: 'Step 2 · 按资源类型答缓存策略', summary: 'HTML、静态资源、接口数据，通常不该用一套缓存策略。', code: { language: 'js', title: 'Strategy', snippet: `HTML -> 保守缓存\nhash 静态资源 -> 长缓存\n接口 -> 看实时性` } },
    ]
  },
  'browser-rendering-summary': {
    heading: '重排和重绘使用概览',
    description: '这页把 layout 和 paint 的区别、成本和性能影响放到同一个渲染视角里理解。',
    blocks: [
      { title: 'Step 1 · 先判断有没有影响几何信息', summary: '影响尺寸和位置时更容易重排，只改外观时通常更偏重绘。', bullets: ['layout change', 'paint change', 'forced layout'] },
      { title: 'Step 2 · 动画题要顺手提 transform / opacity', summary: '这会让你的回答从定义题直接提升到性能题。', code: { language: 'js', title: 'Animation Hint', snippet: `bad -> top/left\ngood -> transform/opacity` } },
    ]
  },
  'browser-events-summary': {
    heading: '事件传播使用概览',
    description: '这页把捕获、冒泡、事件委托和常见交互 bug 放到同一条传播路径里理解。',
    blocks: [
      { title: 'Step 1 · 先记住方向', summary: '捕获从外往里，冒泡从里往外，这一步决定很多题会不会答反。', bullets: ['capture', 'target', 'bubble'] },
      { title: 'Step 2 · 事件委托要和动态列表场景绑定', summary: '只背定义不够，最好直接联想到列表点击和统一监听。', code: { language: 'js', title: 'Delegate', snippet: `list.addEventListener("click", (event) => {\n  const item = event.target.closest("[data-id]")\n})` } },
    ]
  },
  'browser-cross-origin-summary': {
    heading: '跨域使用概览',
    description: '这页把同源策略、CORS、JSONP、代理和带凭证请求放到同一个跨域模型里讲清楚。',
    blocks: [
      { title: 'Step 1 · 先把跨域理解成浏览器限制', summary: '很多时候请求并不是发不出去，而是响应不让前端脚本读。', bullets: ['同源策略', '浏览器限制', '服务端可达不等于前端可读'] },
      { title: 'Step 2 · 开发代理和生产网关都值得主动提', summary: '这会让跨域题从“背知识点”变成“懂工程方案”。', code: { language: 'js', title: 'Proxy', snippet: `前端 -> 本地同源代理 -> 真实接口` } },
    ]
  },
  'browser-storage-summary': {
    heading: '浏览器存储使用概览',
    description: '这页把 cookie、localStorage、sessionStorage、IndexedDB 放到生命周期和场景视角里统一整理。',
    blocks: [
      { title: 'Step 1 · 先看生命周期和是否自动带请求', summary: '这通常比背容量更重要。', bullets: ['cookie', 'localStorage', 'sessionStorage', 'IndexedDB'] },
      { title: 'Step 2 · 存储题最好顺手带安全视角', summary: '很多选型问题不是“能不能存”，而是“适不适合这样存”。', code: { language: 'js', title: 'Storage View', snippet: `生命周期\n自动发送?\n数据量\n安全性` } },
    ]
  },
  'browser-security-summary': {
    heading: '浏览器安全使用概览',
    description: '这页把 XSS、CSRF、点击劫持和对应防护方式整理成一条更容易理解的安全主线。',
    blocks: [
      { title: 'Step 1 · 先分清是脚本注入、借身份请求还是诱导误点', summary: '这一步能快速把 XSS、CSRF、点击劫持分开。', bullets: ['XSS', 'CSRF', 'Clickjacking'] },
      { title: 'Step 2 · 安全题最好按攻击路径 + 防护点回答', summary: '这样不会只停留在缩写解释，会更像真实工程理解。', code: { language: 'js', title: 'Answer Structure', snippet: `攻击路径 -> 受害条件 -> 防护点 -> 工程措施` } },
    ]
  },
  'es6-collections-summary': {
    heading: 'ES6 集合类型使用概览',
    description: '这页把 Map、Set、WeakMap、WeakSet 放在同一个集合模型里理解，重点是语义和使用场景。',
    blocks: [
      {
        title: 'Step 1 · 先分清集合语义',
        summary: 'Map 是键值集合，Set 是唯一值集合，WeakMap / WeakSet 则引入了弱引用和生命周期语义。',
        bullets: ['Map：任意类型键', 'Set：值唯一', 'WeakMap / WeakSet：对象弱引用']
      },
      {
        title: 'Step 2 · 对象去重和对象缓存是两类不同问题',
        summary: '对象去重通常要按业务主键来做；对象元信息缓存则往往更适合 WeakMap。',
        code: {
          language: 'js',
          title: 'Map Dedup By Id',
          snippet: `const deduped = [...new Map(users.map((item) => [item.id, item])).values()];`
        }
      },
      {
        title: 'Step 3 · 弱引用集合不是主数据容器',
        summary: 'WeakMap / WeakSet 不能遍历，更适合做辅助状态、私有元信息和对象级缓存。',
        code: {
          language: 'js',
          title: 'Weak Metadata',
          snippet: `const meta = new WeakMap();
meta.set(node, { measured: true });`
        }
      }
    ]
  },
  'functional-utils-summary': {
    heading: '函数工具使用概览',
    description: '这页把防抖、节流、柯里化、偏函数和函数组合放在一起，重点是场景选择而不是死背模板。',
    blocks: [
      {
        title: 'Step 1 · 先判断是在控频还是在组织函数',
        summary: '防抖 / 节流解决调用时机；柯里化 / 组合解决参数复用和函数拆分。',
        bullets: ['控频：debounce / throttle', '结构：curry / compose / pipe']
      },
      {
        title: 'Step 2 · 搜索、防抖；滚动、节流',
        summary: '前者更关心最终输入，后者更关心持续反馈，这就是最稳定的答题切入点。',
        code: {
          language: 'js',
          title: 'Rate Control',
          snippet: `const onSearch = debounce(requestSearch, 250);
const onScroll = throttle(syncProgress, 100);`
        }
      },
      {
        title: 'Step 3 · 组合的价值是把逻辑拆小',
        summary: '重点不是 reduce 写法，而是能不能把数据处理链拆成多个清晰步骤。',
        code: {
          language: 'js',
          title: 'Pipe Example',
          snippet: `const normalize = pipe(trim, lower, withPrefix);`
        }
      }
    ]
  },
  'module-system-summary': {
    heading: '模块化：ESM 与 CommonJS 使用概览',
    description: '这页把 ESM、CommonJS、静态分析、live binding 和工程互操作问题整理成一个统一视角。',
    blocks: [
      {
        title: 'Step 1 · 先把模块题从语法题提升到工程题',
        summary: '模块系统的真正差异，不只是 import 和 require 写法，而是分析能力、加载时机和互操作成本。',
        bullets: ['静态分析', '运行时加载', '构建工具兼容']
      },
      {
        title: 'Step 2 · tree shaking 的核心前提是静态结构',
        summary: 'ESM 不是自带 tree shaking，而是更适合让打包器识别未使用导出。',
        code: {
          language: 'js',
          title: 'Static Export',
          snippet: `export const add = (a, b) => a + b;
import { add } from "./math.js";`
        }
      },
      {
        title: 'Step 3 · live binding 和循环依赖必须一起理解',
        summary: '模块题里很多“为什么这里拿到的是最新值”或“为什么这里是 undefined”都和绑定与初始化顺序有关。',
        code: {
          language: 'js',
          title: 'Live Binding',
          snippet: `export let count = 0;
export function increment() { count += 1; }`
        }
      }
    ]
  },
  'vite-webpack-summary': {
    heading: 'Vite 和 Webpack 使用概览',
    description: '这页把开发体验、生产构建、插件生态和迁移成本放在一起，避免把两者对比答成单纯快慢题。',
    blocks: [
      {
        title: 'Step 1 · 先分开发期和生产期',
        summary: '开发体验和生产打包不是同一个问题，这一步能让你的回答立刻变清晰。',
        bullets: ['开发期看冷启动和 HMR', '生产期看拆包、压缩和兼容', '不要把两个阶段揉在一起']
      },
      {
        title: 'Step 2 · 再把项目阶段带进来',
        summary: '新项目和老项目的答案经常不同，迁移成本和历史包袱不能忽略。',
        code: {
          language: 'js',
          title: 'Tradeoff View',
          snippet: `新项目 -> 更看开发体验
老项目 -> 更看兼容与迁移成本`
        }
      }
    ]
  },
  'tree-shaking-summary': {
    heading: 'Tree Shaking 使用概览',
    description: '这页把静态分析、副作用、导入方式和组件库设计放回同一条摇树主线里理解。',
    blocks: [
      {
        title: 'Step 1 · 先讲静态分析，再讲副作用',
        summary: 'Tree shaking 的关键不是“想删就删”，而是“能安全确认这段代码没必要保留”。',
        bullets: ['ESM 更利于分析', '副作用会让工具更保守', '验证要看产物']
      },
      {
        title: 'Step 2 · 组件库场景更容易拉开差异',
        summary: '导出方式、入口结构和副作用控制，会直接影响消费方的摇树效果。',
        code: {
          language: 'js',
          title: 'Library Export',
          snippet: `export { Button } from './button'
export { Dialog } from './dialog'`
        }
      }
    ]
  },
  'babel-summary': {
    heading: 'Babel 使用概览',
    description: '这页把 Babel 放回源码转换流水线里理解，重点区分语法转换、polyfill 和打包职责。',
    blocks: [
      {
        title: 'Step 1 · 把 Babel 当成 parse / transform / generate 流水线',
        summary: '这样会比背 preset 名字更稳定，也更方便解释插件到底在做什么。',
        bullets: ['先 parse 成 AST', '再 transform', '最后 generate 代码']
      },
      {
        title: 'Step 2 · 语法兼容和运行时能力分开答',
        summary: 'Babel 能改写语法，但不代表环境自动拥有新 API。',
        code: {
          language: 'js',
          title: 'Syntax vs Runtime',
          snippet: `语法转换 -> Babel
API 能力 -> polyfill / runtime`
        }
      }
    ]
  },
  'typescript-interview-summary': {
    heading: 'TypeScript 常见题使用概览',
    description: '这页重点不在炫技类型，而在于用泛型、联合类型、类型守卫和 infer 表达真实数据关系。',
    blocks: [
      {
        title: 'Step 1 · 先判断是复用问题还是不确定问题',
        summary: '复用关系多半是泛型，不确定范围多半是联合类型。',
        bullets: ['泛型看复用', '联合看不确定', '守卫负责缩小范围']
      },
      {
        title: 'Step 2 · infer 主要是做类型提取',
        summary: '它最适合从现有结构里拿信息，而不是把类型写成谜语。',
        code: {
          language: 'ts',
          title: 'Infer Example',
          snippet: `type Unwrap<T> = T extends Promise<infer Value> ? Value : T`
        }
      }
    ]
  },
  'package-manager-summary': {
    heading: '包管理使用概览',
    description: '这页把 npm、yarn、pnpm 放回依赖安装、锁文件、workspace 和 CI 一致性里比较。',
    blocks: [
      {
        title: 'Step 1 · 包管理题先讲 lockfile',
        summary: '这比单独比较命令更有工程价值，因为它直接关系到团队安装是否一致。',
        bullets: ['锁定依赖树', '减少环境漂移', '支撑 CI 一致性']
      },
      {
        title: 'Step 2 · Monorepo 再讲 workspace',
        summary: '多包协作场景里，workspace 和依赖链接方式会比单项目更重要。',
        code: {
          language: 'bash',
          title: 'Workspace Shape',
          snippet: `packages/
  ui/
  web/
  admin/`
        }
      }
    ]
  },
  'engineering-workflow-summary': {
    heading: '工程质量流程使用概览',
    description: '这页把 CI/CD、代码规范、lint、测试和发布回滚串成一条完整质量链路。',
    blocks: [
      {
        title: 'Step 1 · 先讲风险在哪一层被挡住',
        summary: '本地、PR、CI、发布后监控分别负责不同的质量挡板。',
        bullets: ['本地快速反馈', 'PR 自动检查', 'CI 干净复验', '发布可回滚']
      },
      {
        title: 'Step 2 · 机器检查和人工评审分工',
        summary: '把机械规则交给自动化，人审聚焦设计、边界和可读性。',
        code: {
          language: 'bash',
          title: 'Review Split',
          snippet: `自动化 -> lint / typecheck / test
人工 -> 设计 / 边界 / 可维护性`
        }
      }
    ]
  },
  'engineering-optimization-summary': {
    heading: '工程化优化使用概览',
    description: '这页把代码分割、懒加载、缓存、运行时优化和监控验证整理成一个完整闭环。',
    blocks: [
      {
        title: 'Step 1 · 优化先分层',
        summary: '构建期、加载期、运行期、监控验证这四层能让你的回答更完整。',
        bullets: ['构建期更看产物', '加载期更看首屏', '运行期更看交互', '监控负责验证']
      },
      {
        title: 'Step 2 · 代码分割和懒加载分开答',
        summary: '一个解决怎么拆，一个解决何时加载。',
        code: {
          language: 'tsx',
          title: 'Lazy Route',
          snippet: `const ReportPage = lazy(() => import('./ReportPage'))`
        }
      }
    ]
  },
  'module-tools-summary': {
    heading: '模块化：ESM 和 CommonJS 使用概览',
    description: '这页把静态分析、运行时加载、live binding 和互操作放在一起理解，比单纯比语法更接近真实工程。',
    blocks: [
      {
        title: 'Step 1 · 模块题先讲静态结构和时机',
        summary: 'ESM 更静态，CommonJS 更偏运行时动态加载，这会直接影响构建优化。',
        bullets: ['ESM 更利于分析', 'CommonJS 更灵活', '时机会影响值是否可用']
      },
      {
        title: 'Step 2 · live binding 和循环依赖要顺手提',
        summary: '很多模块题真正的坑都在值绑定和初始化顺序上。',
        code: {
          language: 'js',
          title: 'Live Binding',
          snippet: `export let count = 0
export const inc = () => { count += 1 }`
        }
      }
    ]
  },
  'list-performance-scenario': {
    heading: '大列表卡顿优化使用概览',
    description: '这页把节点数、单行重量、搜索重算、虚拟列表和服务端分页放回同一条优化主线里理解。',
    blocks: [
      {
        title: 'Step 1 · 先区分卡在首屏、滚动还是搜索',
        summary: '三种卡顿的瓶颈通常不同，别一上来就只说虚拟列表。',
        bullets: ['首屏更看节点量', '滚动更看可见区和单行重量', '搜索更看重算频率']
      },
      {
        title: 'Step 2 · 优化顺序通常是先减节点，再降重算',
        summary: '分页、虚拟列表、deferred value 和服务端筛选经常是组合使用。',
        code: {
          language: 'tsx',
          title: 'Deferred Search',
          snippet: `const deferredKeyword = useDeferredValue(keyword)
const filteredRows = useMemo(() => filterRows(rows, deferredKeyword), [rows, deferredKeyword])`
        }
      }
    ]
  },
  'white-screen-debug-scenario': {
    heading: '白屏排查使用概览',
    description: '这页把页面白屏从网络、资源、入口执行、渲染和样式展示几层逐步拆开。',
    blocks: [
      {
        title: 'Step 1 · 白屏先走启动链路，不先猜业务代码',
        summary: '先看 HTML、JS/CSS、Console 和 root 挂载，比直接翻组件更稳。',
        bullets: ['Document', 'Assets', 'Bootstrap', 'Render'] 
      },
      {
        title: 'Step 2 · 线上白屏一定要有监控兜底',
        summary: '版本号、资源 URL、首个错误栈和 route 信息都会明显提高定位效率。',
        code: {
          language: 'js',
          title: 'Startup Error Report',
          snippet: `window.addEventListener('error', (event) => {
  reportStartupError({ message: event.message, route: location.pathname, version: APP_VERSION })
})`
        }
      }
    ]
  },
  'api-concurrency-scenario': {
    heading: '接口慢与并发治理使用概览',
    description: '这页把防抖、去重、取消、并发限制、重试和降级串成完整的请求治理流程。',
    blocks: [
      {
        title: 'Step 1 · 先分接口本身慢，还是请求发太多',
        summary: '根因不同，解决手段也不同，这一步最关键。',
        bullets: ['单接口慢', '重复请求多', '并发无上限', '优先级不合理']
      },
      {
        title: 'Step 2 · 在途请求治理往往最容易见效',
        summary: '相同请求去重、取消旧请求、限制并发数，是非常实用的一组手段。',
        code: {
          language: 'js',
          title: 'In-flight Dedup',
          snippet: `const inflight = new Map()
if (inflight.has(key)) return inflight.get(key)`
        }
      }
    ]
  },
  'component-refactor-scenario': {
    heading: '组件重构使用概览',
    description: '这页把“难维护组件”的重构思路拆成职责识别、状态抽离、UI 分层和渐进迁移四步。',
    blocks: [
      {
        title: 'Step 1 · 先拆职责，不先拆文件',
        summary: '数据、展示、副作用、权限和弹窗状态混在一起时，最先处理的是边界。',
        bullets: ['职责识别', '变化点识别', '容器与展示分层']
      },
      {
        title: 'Step 2 · 渐进迁移比重写更稳',
        summary: '通过 hook、reducer、新旧实现并存和 feature flag 逐步替换，风险更可控。',
        code: {
          language: 'tsx',
          title: 'Gradual Migration',
          snippet: `return useNewFlow ? <OrdersPageRefactored /> : <OrdersPageLegacy />`
        }
      }
    ]
  },
  'component-library-scenario': {
    heading: '组件库设计使用概览',
    description: '这页把 token、基础组件、pattern、文档和迁移推广放回组件库建设全流程里理解。',
    blocks: [
      {
        title: 'Step 1 · 先做基础设施，不先追求大而全',
        summary: 'token、Button、Input、Dialog 这类基础能力通常比大量业务组件更值得先做。',
        bullets: ['Token', 'Primitive', 'Pattern', 'Docs']
      },
      {
        title: 'Step 2 · API 要围绕高频路径设计',
        summary: '合理默认值、语义化参数和文档示例，比开一堆低价值开关更重要。',
        code: {
          language: 'ts',
          title: 'Button API',
          snippet: `type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}`
        }
      }
    ]
  },
  'frontend-system-scenario': {
    heading: '权限、守卫、埋点、国际化使用概览',
    description: '这页把四类横切能力统一看成基础设施问题，重点放在统一模型和统一接入。',
    blocks: [
      {
        title: 'Step 1 · 横切能力先统一模型',
        summary: '权限 key、路由 meta、埋点事件 schema、i18n key 都应该统一定义。',
        bullets: ['Permission key', 'Route meta', 'Track schema', 'Locale dictionary']
      },
      {
        title: 'Step 2 · 页面层只消费能力',
        summary: '页面不应该自己手搓一套守卫、埋点和翻译逻辑。',
        code: {
          language: 'tsx',
          title: 'Guarded Route',
          snippet: `if (route.permission && !can(user, route.permission)) {
  return <Navigate to="/403" replace />
}`
        }
      }
    ]
  },
  'react-state-communication-summary': {
    heading: 'React 状态与通信使用概览',
    description: '这页把受控/非受控、状态提升、Context 和组件通信放回“单一数据源和共享范围”这条主线里理解。',
    blocks: [
      {
        title: 'Step 1 · 先定单一数据源',
        summary: '受控、非受控、状态提升这些选择，本质都在回答“谁来持有状态”。',
        bullets: ['局部状态', '共享状态', '跨层共享', '更新成本']
      },
      {
        title: 'Step 2 · Context 是跨层共享，不是全能状态管理',
        summary: '尤其高频复杂状态要警惕更新范围过大。',
        code: {
          language: 'tsx',
          title: 'Context Scope',
          snippet: `const ThemeContext = createContext<'light' | 'dark'>('light')`
        }
      }
    ]
  },
  'react-core-hooks-summary': {
    heading: 'React Hooks 基础使用概览',
    description: '这页把 useState、useRef、useMemo、useCallback 按语义边界拆开，重点放在什么时候该用、什么时候别滥用。',
    blocks: [
      {
        title: 'Step 1 · 先按语义分类 Hook',
        summary: '驱动渲染的 state、不驱动渲染的 ref、缓存值的 memo、缓存函数引用的 callback，不要混。',
        bullets: ['state', 'ref', 'memo', 'callback']
      },
      {
        title: 'Step 2 · memo / callback 只有在收益明确时才值得上',
        summary: '中高级面试很看是否存在过度优化。',
        code: {
          language: 'tsx',
          title: 'Stable Callback',
          snippet: `const handleSelect = useCallback((id: string) => setSelectedId(id), [])`
        }
      }
    ]
  },
  'react-effect-lifecycle-summary': {
    heading: 'React effect 使用概览',
    description: '这页把 effect 的执行时机、cleanup、依赖数组和 Strict Mode 下的常见问题统一放回副作用模型里理解。',
    blocks: [
      {
        title: 'Step 1 · 先分清 render 和 effect',
        summary: 'effect 是 render 之后与外部世界同步的地方，不该拿来装所有逻辑。',
        bullets: ['after commit', 'side effects only', 'cleanup matters']
      },
      {
        title: 'Step 2 · cleanup 是真实开发高频点',
        summary: '订阅、请求、定时器、监听都要考虑撤销时机。',
        code: {
          language: 'tsx',
          title: 'Abort in Cleanup',
          snippet: `return () => controller.abort()`
        }
      }
    ]
  },
  'react-rendering-mechanics-summary': {
    heading: 'React 渲染机制使用概览',
    description: '这页把 key、render/commit、协调和批量更新放到同一条更新流程里理解。',
    blocks: [
      {
        title: 'Step 1 · key 先看身份，不先看 warning',
        summary: '列表项身份稳定，状态复用才会正确。',
        bullets: ['identity', 'state reuse', 'avoid index in reordering lists']
      },
      {
        title: 'Step 2 · render 和 commit 要分开理解',
        summary: '组件函数重跑不等于 DOM 全量重建。',
        code: {
          language: 'ts',
          title: 'Render Flow',
          snippet: `state change -> render -> reconcile -> commit`
        }
      }
    ]
  },
  'react-concurrency-summary': {
    heading: 'React 18 并发特性使用概览',
    description: '这页重点讲优先级和调度，而不是把并发特性误解成多线程。',
    blocks: [
      {
        title: 'Step 1 · 先分 urgent 和 non-urgent',
        summary: '输入反馈要先响应，重列表和大计算视图可以稍后跟上。',
        bullets: ['urgent input', 'transition update', 'deferred consumption']
      },
      {
        title: 'Step 2 · transition 是调度优化，不是性能魔法',
        summary: '重逻辑本身还是要继续优化。',
        code: {
          language: 'tsx',
          title: 'Transition',
          snippet: `startTransition(() => setRows(filterRows(allRows, nextKeyword)))`
        }
      }
    ]
  },
  'react-custom-hook-summary': {
    heading: '自定义 Hook 设计使用概览',
    description: '这页把自定义 Hook 放回行为抽象、边界设计和组件分层里理解，而不是只看代码复用。',
    blocks: [
      {
        title: 'Step 1 · 抽 Hook 先找稳定行为单元',
        summary: '分页、筛选、弹窗、订阅这些都很适合，但不要为了抽象而抽象。',
        bullets: ['behavior unit', 'state + actions', 'clear boundary']
      },
      {
        title: 'Step 2 · Hook 返回值本身就是 API 设计',
        summary: '可读性、可扩展性和职责边界都要考虑。',
        code: {
          language: 'ts',
          title: 'Hook Contract',
          snippet: `type UseModalResult = { open: boolean; show: () => void; hide: () => void }`
        }
      }
    ]
  },
  'react-performance-summary': {
    heading: 'React 性能优化使用概览',
    description: '这页把 memo、组件拆分、虚拟列表和工程层优化放在一起，强调先量后优和按收益选择手段。',
    blocks: [
      {
        title: 'Step 1 · 性能优化先量瓶颈',
        summary: '先看渲染、计算、节点数还是资源加载，不要一上来全加 memo。',
        bullets: ['measure first', 'state boundary', 'stable props', 'virtualization']
      },
      {
        title: 'Step 2 · memo 要配稳定 props 才更有意义',
        summary: '对象、数组、函数引用不稳定时，memo 收益会很差。',
        code: {
          language: 'tsx',
          title: 'Stable Props',
          snippet: `const handleOpen = useCallback((id: string) => setOpenId(id), [])`
        }
      }
    ]
  },
  'vue-core-concepts-summary': {
    heading: 'Vue 基础概念使用概览',
    description: '这页把 Vue 的声明式模板、响应式系统、组件化和生命周期放在同一条主线里理解。',
    blocks: [
      {
        title: 'Step 1 · Vue 基础题先讲“模板 + 响应式”',
        summary: '这是 Vue 最核心的组合，也是很多后续 API 和机制题的前提。',
        bullets: ['template', 'reactivity', 'component', 'lifecycle']
      },
      {
        title: 'Step 2 · Composition API 重点答逻辑组织方式',
        summary: '中大型项目里，它更适合把同类逻辑聚在一起并抽成 composable。',
        code: {
          language: 'ts',
          title: 'Composable',
          snippet: `export function usePagination() {
  const page = ref(1)
  return { page }
}`
        }
      }
    ]
  },
  'vue-common-api-summary': {
    heading: 'Vue 常用 API 使用概览',
    description: '这页把 ref、reactive、computed、watch、通信 API 和 nextTick 按职责分类整理，避免答成零散函数清单。',
    blocks: [
      {
        title: 'Step 1 · API 先按职责分',
        summary: '源状态、派生值、副作用、通信和 DOM 时机，是 Vue 常用 API 最稳的分类方法。',
        bullets: ['ref/reactive', 'computed', 'watch/watchEffect', 'props/emits/provide/inject', 'nextTick']
      },
      {
        title: 'Step 2 · computed 和 watch 必须重点区分',
        summary: '一个是派生值，一个是副作用监听，这是高频追问点。',
        code: {
          language: 'ts',
          title: 'Computed',
          snippet: `const fullName = computed(() => \`\${firstName.value} \${lastName.value}\`)`
        }
      }
    ]
  },
  'vue-interview-topics-summary': {
    heading: 'Vue 高频面试题使用概览',
    description: '这页把 Vue 面试里最常见的对比题、性能题和通信题放回“身份、时机、依赖、成本”这条答题框架里。',
    blocks: [
      {
        title: 'Step 1 · 高频题先分类',
        summary: 'key 属于身份题，nextTick 属于时机题，computed/watch 属于依赖题，v-if/v-show 属于成本题。',
        bullets: ['identity', 'timing', 'dependency', 'cost']
      },
      {
        title: 'Step 2 · 定义之后一定补使用场景',
        summary: '这会让回答从背书升级成项目经验表达。',
        code: {
          language: 'ts',
          title: 'v-if vs v-show',
          snippet: `高频切换 -> v-show
条件较少变化 -> v-if`
        }
      }
    ]
  },
  'react-query-demo': {
    heading: 'React Query Demo 使用概览',
    description: 'React Query 主要管理服务端状态。建议按“Provider 注入 -> query 定义 -> mutation 失效 -> UI 状态反馈”顺序落地。',
    blocks: [
      {
        title: 'Step 1 · 声明 QueryClientProvider 包裹层',
        summary: '在应用或 feature 入口初始化 QueryClient，统一管理重试、缓存时间和请求行为。',
        code: {
          language: 'tsx',
          title: 'Provider Setup',
          snippet: `const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } }
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDemoPage />
  </QueryClientProvider>
);`
        }
      },
      {
        title: 'Step 2 · 用稳定 queryKey 定义查询',
        summary: 'queryKey 必须可预测且可组合，分页、筛选条件都应进入 key，才能正确命中缓存。',
        code: {
          language: 'tsx',
          title: 'Query Definition',
          snippet: `const projects = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData,
  select: (res) => res.items
});`
        }
      },
      {
        title: 'Step 3 · 写操作后集中失效缓存',
        summary: 'mutation 成功后统一 invalidateQueries，不要在多个组件手写同步逻辑。',
        code: {
          language: 'tsx',
          title: 'Mutation + Invalidate',
          snippet: `const update = useMutation({
  mutationFn: updateProject,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    queryClient.invalidateQueries({ queryKey: ['project-detail'] });
  }
});`
        }
      },
      {
        title: 'Step 4 · 处理 loading/error/empty 三态',
        summary: '页面层统一三态渲染，保证交互反馈稳定。',
        bullets: ['loading: 用 isPending 显示 skeleton', 'error: 用 isError + refetch 重试', 'empty: data.length===0 给空态提示']
      },
      {
        title: 'Step 5 · 使用边界',
        summary: 'React Query 管的是远程数据，不建议把复杂表单中间态或动画状态塞进去。',
        bullets: ['服务端列表/详情是最佳场景', '本地草稿态优先 useState/useReducer', '跨页缓存策略由 queryKey + staleTime 控制']
      }
    ]
  },
  'react-context-demo': {
    heading: 'React Context Demo 使用概览',
    description: 'Context + useReducer 适合中小型共享状态。推荐按“Provider -> reducer -> actions -> hooks -> 可选持久化”分层。',
    blocks: [
      {
        title: 'Step 1 · 声明 Provider 包裹组件',
        summary: '先在功能入口挂上 Provider，明确状态作用域只覆盖当前 feature。',
        code: {
          language: 'tsx',
          title: 'Provider Mount',
          snippet: `export function ReactContextDemoProviders({ children }: PropsWithChildren) {
  return <StoreProvider>{children}</StoreProvider>;
}`
        }
      },
      {
        title: 'Step 2 · 定义 state 与 reducer',
        summary: '把共享状态和变更动作集中在 reducer，保证更新路径一致可调试。',
        code: {
          language: 'ts',
          title: 'Reducer Structure',
          snippet: `type Action =
  | { type: 'counter/increment' }
  | { type: 'preferences/setTheme'; payload: ThemeMode };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, counter: state.counter + 1 };
    default:
      return state;
  }
}`
        }
      },
      {
        title: 'Step 3 · 在 Provider 内封装 actions',
        summary: '组件只调用语义化方法，不直接 dispatch 裸 action，减少调用方重复代码。',
        code: {
          language: 'tsx',
          title: 'Action Wrapper',
          snippet: `const actions = useMemo(
  () => ({
    increment: () => dispatch({ type: 'counter/increment' }),
    setTheme: (theme: ThemeMode) =>
      dispatch({ type: 'preferences/setTheme', payload: theme })
  }),
  []
);`
        }
      },
      {
        title: 'Step 4 · 组件中联合读取多个状态块',
        summary: '通过自定义 hook 暴露 state + actions，单组件可同时消费 counter、preferences、todos。',
        code: {
          language: 'tsx',
          title: 'Consume Store',
          snippet: `const { state, actions } = useDemoStore();
const { counter, preferences, todos } = state;

return (
  <>
    <p>count: {counter.value}</p>
    <button onClick={actions.increment}>+1</button>
  </>
);`
        }
      },
      {
        title: 'Step 5 · 需要持久化时再局部接入',
        summary: 'Context 本身不带持久化，可在 Provider 中按白名单字段同步 localStorage。',
        bullets: ['初始化时读取本地数据恢复默认 state', 'effect 中只写回需要持久化的 key', '避免每次输入都写盘，必要时做节流']
      }
    ]
  },
  'redux-demo': {
    heading: 'Redux Demo 使用概览',
    description: 'Redux Toolkit 强项是结构化状态管理与可预测更新。建议按“Provider -> slice -> store -> selector -> 持久化”推进。',
    blocks: [
      {
        title: 'Step 1 · 声明 Provider 与 PersistGate',
        summary: '入口层先挂 Redux Provider；启用持久化时再用 PersistGate 包裹。',
        code: {
          language: 'tsx',
          title: 'Provider + PersistGate',
          snippet: `root.render(
  <Provider store={store}>
    <PersistGate loading={<p>Restoring state...</p>} persistor={persistor}>
      <ReduxDemoPage />
    </PersistGate>
  </Provider>
);`
        }
      },
      {
        title: 'Step 2 · 按领域拆分多个 slice',
        summary: '把 counter、preferences、todos 分别建 slice，再在 rootReducer 合并。',
        code: {
          language: 'ts',
          title: 'Slice Composition',
          snippet: `const rootReducer = combineReducers({
  counter: counterReducer,
  preferences: preferencesReducer,
  todos: todoReducer
});`
        }
      },
      {
        title: 'Step 3 · 配置持久化黑白名单',
        summary: '在页面里切换 persist 模式，演示只持久化局部状态或排除指定状态。',
        code: {
          language: 'ts',
          title: 'Persist Config',
          snippet: `const persistConfig = {
  key: 'redux-demo-whitelist',
  storage,
  whitelist: ['counter'] // 或改为 blacklist: ['preferences']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);`
        }
      },
      {
        title: 'Step 4 · 组件中联合使用多个 slice',
        summary: '同一组件里同时读取多个 selector，并 dispatch 不同 slice action。',
        code: {
          language: 'tsx',
          title: 'Read + Dispatch',
          snippet: `const count = useAppSelector((s) => s.counter.value);
const theme = useAppSelector((s) => s.preferences.theme);
const todoCount = useAppSelector((s) => s.todos.items.length);

dispatch(counterActions.increment());
dispatch(preferencesActions.setTheme('dark'));`
        }
      },
      {
        title: 'Step 5 · 调试建议',
        summary: '优先保证 action 命名规范和 selector 稳定，再考虑性能优化。',
        bullets: ['action type 使用领域前缀', '复杂 selector 用 reselect 缓存', '将临时 UI 状态留在组件内']
      }
    ]
  },
  'mobx-demo': {
    heading: 'MobX Demo 使用概览',
    description: 'MobX 通过 observable + action + computed 形成响应式闭环。推荐“Store 类建模 -> RootStore 注入 -> observer 消费”。',
    blocks: [
      {
        title: 'Step 1 · 声明 Demo Provider',
        summary: '在 feature 层注入 store 实例，避免影响其他功能页。',
        code: {
          language: 'tsx',
          title: 'Provider Entry',
          snippet: `export function MobxDemoProviders({ children }: PropsWithChildren) {
  const storeRef = useRef(createMobxDemoStore());
  return (
    <MobxDemoStoreContext.Provider value={storeRef.current}>
      {children}
    </MobxDemoStoreContext.Provider>
  );
}`
        }
      },
      {
        title: 'Step 2 · 定义 Store 类与 action',
        summary: '用 makeAutoObservable 建模状态与行为，建议 autoBind 防止 this 丢失。',
        code: {
          language: 'ts',
          title: 'Store Class',
          snippet: `class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  increment() {
    this.value += 1;
  }
}`
        }
      },
      {
        title: 'Step 3 · 聚合多域状态并提供持久化',
        summary: '在同一 store 中维护 counter、preferences、todos，并通过 reaction/autorun 按需落盘。',
        code: {
          language: 'ts',
          title: 'Persist Reaction',
          snippet: `reaction(
  () => ({ counter: this.counter, theme: this.preferences.theme }),
  (snapshot) => {
    localStorage.setItem('mobx-demo', JSON.stringify(snapshot));
  }
);`
        }
      },
      {
        title: 'Step 4 · observer 组件联合读取多个域',
        summary: '使用 observer 包裹组件后，读取到的 observable 字段变化会自动触发重渲染。',
        code: {
          language: 'tsx',
          title: 'Observer Usage',
          snippet: `export const SummaryPanel = observer(() => {
  const store = useMobxDemoStore();
  return (
    <p>
      count: {store.counter} | theme: {store.preferences.theme}
    </p>
  );
});`
        }
      },
      {
        title: 'Step 5 · 常见排查点',
        summary: '若 UI 不更新，先检查 observer 包裹、action 调用路径和 this 绑定。',
        bullets: ['组件必须在 render 中读取 observable 字段', '事件回调优先调用 store action', '异步更新建议 runInAction 包裹']
      }
    ]
  },
  'zustand-demo': {
    heading: 'Zustand Demo 使用概览',
    description: 'Zustand 适合轻量全局状态。推荐“createStore -> middleware(可选持久化) -> selector 消费”的最小路径。',
    blocks: [
      {
        title: 'Step 1 · 定义 store 基础状态和动作',
        summary: '先明确状态切片与 action，减少后续组件层重复逻辑。',
        code: {
          language: 'ts',
          title: 'Store Factory',
          snippet: `type DemoState = {
  count: number;
  increment: () => void;
};

const useDemoStore = create<DemoState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));`
        }
      },
      {
        title: 'Step 2 · 接入 persist 并控制持久化范围',
        summary: '通过 partialize 只持久化指定字段，可演示白名单效果。',
        code: {
          language: 'ts',
          title: 'Persist Middleware',
          snippet: `const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({ ...initialState, increment: () => set({ count: get().count + 1 }) }),
    {
      name: 'zustand-demo',
      partialize: (state) => ({ count: state.count, preferences: state.preferences })
    }
  )
);`
        }
      },
      {
        title: 'Step 3 · Provider 作用域隔离（可选）',
        summary: '若你要做实验场隔离，建议每个 feature 建独立 store 实例并通过 context 注入。',
        code: {
          language: 'tsx',
          title: 'Scoped Provider',
          snippet: `const StoreContext = createContext<StoreApi<DemoState> | null>(null);

export function ZustandDemoProviders({ children }: PropsWithChildren) {
  const storeRef = useRef(createDemoStore());
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
}`
        }
      },
      {
        title: 'Step 4 · 组件中联合订阅多个切片',
        summary: '一个组件可组合多个 selector，按需订阅，减少无关重渲染。',
        code: {
          language: 'tsx',
          title: 'Selector Composition',
          snippet: `const count = useDemoStore((s) => s.count);
const theme = useDemoStore((s) => s.preferences.theme);
const todoCount = useDemoStore((s) => s.todos.length);

const increment = useDemoStore((s) => s.increment);`
        }
      },
      {
        title: 'Step 5 · 性能与维护建议',
        summary: '保持 selector 颗粒度小、action 纯粹，避免 store 变成“巨型对象”。',
        bullets: ['高频读取字段用独立 selector', '跨域逻辑提炼为 action', '持久化字段尽量少且稳定']
      }
    ]
  },
  'recoil-demo': {
    heading: 'Recoil Demo 使用概览',
    description: 'Recoil 通过 atom/selector 做细粒度状态组合。推荐“RecoilRoot -> atom -> selector -> hooks -> 可选持久化”。',
    blocks: [
      {
        title: 'Step 1 · 在入口声明 RecoilRoot',
        summary: 'Recoil 依赖根容器，未包裹会导致所有 atom/selector hook 报错。',
        code: {
          language: 'tsx',
          title: 'Root Provider',
          snippet: `root.render(
  <RecoilRoot>
    <RecoilDemoPage />
  </RecoilRoot>
);`
        }
      },
      {
        title: 'Step 2 · 拆分 atom（源状态）',
        summary: '按领域拆 atom：counter、preferences、todos，保持读写边界清晰。',
        code: {
          language: 'ts',
          title: 'Atoms',
          snippet: `export const countAtom = atom({ key: 'count', default: 0 });
export const themeAtom = atom<ThemeMode>({ key: 'theme', default: 'light' });
export const todoAtom = atom<Todo[]>({ key: 'todo-list', default: [] });`
        }
      },
      {
        title: 'Step 3 · 用 selector 组合派生状态',
        summary: 'selector 负责派生逻辑，组件只读结果，避免重复计算。',
        code: {
          language: 'ts',
          title: 'Selector',
          snippet: `export const summarySelector = selector({
  key: 'summary',
  get: ({ get }) => {
    const count = get(countAtom);
    const todos = get(todoAtom);
    return { count, todoCount: todos.length };
  }
});`
        }
      },
      {
        title: 'Step 4 · 在同一组件联合读写多个 atom',
        summary: '组合 useRecoilState/useRecoilValue，同时操作多个状态域。',
        code: {
          language: 'tsx',
          title: 'Read + Write',
          snippet: `const [count, setCount] = useRecoilState(countAtom);
const [theme, setTheme] = useRecoilState(themeAtom);
const summary = useRecoilValue(summarySelector);

setCount((v) => v + 1);
setTheme('dark');`
        }
      },
      {
        title: 'Step 5 · 持久化可通过 atom effect',
        summary: 'Recoil 默认无持久化，可在 atom effect 中手动同步 localStorage。',
        bullets: ['onSet 时写入本地', '初始化时读取并 setSelf', '注意 key 版本兼容策略']
      }
    ]
  },
  'jotai-demo': {
    heading: 'Jotai Demo 使用概览',
    description: 'Jotai 用 atom 作为最小状态单元。推荐“基础 atom -> 派生 atom -> 写入 atom -> 组件组合消费”。',
    blocks: [
      {
        title: 'Step 1 · 声明 Provider（可选但推荐）',
        summary: '实验场里建议加 Provider，这样每个 feature 都有独立 atom scope。',
        code: {
          language: 'tsx',
          title: 'Provider Scope',
          snippet: `root.render(
  <Provider>
    <JotaiDemoPage />
  </Provider>
);`
        }
      },
      {
        title: 'Step 2 · 定义基础 atom 状态',
        summary: '把最原始的状态拆小，便于后续组合。',
        code: {
          language: 'ts',
          title: 'Primitive Atoms',
          snippet: `export const countAtom = atom(0);
export const themeAtom = atom<ThemeMode>('light');
export const todoAtom = atom<Todo[]>([]);`
        }
      },
      {
        title: 'Step 3 · 定义派生 atom 与写入 atom',
        summary: '派生 atom 管计算，写入 atom 管事务更新，组件逻辑会更干净。',
        code: {
          language: 'ts',
          title: 'Derived + Writable',
          snippet: `export const doneCountAtom = atom((get) =>
  get(todoAtom).filter((item) => item.done).length
);

export const incrementAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1);
});`
        }
      },
      {
        title: 'Step 4 · 在一个组件中组合多个 atom',
        summary: '组件可同时读取 count/theme/todos，并触发写入 atom 完成复杂更新。',
        code: {
          language: 'tsx',
          title: 'Combine Atoms',
          snippet: `const [count] = useAtom(countAtom);
const [theme, setTheme] = useAtom(themeAtom);
const doneCount = useAtomValue(doneCountAtom);
const [, increment] = useAtom(incrementAtom);

increment();
setTheme('dark');`
        }
      },
      {
        title: 'Step 5 · 持久化优先用 atomWithStorage',
        summary: 'Jotai 官方工具链提供 atomWithStorage，适合快速演示本地持久化。',
        code: {
          language: 'ts',
          title: 'atomWithStorage',
          snippet: `import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage<ThemeMode>('jotai-theme', 'light');`
        }
      }
    ]
  },
  'valtio-demo': {
    heading: 'Valtio Demo 使用概览',
    description: 'Valtio 用 proxy 提供“直接改对象”的开发体验。推荐“proxy state -> action -> snapshot -> 持久化订阅”流程。',
    blocks: [
      {
        title: 'Step 1 · 创建 proxy 状态对象',
        summary: '先定义状态结构与默认值，proxy 会自动追踪变更。',
        code: {
          language: 'ts',
          title: 'Proxy State',
          snippet: `export const state = proxy({
  count: 0,
  preferences: { theme: 'light' as ThemeMode },
  todos: [] as Todo[]
});`
        }
      },
      {
        title: 'Step 2 · 把修改逻辑收敛到 action',
        summary: '推荐定义语义化 action，避免在组件里到处直接改 state 字段。',
        code: {
          language: 'ts',
          title: 'Actions',
          snippet: `export const actions = {
  increment() {
    state.count += 1;
  },
  setTheme(theme: ThemeMode) {
    state.preferences.theme = theme;
  }
};`
        }
      },
      {
        title: 'Step 3 · 组件使用 useSnapshot 读取多个状态块',
        summary: '读取 snapshot 即可触发精准渲染，组件代码与普通对象读取接近。',
        code: {
          language: 'tsx',
          title: 'Snapshot Read',
          snippet: `const snap = useSnapshot(state);

return (
  <p>
    count: {snap.count} | theme: {snap.preferences.theme}
  </p>
);`
        }
      },
      {
        title: 'Step 4 · 通过 subscribe 做持久化同步',
        summary: 'Valtio 默认不内置持久化，可通过 subscribe 监听变化写入本地。',
        code: {
          language: 'ts',
          title: 'Subscribe Persist',
          snippet: `subscribe(state, () => {
  localStorage.setItem(
    'valtio-demo',
    JSON.stringify({ count: state.count, preferences: state.preferences })
  );
});`
        }
      },
      {
        title: 'Step 5 · 实验场中的边界建议',
        summary: '把 Valtio 仅用于该 feature 的本地交互状态，避免跨功能共享同一个全局 proxy。',
        bullets: ['每个 demo 页维护独立 state 实例', '将远程请求状态交给 React Query 更合适', '高频大对象更新注意拆分结构']
      }
    ]
  },
  'reactflow-demo': {
    heading: 'React Flow Demo 使用概览',
    description: '节点编排器建议按“初始化节点图 -> 渲染画布 -> 交互修改 -> 导出结构”实现，和 ComfyUI 的工作流心智一致。',
    blocks: [
      {
        title: 'Step 1 · 定义 nodes / edges 初始图',
        summary: '把节点和连线作为显式状态数据，后续拖拽、连线、新增节点都围绕这两份数据进行。',
        code: {
          language: 'ts',
          title: 'Graph State',
          snippet: `const initialNodes: Node[] = [...];
const initialEdges: Edge[] = [...];

const [nodes, setNodes] = useState(initialNodes);
const [edges, setEdges] = useState(initialEdges);`
        }
      },
      {
        title: 'Step 2 · 渲染节点画布并区分节点类型',
        summary: '在真实 React Flow 项目中，先用 `<ReactFlow />` 承载 nodes/edges，再按 node type 映射自定义节点组件。',
        code: {
          language: 'tsx',
          title: 'React Flow Basic Canvas',
          snippet: `import ReactFlow, { Background, Controls } from '@xyflow/react';

<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
  <Background gap={20} size={1} />
  <Controls />
</ReactFlow>;`
        }
      },
      {
        title: 'Step 3 · 接入拖拽和连线模式',
        summary: '拖拽更新节点坐标，连线模式下选取 source/target 追加 edge，形成完整工作流交互闭环。',
        code: {
          language: 'tsx',
          title: 'Drag + Connect',
          snippet: `function onConnect(connection: Connection) {
  setEdges((prev) =>
    addEdge({ ...connection, id: \`edge-\${edgeIdRef.current++}\`, animated: true }, prev)
  );
}`
        }
      },
      {
        title: 'Step 4 · 用模板快速扩展节点图',
        summary: '提供节点模板面板，让使用者快速追加 Control/Output 节点，并自动连接到当前节点。',
        bullets: ['新增节点时自动设置初始坐标', '可选自动连边减少重复操作', '保留重置和自动排版按钮']
      },
      {
        title: 'Step 5 · 输出调试信息与结构摘要',
        summary: '在 Inspector 里显示当前节点信息和图指标，便于学习调试复杂工作流。',
        bullets: ['节点数 / 边数 / 类型分布统计', '选中节点元数据展示', '可扩展为 JSON 导出/导入']
      }
    ]
  }
};
