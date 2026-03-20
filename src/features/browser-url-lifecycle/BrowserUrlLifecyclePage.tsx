import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { browserPrinciplesTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '从地址解析、DNS、TCP/TLS、HTTP 请求到解析渲染，整条链路一次讲清。' },
  { label: 'Focus', value: 'Network To Render', detail: '重点不是背顺序，而是知道每一步是在解决什么问题。' },
  { label: 'Scenarios', value: '首屏 / 性能 / 排障', detail: '白屏、请求慢、资源加载异常，这条链路几乎都能对上。' },
] as const;

const definitions = [
  { title: 'URL 不是“直接去网页”，而是一串地址信息', detail: '浏览器先要拆出协议、域名、路径、查询参数，才知道接下来该找谁。' },
  { title: 'DNS 的作用很简单：把域名翻译成 IP', detail: '人记域名容易，机器连网更依赖 IP，所以浏览器通常得先做这一步。' },
  { title: 'TCP / TLS 负责“能连上、连得安全”', detail: 'HTTP 只是应用层协议，真正把连接建起来还得靠 TCP，HTTPS 再多一层 TLS。' },
  { title: 'HTML 拿到后，浏览器并不会一口气直接画出来', detail: '它还要解析 HTML、CSS、JS，再组装成可渲染的页面结构。' },
  { title: 'JS 会阻塞很多解析与渲染时机', detail: '这也是为什么脚本放哪、是否 async / defer、资源大小，都会影响首屏。' },
  { title: '页面展示是“网络 + 解析 + 渲染”共同完成的', detail: '所以性能问题通常也不是单点问题，而是整条链路叠起来。' },
] as const;

const relations = [
  { title: '输入地址', detail: '浏览器先处理地址、补全协议、查本地缓存和历史记录。', signal: 'Parse URL' },
  { title: '建立连接', detail: 'DNS 找 IP，TCP 建连接，HTTPS 还会做 TLS 握手。', signal: 'Connect' },
  { title: '请求资源', detail: '发 HTTP 请求，服务端返回 HTML、CSS、JS、图片等资源。', signal: 'Request / Response' },
  { title: '解析渲染', detail: '浏览器解析资源、构建树、布局绘制，页面才真正显示出来。', signal: 'Render' },
] as const;

const relationCode = `输入 URL
-> 解析协议 / 域名 / 路径
-> DNS 查询 IP
-> TCP 建连
-> TLS 握手 (HTTPS)
-> 发送 HTTP 请求
-> 返回 HTML
-> 解析 HTML / CSS / JS
-> 构建页面并渲染`;

const networkQuestions = [
  {
    title: '问题 1：输入 URL 后第一步到底是什么？',
    answer: '第一步通常是浏览器先解析 URL 本身，而不是立刻发请求。',
    explanation: '浏览器要先弄清楚协议是什么、域名是什么、路径是什么，还可能顺手补全 `https://`。',
    code: `const url = new URL("https://example.com/products?id=1")

console.log(url.protocol) // https:
console.log(url.hostname) // example.com
console.log(url.pathname) // /products`,
    codeTitle: 'URL Parse Example',
  },
  {
    title: '问题 2：为什么要做 DNS 查询？',
    answer: '因为浏览器要把域名翻译成真正能连的 IP 地址，才能继续走网络连接。',
    explanation: '你访问的是 `example.com`，但底层连的是一台或一组具体服务器。',
    code: `浏览器缓存
-> 系统缓存
-> 路由器 / 运营商 DNS
-> 根域 / 顶级域 / 权威 DNS`,
    codeTitle: 'DNS Lookup Flow',
  },
  {
    title: '问题 3：HTTPS 比 HTTP 多了什么？',
    answer: '它多了一层 TLS 握手，用来协商加密和身份校验。',
    explanation: '通俗点说，HTTP 是“能传”，HTTPS 是“能安全地传”。这一步会增加一些握手成本，但换来安全性。',
    code: `HTTP: 直接请求
HTTPS: TCP 建连 -> TLS 握手 -> 再发 HTTP 数据`,
    codeTitle: 'HTTP vs HTTPS',
  },
  {
    title: '问题 4：服务端返回 HTML 后，页面为什么还不会马上完整显示？',
    answer: '因为浏览器还得继续解析 HTML、下载 CSS / JS、处理脚本，再决定最终怎么画。',
    explanation: '这也是为什么“接口返回很快，但页面还是慢”完全有可能发生。',
    code: `HTML -> DOM
CSS -> CSSOM
DOM + CSSOM -> Render Tree
Render Tree -> Layout -> Paint`,
    codeTitle: 'Render Pipeline',
  },
] as const;

const renderingQuestions = [
  {
    title: '问题 5：为什么说 JS 可能阻塞页面展示？',
    answer: '因为浏览器遇到普通脚本时，经常要先停下来执行它，避免脚本改 DOM 导致解析结果不一致。',
    explanation: '所以脚本位置、拆包、`defer`、`async` 都会影响首屏体验。',
    code: `<script src="/main.js"></script>
<script defer src="/analytics.js"></script>
<script async src="/ads.js"></script>`,
    codeTitle: 'Script Loading Example',
  },
  {
    title: '问题 6：白屏问题通常该沿着哪条链路排查？',
    answer: '通常从“请求有没有发出去、HTML 有没有回来、静态资源有没有 404、脚本有没有报错、渲染有没有卡住”这条链路排查。',
    explanation: '白屏不等于后端挂了，也可能是资源路径错、脚本异常、样式没加载、主线程卡死。',
    code: `1. Network 看 HTML / JS / CSS 是否成功
2. Console 看是否报错
3. Elements 看 DOM 是否生成
4. Performance 看是否被长任务卡住`,
    codeTitle: 'White Screen Checklist',
  },
  {
    title: '问题 7：首屏慢一定是接口慢吗？',
    answer: '不一定。DNS、握手、HTML 体积、CSS 阻塞、JS 执行、图片太大，都可能拖慢首屏。',
    explanation: '首屏性能是整条链路共同作用的结果，不要只盯着接口耗时。',
    code: `TTFB 慢 -> 可能是服务端或网络
资源下载慢 -> 可能是包太大
页面渲染慢 -> 可能是 JS 执行或布局太重`,
    codeTitle: 'First Screen Analysis',
  },
  {
    title: '问题 8：这类题最后怎么答得更像实战？',
    answer: '别只背流程，要顺手带上“哪一步会慢、慢了怎么查、怎么优化”。',
    explanation: '流程题本质上也是性能题和排障题，能落到工具和场景，回答会更扎实。',
    code: `优化方向:
- DNS 预解析
- 资源压缩
- 合理拆包
- defer / async
- CDN
- 图片优化`,
    codeTitle: 'Optimization Directions',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先分清网络阶段和渲染阶段', detail: '前半段偏连接和请求，后半段偏解析和页面生成。' },
  { title: '第二步：慢在哪，就看哪一段', detail: 'DNS 慢、接口慢、资源慢、脚本慢、渲染慢，排查方向完全不同。' },
  { title: '第三步：白屏先看有没有内容回来', detail: '先判断是“没拿到资源”，还是“拿到了但没渲出来”。' },
  { title: '第四步：流程题最后补优化思路', detail: '这样回答不会停留在背流程，而是真能落到工程。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把流程背成一串名词', detail: '真正有用的是知道每一步在干什么、慢了会怎样。', points: ['不是背顺序游戏', '要知道目的', '要能连到排障'] },
  { title: '高频误区 2：认为服务端返回 HTML 就算结束', detail: '实际上浏览器解析、执行、布局、绘制还没开始或没完成。', points: ['HTML 只是开始', '静态资源也很关键', 'JS 可能继续阻塞'] },
  { title: '高频误区 3：首屏慢只盯接口', detail: '很多首屏问题其实是包太大、脚本太重、图片太大、布局太贵。', points: ['网络不是唯一瓶颈', 'JS 执行也会卡', '渲染成本别忽略'] },
  { title: '高频误区 4：HTTPS 只记得“更安全”', detail: '还要知道它为什么更安全，以及会多出握手成本。', points: ['TLS 握手', '证书校验', '安全与性能的平衡'] },
] as const;

const rules = [
  { title: 'URL 题先按“解析地址 -> 建连接 -> 请求资源 -> 解析渲染”来答', detail: '这条主线最稳，也最容易延展。' },
  { title: '白屏和首屏问题都要把网络与渲染分开看', detail: '这样排查才不会混。' },
  { title: '流程题最后最好补一句“这一步慢了会怎样”', detail: '会让回答更像真实工程分析。' },
  { title: '脚本、样式、图片都可能影响最终展示', detail: '不要把页面展示误解成只靠 HTML。' },
] as const;

export default function BrowserUrlLifecyclePage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Browser Principles / URL Flow"
      title="从输入 URL 到页面展示"
      lead="这页把浏览器里很经典的一道流程题拆成更好理解的版本：输入 URL 后，浏览器怎么找服务器、怎么拿资源、怎么把资源变成你眼前的页面。重点不是背概念，而是让每一步都有画面感。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把整条链路分段）"
      definitionsNote="用意：先知道每一步大致在做什么。"
      definitions={definitions}
      relationsTitle="块 2：流程速览"
      relationsNote="用意：先把从地址到页面的主线捋顺。"
      relations={relations}
      relationCodeTitle="URL To Render Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：网络阶段高频问题', note: '用意：先把地址解析、DNS、连接和请求说清楚。', label: 'Network', questions: networkQuestions },
        { title: '块 4：渲染阶段高频问题', note: '用意：再把 HTML、CSS、JS 和首屏展示串起来。', label: 'Rendering', questions: renderingQuestions },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：答流程题和排查题时有一条稳定主线。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把这类题里最容易答空、答浅的地方点出来。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆最稳定的答题顺序。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的关键问题。"
      themeStyle={browserPrinciplesTheme}
    />
  );
}
