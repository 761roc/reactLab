import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { browserPrinciplesTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '强缓存、协商缓存、缓存头、命中顺序和工程里的常见误区。' },
  { label: 'Focus', value: 'Use Cache First', detail: '缓存题核心是“浏览器要不要重新请求”和“服务端要不要重新回数据”。' },
  { label: 'Scenarios', value: '首屏 / 静态资源 / 接口', detail: '静态资源命名、CDN、接口缓存策略几乎都会碰到。' },
] as const;

const definitions = [
  { title: '强缓存可以直接不发请求', detail: '只要缓存还有效，浏览器就直接用本地副本，连服务端都不问。' },
  { title: '协商缓存会先问服务端“我这份还能不能继续用”', detail: '浏览器会带上标识，服务端判断没变就回 304。' },
  { title: '`Cache-Control` 是现代缓存控制主力', detail: '面试里优先讲它，再补 `Expires` 这种老方案。' },
  { title: '`ETag` 和 `Last-Modified` 都是协商缓存标识', detail: '一个更像内容指纹，一个更像修改时间。' },
  { title: '缓存不是只为快，也是为了省请求', detail: '省带宽、省服务器压力、省用户等待时间。' },
  { title: '缓存策略要分资源类型看', detail: '静态 hash 资源、HTML、接口数据，通常不会用同一套策略。' },
] as const;

const relations = [
  { title: '强缓存', detail: '缓存没过期，浏览器直接用本地副本。', signal: 'No Request' },
  { title: '协商缓存', detail: '浏览器带上标识去问，服务端决定 200 还是 304。', signal: 'Validate With Server' },
  { title: 'HTML', detail: '通常缓存会更谨慎，因为它直接影响页面内容更新。', signal: 'Shorter Strategy' },
  { title: '静态资源', detail: '带 hash 的 JS/CSS/图片很适合长缓存。', signal: 'Long Cache' },
] as const;

const relationCode = `请求资源
-> 先看强缓存是否有效
-> 有效: 直接使用缓存
-> 无效: 发请求并带上协商缓存标识
-> 服务端返回 304 或新资源`;

const baseQuestions = [
  {
    title: '问题 1：强缓存和协商缓存最本质的区别是什么？',
    answer: '强缓存命中时连请求都不发；协商缓存会发请求，但服务端可能只回一个 304。', explanation: '一个重点在“本地直接用”，一个重点在“先确认再决定”。这句答法最稳。', code: `Cache-Control: max-age=3600
ETag: "abc123"`, codeTitle: 'Cache Headers Example'
  },
  {
    title: '问题 2：`Cache-Control` 和 `Expires` 怎么答？',
    answer: '`Cache-Control` 更现代、更灵活，优先级也更高；`Expires` 是基于绝对时间的老方案。', explanation: '面试里别只说“都能缓存”，要补上优先级和时间模型差异。', code: `Cache-Control: max-age=600
Expires: Wed, 21 Oct 2030 07:28:00 GMT`, codeTitle: 'Cache-Control vs Expires'
  },
  {
    title: '问题 3：`ETag` 和 `Last-Modified` 有什么区别？',
    answer: '`Last-Modified` 看修改时间，`ETag` 更像资源内容指纹，通常更精细。', explanation: '如果资源内容没变但时间变了，或者时间精度不够，`ETag` 往往更稳。', code: `If-Modified-Since: Tue, 19 Mar 2026 10:00:00 GMT
If-None-Match: "v3-assets-hash"`, codeTitle: 'Validation Headers'
  },
  {
    title: '问题 4：为什么静态资源常配长缓存 + hash 文件名？',
    answer: '因为资源内容一变，hash 也会变，浏览器就会把它当成新文件，从而既能长缓存又不怕更新不生效。', explanation: '这是前端构建里非常经典的做法，答缓存题时最好主动提一下。', code: `app.7f3c9a.js
styles.92d1ef.css`, codeTitle: 'Hashed Assets Example'
  },
] as const;

const practicalQuestions = [
  {
    title: '问题 5：为什么 HTML 通常不做特别长的强缓存？',
    answer: '因为 HTML 往往是入口文件，里面会引用最新的资源地址，缓存太久容易导致用户拿不到新版本。', explanation: '很多项目会让 HTML 更保守，而把长缓存重点给带 hash 的静态资源。', code: `HTML: no-cache
JS/CSS with hash: max-age=31536000, immutable`, codeTitle: 'HTML vs Assets Strategy'
  },
  {
    title: '问题 6：304 返回后，数据是谁提供的？',
    answer: '真正的资源内容还是浏览器本地缓存里的那份，304 更像是在说“你本地那份还能继续用”。', explanation: '很多人会误以为 304 也回了完整资源，其实它回得非常少。', code: `状态码: 304 Not Modified
响应体: 通常为空
实际内容: 继续用本地缓存`, codeTitle: '304 Meaning'
  },
  {
    title: '问题 7：接口数据也能做缓存吗？',
    answer: '能，但要谨慎。数据更新频率、用户身份、业务实时性都会影响你能不能放心缓存。', explanation: '接口缓存题最好别答成“都缓存”。要体现你知道接口数据和静态资源风险不同。', code: `用户头像、地区列表: 可以适当缓存
订单状态、余额: 通常更谨慎`, codeTitle: 'API Cache Tradeoff'
  },
  {
    title: '问题 8：缓存题最后怎么答得更像实战？',
    answer: '把资源类型分开答：HTML、静态资源、接口，各说一套合理策略。', explanation: '这比背一堆缓存头更像真实项目经验。', code: `入口 HTML -> 保守缓存
Hash 静态资源 -> 长缓存
接口 -> 按业务实时性决定`, codeTitle: 'Practical Strategy'
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问有没有发请求', detail: '没发请求大概率是强缓存；发了再看是不是协商缓存。' },
  { title: '第二步：再看响应码和请求头', detail: '200、304、`If-None-Match`、`If-Modified-Since` 都是关键线索。' },
  { title: '第三步：按资源类型分策略', detail: 'HTML、hash 资源、接口，不能一锅端。' },
  { title: '第四步：缓存题最后补更新机制', detail: '只讲快不够，还要讲怎么保证资源更新能生效。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把强缓存和协商缓存混成一回事', detail: '前者重点是“不发请求”，后者重点是“发请求确认”。', points: ['先看有没有请求', '再看是不是 304', '不要只背名字'] },
  { title: '高频误区 2：HTML 和静态资源用同一套策略', detail: '入口 HTML 通常更保守，静态 hash 资源才更适合长缓存。', points: ['入口更敏感', 'hash 资源更稳定', '分资源答题更稳'] },
  { title: '高频误区 3：只会背缓存头，不会说业务取舍', detail: '缓存题落到工程上，本质是“快”和“准”的平衡。', points: ['更新及时性', '资源类型', '用户体验'] },
  { title: '高频误区 4：把 304 误解成服务端重新把资源传了一遍', detail: '304 通常没有完整响应体，真正继续用的是本地缓存。', points: ['304 很轻', '内容来自本地', '只是确认可继续用'] },
] as const;

const rules = [
  { title: '缓存题先问“浏览器有没有发请求”', detail: '这是区分强缓存和协商缓存的最快入口。' },
  { title: '入口 HTML 和 hash 静态资源分开答', detail: '这是工程化回答里最加分的一步。' },
  { title: '304 不是重新下载资源', detail: '它更像服务端点头说“本地那份继续用”。' },
  { title: '接口缓存要结合业务实时性', detail: '不要把静态资源的缓存逻辑直接套到接口上。' },
] as const;

export default function BrowserCacheSummaryPage() {
  return (
    <KnowledgeSummaryPage eyebrow="Browser Principles / Cache" title="浏览器缓存" lead="这页把缓存这件事讲得更直白一点：浏览器到底要不要重新请求，服务端到底要不要重新给内容。强缓存和协商缓存经常一起出现，但它们解决的问题并不是同一层。" heroCards={heroCards} definitionsTitle="块 1：基础定义（先知道缓存在控制什么）" definitionsNote="用意：先把强缓存、协商缓存和常见响应头的定位分清。" definitions={definitions} relationsTitle="块 2：缓存主线速览" relationsNote="用意：先把浏览器判断缓存的主流程捋一遍。" relations={relations} relationCodeTitle="Cache Flow" relationCode={relationCode} questionGroups={[{ title: '块 3：缓存机制高频问题', note: '用意：先把强缓存、协商缓存和缓存头讲清。', label: 'Cache Basics', questions: baseQuestions }, { title: '块 4：工程实践高频问题', note: '用意：再把 HTML、静态资源和接口缓存放到真实项目里看。', label: 'Practical Cache', questions: practicalQuestions }]} diagnosticTitle="块 5：四步拆题法" diagnosticNote="用意：缓存题和排查题都能按这条顺序拆。" diagnosticSteps={diagnosticSteps} pitfallsTitle="块 6：常见误区" pitfallsNote="用意：把缓存题里最容易说混的点掰开。" pitfalls={pitfalls} rulesTitle="块 7：记忆规则" rulesNote="用意：复盘时快速过一遍最稳的答题主线。" rules={rules} overviewTitle="块 8：问题总览" overviewNote="用意：快速回顾这页覆盖的问题。" themeStyle={browserPrinciplesTheme} />
  );
}
