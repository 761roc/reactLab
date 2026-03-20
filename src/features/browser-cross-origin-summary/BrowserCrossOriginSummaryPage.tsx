import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { browserPrinciplesTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '同源策略、CORS、预检请求、JSONP、代理和常见误区一次讲清。' },
  { label: 'Focus', value: 'Browser Restriction', detail: '跨域本质上是浏览器的安全限制，不是服务器突然“不能连”。' },
  { label: 'Scenarios', value: '前后端联调 / 网关 / Cookie', detail: '开发代理、生产网关、带凭证请求都很常见。' },
] as const;

const definitions = [
  { title: '跨域先从“同源策略”讲起', detail: '协议、域名、端口只要有一个不同，浏览器通常就认为不是同源。' },
  { title: '跨域不是网络层连不上', detail: '很多时候请求其实已经发到服务端了，只是浏览器不让前端脚本拿响应。' },
  { title: 'CORS 是现代主流跨域方案', detail: '它本质上是服务端通过响应头告诉浏览器：这次跨域我允许。' },
  { title: '预检请求是浏览器先打个招呼', detail: '复杂跨域请求前，浏览器会先发一个 OPTIONS 问问能不能发正式请求。' },
  { title: 'JSONP 是比较老的跨域技巧', detail: '它借用 script 标签能跨域加载的能力，但局限很大，现在多用于老知识点。' },
  { title: '代理是工程里非常常见的解决思路', detail: '让同源服务器代你去请求目标服务，前端看到的就还是同源接口。' },
] as const;

const relations = [
  { title: '同源', detail: '协议、域名、端口都一致。', signal: 'Same Origin' },
  { title: '跨域', detail: '三者里只要有一个不同，就通常要按跨域处理。', signal: 'Different Origin' },
  { title: 'CORS', detail: '由服务端响应头配合浏览器规则完成。', signal: 'Header Based' },
  { title: '代理', detail: '由中间层代发请求，前端侧看起来还是同源。', signal: 'Server Side Forward' },
] as const;

const relationCode = `前端页面: http://localhost:5173
接口地址: https://api.example.com/users

协议不同 / 域名不同 / 端口不同
=> 浏览器按跨域处理`;

const baseQuestions = [
  { title: '问题 1：跨域到底是谁限制的？', answer: '主要是浏览器的同源策略在限制前端脚本访问跨源响应。', explanation: '所以 Postman 能请求成功、浏览器页面里不行，这种情况非常常见。', code: `浏览器限制的是“页面脚本访问响应”
不是服务器之间不能互相请求`, codeTitle: 'Cross Origin Core' },
  { title: '问题 2：什么才算同源？', answer: '协议、域名、端口都一样才叫同源。只要其中一个不同，通常就算跨域。', explanation: '这题一定要把三要素说全。', code: `http://a.com:80
https://a.com:80 // 协议不同
http://api.a.com:80 // 域名不同
http://a.com:8080 // 端口不同`, codeTitle: 'Same Origin Rule' },
  { title: '问题 3：CORS 最核心要怎么答？', answer: '服务端通过 `Access-Control-Allow-*` 这类响应头告诉浏览器：这个跨域请求我允许。', explanation: '它不是前端自己“绕过去”的魔法，而是服务端和浏览器共同配合。', code: `Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true`, codeTitle: 'CORS Headers' },
  { title: '问题 4：预检请求为什么会出现？', answer: '因为浏览器遇到某些复杂跨域请求前，会先发一个 OPTIONS 请求确认服务端是否允许。', explanation: '这就是为什么你会在 Network 里看到正式请求前多出来一个 OPTIONS。', code: `OPTIONS /users
Access-Control-Request-Method: POST`, codeTitle: 'Preflight Example' },
] as const;

const practicalQuestions = [
  { title: '问题 5：JSONP 为什么能跨域？', answer: '因为 script 标签加载脚本资源不受同源策略的同等限制，JSONP就是借这个能力把数据包装成函数调用。', explanation: '但它只能 GET，安全性和灵活性都比较有限，所以现在更多是面试知识点。', code: `<script src="https://api.example.com/data?callback=handle"></script>`, codeTitle: 'JSONP Example' },
  { title: '问题 6：开发环境里为什么常用代理？', answer: '因为代理可以让前端请求先打到本地同源服务，再由它去转发到真实接口。', explanation: '这样浏览器看到的依然是同源地址，跨域问题就自然消失。', code: `Vite dev server
-> /api/users
-> proxy 到 https://api.example.com/users`, codeTitle: 'Dev Proxy Example' },
  { title: '问题 7：带 Cookie 的跨域请求为什么更麻烦？', answer: '因为它不仅要服务端允许跨域，还要明确允许携带凭证，浏览器端也要显式打开。', explanation: '这类题里很容易漏掉前后端两边都要配。', code: `fetch(url, { credentials: "include" })
Access-Control-Allow-Credentials: true`, codeTitle: 'Credentialed Request' },
  { title: '问题 8：跨域题怎么答得更像实战？', answer: '把开发环境代理、生产网关、带凭证请求和错误排查顺手带上，回答会更完整。', explanation: '这样就不只是记得一个 CORS 缩写，而是真知道怎么处理。', code: `Network 看 OPTIONS
看响应头
看控制台 CORS 报错`, codeTitle: 'Cross Origin Debug' },
] as const;

const diagnosticSteps = [
  { title: '第一步：先判断是不是同源', detail: '协议、域名、端口三项先快速过一遍。' },
  { title: '第二步：再看请求是否真的发出去了', detail: '很多跨域请求其实已经到服务端，只是响应被浏览器拦了。' },
  { title: '第三步：看有没有预检和关键响应头', detail: 'OPTIONS、`Access-Control-Allow-Origin`、凭证相关头都很关键。' },
  { title: '第四步：最后决定是配 CORS 还是走代理', detail: '开发环境和生产环境的处理思路通常不完全一样。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把跨域理解成请求发不出去', detail: '很多时候真正的问题是浏览器不让前端读取响应。', points: ['请求可能已到服务端', '浏览器限制访问', '先看 Network'] },
  { title: '高频误区 2：只会背 CORS，不知道代理', detail: '真实开发里代理是非常高频、非常实用的方案。', points: ['开发代理', '生产网关', '同源转发'] },
  { title: '高频误区 3：带 Cookie 时只配一边', detail: '这类请求通常需要前后端同时明确开启凭证相关配置。', points: ['前端 credentials', '服务端允许凭证', 'Origin 不能乱写 *'] },
  { title: '高频误区 4：把 JSONP 当现代主流方案', detail: '它更偏老方案和知识点，如今主流还是 CORS / 代理。', points: ['只能 GET', '局限很大', '了解即可'] },
] as const;

const rules = [
  { title: '跨域题先从同源策略答起', detail: '这样最稳，也最容易展开。' },
  { title: 'CORS 是服务端和浏览器共同配合', detail: '别答成前端自己“破解限制”。' },
  { title: '预检请求说明浏览器更谨慎了', detail: '不是多余请求，而是安全校验的一部分。' },
  { title: '开发代理和生产网关都值得主动提', detail: '这会让回答更像工程实践。' },
] as const;

export default function BrowserCrossOriginSummaryPage() {
  return <KnowledgeSummaryPage eyebrow="Browser Principles / Cross Origin" title="跨域：CORS、JSONP、代理" lead="这页把跨域这件事讲得更实用一点：浏览器到底在限制什么，为什么有时请求明明发出去了但页面还是报错，CORS、JSONP、代理分别适合什么场景。重点不是背缩写，而是把它和真实联调、真实排障连起来。" heroCards={heroCards} definitionsTitle="块 1：基础定义（先把跨域是谁在限制说清）" definitionsNote="用意：先知道跨域问题到底发生在哪一层。 " definitions={definitions} relationsTitle="块 2：同源与跨域速览" relationsNote="用意：先从“什么叫同源”这件事把主线立住。 " relations={relations} relationCodeTitle="Origin Rule" relationCode={relationCode} questionGroups={[{ title: '块 3：基础机制高频问题', note: '用意：先把同源策略、CORS 和预检请求讲清。', label: 'Cross Origin Basics', questions: baseQuestions }, { title: '块 4：实战场景高频问题', note: '用意：再把 JSONP、代理和凭证请求连到真实项目。', label: 'Cross Origin Practice', questions: practicalQuestions }]} diagnosticTitle="块 5：四步拆题法" diagnosticNote="用意：联调和面试题都能按这条顺序排。 " diagnosticSteps={diagnosticSteps} pitfallsTitle="块 6：常见误区" pitfallsNote="用意：把跨域题里最容易说偏的点拎出来。 " pitfalls={pitfalls} rulesTitle="块 7：记忆规则" rulesNote="用意：复盘时快速回忆最稳的答题主线。 " rules={rules} overviewTitle="块 8：问题总览" overviewNote="用意：快速回顾这页覆盖的问题。 " themeStyle={browserPrinciplesTheme} />;
}
