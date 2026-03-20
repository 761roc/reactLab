import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { browserPrinciplesTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: 'cookie、localStorage、sessionStorage、IndexedDB 和使用边界都覆盖。' },
  { label: 'Focus', value: 'Who Stores What', detail: '核心是分清“谁会自动带给服务端”“谁只在浏览器本地用”“谁适合大数据”。' },
  { label: 'Scenarios', value: '登录状态 / 草稿 / 离线数据', detail: '不同存储方案适合的业务场景差别很大。' },
] as const;

const definitions = [
  { title: 'cookie 很小，但会和请求一起走', detail: '它常和登录态、会话相关，但也正因为会自动带请求，所以更要谨慎。' },
  { title: 'localStorage 更像长期本地小仓库', detail: '关闭浏览器后通常还在，适合放本地偏好、轻量缓存。' },
  { title: 'sessionStorage 更像当前标签页的小仓库', detail: '标签页关了通常就没了，更像临时状态。' },
  { title: 'IndexedDB 更适合复杂和大体量数据', detail: '它不像前两者那样简单，但更适合离线数据、结构化本地缓存。' },
  { title: '存储题不要只背容量', detail: '更关键的是生命周期、是否自动带请求、是否适合复杂数据。' },
  { title: '安全性和便利性通常是一起讨论的', detail: '方便并不等于安全，尤其是 cookie 和本地存储都要看你放了什么。' },
] as const;

const relations = [
  { title: 'cookie', detail: '体积小，可随请求自动发送给服务端。', signal: 'Auto Sent' },
  { title: 'localStorage', detail: '本地长期保存，API 简单，但只适合较轻量数据。', signal: 'Persistent Local' },
  { title: 'sessionStorage', detail: '标签页级别存储，更临时。', signal: 'Per Tab' },
  { title: 'IndexedDB', detail: '更像浏览器里的本地数据库，适合大数据量和结构化数据。', signal: 'Structured Large Data' },
] as const;

const relationCode = `cookie -> 常见于会话和服务端交互
localStorage -> 偏本地长期偏好
sessionStorage -> 偏当前页临时状态
IndexedDB -> 偏离线缓存和复杂数据`;

const baseQuestions = [
  { title: '问题 1：cookie、localStorage、sessionStorage 最容易怎么区分？', answer: '最稳的区分方法是看生命周期、是否自动带请求、适合放什么。', explanation: '只背“一个 4KB、一个 5MB”太浅，面试里最好顺手补使用场景。', code: `cookie: 会自动带给服务端
localStorage: 本地长期
sessionStorage: 当前标签页`, codeTitle: 'Storage Quick Compare' },
  { title: '问题 2：为什么登录态相关问题常常会提到 cookie？', answer: '因为 cookie 天然和 HTTP 请求链路贴得更近，服务端处理会更顺手。', explanation: '但这不等于“登录态只能放 cookie”，还要看安全方案和系统设计。', code: `Set-Cookie: session=abc; HttpOnly; Secure`, codeTitle: 'Cookie Session Example' },
  { title: '问题 3：为什么 localStorage 不适合放特别敏感的信息？', answer: '因为它对页面脚本是可读可写的，一旦页面被 XSS 攻击，敏感数据就可能被读走。', explanation: '这类题常和安全题连着考。', code: `localStorage.setItem("theme", "dark")`, codeTitle: 'localStorage Example' },
  { title: '问题 4：sessionStorage 最适合哪类场景？', answer: '适合当前标签页临时状态，比如多步表单中间态、一次性流程数据、临时跳转信息。', explanation: '它的特点不是“更高级”，而是作用域更短、更局部。', code: `sessionStorage.setItem("draftStep", "2")`, codeTitle: 'sessionStorage Example' },
] as const;

const practicalQuestions = [
  { title: '问题 5：IndexedDB 为什么经常被拿来和前两者区分开？', answer: '因为它更像真正的本地数据库，适合存更大、更复杂的数据，而不是简单键值字符串。', explanation: '像离线文章、图片索引、大量列表缓存，这类场景前两者就会很吃力。', code: `const request = indexedDB.open("app-cache", 1)`, codeTitle: 'IndexedDB Example' },
  { title: '问题 6：前端偏好设置一般更适合放哪？', answer: '像主题、语言、侧边栏是否收起这类本地偏好，通常放 localStorage 很合适。', explanation: '因为它们不敏感、数据量小、希望下次打开还在。', code: `localStorage.setItem("theme", "dark")`, codeTitle: 'Preference Storage' },
  { title: '问题 7：为什么说存储题要和安全题一起看？', answer: '因为“能不能存”和“该不该这样存”不是一回事。很多问题不在存储 API，而在你放了什么。', explanation: '比如 token、会话标识、隐私数据，一旦放错地方，风险会放大。', code: `敏感信息
-> 不只是考虑能否读写
-> 还要考虑脚本暴露面与传输方式`, codeTitle: 'Security Angle' },
  { title: '问题 8：存储题怎么答得更工程化？', answer: '按“生命周期、容量、是否自动带请求、安全性、典型场景”这几个维度答，会很完整。', explanation: '这比死背表格更像真实选型。', code: `生命周期
自动发送?
数据量
安全性
业务场景`, codeTitle: 'Selection Dimensions' },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问数据要活多久', detail: '临时、标签页级、长期，这一步很关键。' },
  { title: '第二步：再问数据需不需要随请求自动发给服务端', detail: '需要的话 cookie 语义会更接近。' },
  { title: '第三步：看数据是轻量键值还是复杂大数据', detail: '复杂大数据时 IndexedDB 更像正解。' },
  { title: '第四步：最后补安全性', detail: '特别是敏感信息和会话相关数据，别只从“能不能存”思考。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：只背容量大小', detail: '容量只是一个维度，生命周期和安全性往往更重要。', points: ['别只背 4KB / 5MB', '生命周期更关键', '场景优先'] },
  { title: '高频误区 2：什么都往 localStorage 放', detail: '方便不等于合适，尤其是敏感信息和复杂数据。', points: ['脚本可访问', '有 XSS 风险', '复杂数据不合适'] },
  { title: '高频误区 3：把 sessionStorage 当成“更安全的 localStorage”', detail: '它的主要区别是作用域和生命周期，不是自动更安全。', points: ['标签页级别', '生命周期更短', '不是安全升级版'] },
  { title: '高频误区 4：完全不了解 IndexedDB', detail: '真实项目里离线能力和大体量缓存越来越常见，这块值得至少知道定位。', points: ['本地数据库', '结构化数据', '离线缓存'] },
] as const;

const rules = [
  { title: '偏好设置优先想到 localStorage', detail: '轻量、本地、希望下次还在。' },
  { title: '当前页临时流程优先想到 sessionStorage', detail: '更适合短生命周期状态。' },
  { title: '需要和服务端会话更紧密配合时想到 cookie', detail: '但别忘了安全属性。' },
  { title: '大数据和离线缓存优先想到 IndexedDB', detail: '不要勉强塞进简单字符串存储。' },
] as const;

export default function BrowserStorageSummaryPage() {
  return <KnowledgeSummaryPage eyebrow="Browser Principles / Storage" title="浏览器存储：cookie、localStorage、sessionStorage、IndexedDB" lead="这页把浏览器存储这块讲得更实用一点：什么适合长期放本地，什么只适合当前标签页，什么会自动带给服务端，什么更适合做大一点的本地数据仓库。重点不是背容量，而是会选型。" heroCards={heroCards} definitionsTitle="块 1：基础定义（先知道每种存储的大致定位）" definitionsNote="用意：先把四种常见存储方案的角色分开。 " definitions={definitions} relationsTitle="块 2：存储选型速览" relationsNote="用意：先把四种存储放到同一张对比图里。 " relations={relations} relationCodeTitle="Storage Positioning" relationCode={relationCode} questionGroups={[{ title: '块 3：基础机制高频问题', note: '用意：先把几种存储的差异和适用场景讲清。', label: 'Storage Basics', questions: baseQuestions }, { title: '块 4：工程实践高频问题', note: '用意：再把选型、安全和离线场景连到真实项目。', label: 'Storage Practice', questions: practicalQuestions }]} diagnosticTitle="块 5：四步拆题法" diagnosticNote="用意：选型题和面试题都能按这条顺序拆。 " diagnosticSteps={diagnosticSteps} pitfallsTitle="块 6：常见误区" pitfallsNote="用意：把存储题里最容易答浅的几个点点出来。 " pitfalls={pitfalls} rulesTitle="块 7：记忆规则" rulesNote="用意：复盘时快速回忆最稳的选型逻辑。 " rules={rules} overviewTitle="块 8：问题总览" overviewNote="用意：快速回顾这页覆盖的问题。 " themeStyle={browserPrinciplesTheme} />;
}
