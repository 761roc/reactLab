import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { browserPrinciplesTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: 'XSS、CSRF、点击劫持和前端常见安全意识一次讲清。' },
  { label: 'Focus', value: 'Can The Browser Be Tricked', detail: '很多安全题本质是在问：浏览器或用户会不会被利用。' },
  { label: 'Scenarios', value: '输入渲染 / 登录状态 / 外链页面', detail: '评论区、富文本、自动带 cookie 的请求都很容易连到这里。' },
] as const;

const definitions = [
  { title: 'XSS 是“把恶意脚本塞进页面里执行”', detail: '一旦执行起来，脚本就可能读页面数据、发请求、冒充用户操作。' },
  { title: 'CSRF 是“借用户身份偷偷发请求”', detail: '重点不是偷脚本，而是利用浏览器会自动带上登录态。' },
  { title: '点击劫持是“骗你点错东西”', detail: '常见方式是把目标页面放进透明 iframe 里，诱导用户误点。' },
  { title: '安全题很多时候和 cookie、同源策略绑在一起', detail: '因为浏览器自动带凭证、页面能不能读数据，都和安全边界有关。' },
  { title: '前端安全不是只靠前端', detail: '前端能做输入处理、输出转义、CSP 等，但很多防护还要后端一起配合。' },
  { title: '安全题别只背名字，最好能说攻击路径', detail: '能说清“怎么被打”“怎么防”，回答会更扎实。' },
] as const;

const relations = [
  { title: 'XSS', detail: '恶意脚本进页面并执行。', signal: 'Script Injection' },
  { title: 'CSRF', detail: '借浏览器自动带凭证，冒充用户发请求。', signal: 'Cross Site Request' },
  { title: '点击劫持', detail: '骗用户在不知情的情况下点中敏感按钮。', signal: 'Hidden Frame Trap' },
  { title: '防护', detail: '转义、CSP、SameSite、CSRF Token、X-Frame-Options 等要配合。', signal: 'Defense In Depth' },
] as const;

const relationCode = `XSS -> 恶意脚本进页面
CSRF -> 利用用户现有登录态发请求
点击劫持 -> 诱导用户误操作

防护不是单点，而是多层一起做`;

const attackQuestions = [
  { title: '问题 1：XSS 最通俗怎么解释？', answer: '就是本来页面应该只显示内容，结果却把恶意脚本也当内容的一部分执行了。', explanation: '一旦脚本执行起来，它就拥有页面脚本的很多能力，风险很大。', code: `dangerouslySetInnerHTML
未转义的评论内容
富文本输出`, codeTitle: 'XSS Entry Example' },
  { title: '问题 2：XSS 常见有哪几类？', answer: '常见会提到存储型、反射型和 DOM 型。通俗点说，就是恶意内容是存进数据库了、跟请求一起回来了，还是在前端自己拼出来的。', explanation: '面试时不用过度背定义，但最好知道攻击入口不止一种。', code: `存储型: 评论存库再展示
反射型: 参数直接回页面
DOM 型: 前端拼接 HTML`, codeTitle: 'XSS Types' },
  { title: '问题 3：CSRF 最核心在利用什么？', answer: '它核心在利用浏览器会自动带上用户已有的身份凭证，比如 cookie。', explanation: '所以攻击者不一定能看到响应，但只要能让请求发出去，很多坏事就已经发生了。', code: `用户已登录银行站点
恶意页面诱导浏览器发转账请求`, codeTitle: 'CSRF Core' },
  { title: '问题 4：点击劫持为什么危险？', answer: '因为用户以为自己点的是普通按钮，实际上点中的是被透明覆盖的敏感按钮。', explanation: '它是利用视觉欺骗，不是去突破网络协议。', code: `iframe 覆盖
透明层诱导点击`, codeTitle: 'Clickjacking Idea' },
] as const;

const defenseQuestions = [
  { title: '问题 5：防 XSS 最核心的思路是什么？', answer: '核心是别让不可信内容被当成可执行脚本处理，也就是输入校验 + 输出转义 + 限制脚本执行环境。', explanation: '很多时候不是“不要接收用户输入”，而是“不要原样把它当 HTML / JS 执行”。', code: `文本输出时做转义
避免直接拼接 HTML
使用 CSP`, codeTitle: 'XSS Defense' },
  { title: '问题 6：防 CSRF 常见有哪些办法？', answer: '常见会提到 CSRF Token、SameSite Cookie、校验 Referer / Origin 等。', explanation: '好的回答要体现你知道这不是只靠一个手段解决的。', code: `Set-Cookie: SameSite=Lax
请求中带 CSRF Token`, codeTitle: 'CSRF Defense' },
  { title: '问题 7：点击劫持通常怎么防？', answer: '常见手段是禁止页面被别的网站随便 iframe 嵌入，比如 `X-Frame-Options` 或 CSP 的 `frame-ancestors`。', explanation: '这类题答到“禁止被套娃进 iframe”通常就已经很稳。', code: `X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'`, codeTitle: 'Clickjacking Defense' },
  { title: '问题 8：安全题怎么答得更像实战？', answer: '顺手把攻击路径、受害条件、前后端配合防护和常见误区一起带上。', explanation: '只背名字很容易显得空，能讲“怎么被打、怎么堵住”会扎实很多。', code: `攻击路径
-> 受害条件
-> 防护点
-> 工程措施`, codeTitle: 'Security Answer Structure' },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问攻击者是想“执行脚本”还是“借身份发请求”', detail: '这一步通常能快速区分 XSS 和 CSRF。' },
  { title: '第二步：再问浏览器自动帮了攻击者什么', detail: '比如自动带 cookie、自动执行脚本、自动展示 iframe。' },
  { title: '第三步：再看防护应该落在哪一层', detail: '输入、输出、响应头、cookie 属性、服务端校验都可能是关键点。' },
  { title: '第四步：最后补前后端协作', detail: '安全题很少是单端独立解决的。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 XSS 和 CSRF 混掉', detail: '一个偏脚本注入，一个偏借用户身份发请求，攻击路径完全不同。', points: ['XSS 看脚本执行', 'CSRF 看身份凭证', '别混成一个词'] },
  { title: '高频误区 2：认为安全只靠前端', detail: '前端能做很多事，但很多防护必须和后端一起配。', points: ['前后端协作', '响应头', 'token 与 cookie 策略'] },
  { title: '高频误区 3：只会说“过滤输入”', detail: '真正安全防护往往是输入、输出、执行环境、协议头多层叠加。', points: ['转义', 'CSP', 'SameSite', 'Token'] },
  { title: '高频误区 4：把点击劫持忽略成冷门知识', detail: '虽然它没 XSS / CSRF 常见，但很适合考你是否理解浏览器层面的安全边界。', points: ['iframe', '视觉欺骗', '响应头防护'] },
] as const;

const rules = [
  { title: '看到脚本执行风险先想到 XSS', detail: '尤其是富文本、评论区、DOM 拼接。' },
  { title: '看到借用户身份偷偷发请求先想到 CSRF', detail: '尤其是 cookie 自动携带场景。' },
  { title: '看到 iframe 套页面先想到点击劫持', detail: '这类题的关键是用户被视觉误导。' },
  { title: '安全题最后最好补多层防护', detail: '这样回答不会停留在单点技巧。' },
] as const;

export default function BrowserSecuritySummaryPage() {
  return <KnowledgeSummaryPage eyebrow="Browser Principles / Security" title="浏览器安全：XSS、CSRF、点击劫持" lead="这页把浏览器安全里最常见的几道面试题讲得更直白一点：恶意脚本怎么进页面，攻击者怎么借你的登录态发请求，又为什么一个透明 iframe 也可能变成安全问题。重点不是背缩写，而是看懂攻击路径。" heroCards={heroCards} definitionsTitle="块 1：基础定义（先把三类安全问题分开）" definitionsNote="用意：先知道每种攻击主要在利用什么。 " definitions={definitions} relationsTitle="块 2：攻击与防护速览" relationsNote="用意：先把 XSS、CSRF、点击劫持和常见防护放到同一张图里。 " relations={relations} relationCodeTitle="Security Overview" relationCode={relationCode} questionGroups={[{ title: '块 3：攻击机制高频问题', note: '用意：先把三类安全问题的攻击路径讲清。', label: 'Attack Model', questions: attackQuestions }, { title: '块 4：防护思路高频问题', note: '用意：再把常见防护方式和工程答法补齐。', label: 'Defense', questions: defenseQuestions }]} diagnosticTitle="块 5：四步拆题法" diagnosticNote="用意：安全题回答时有一条稳定的分析主线。 " diagnosticSteps={diagnosticSteps} pitfallsTitle="块 6：常见误区" pitfallsNote="用意：把安全题里最容易混、最容易答空的点点出来。 " pitfalls={pitfalls} rulesTitle="块 7：记忆规则" rulesNote="用意：复盘时快速回忆每类攻击的核心特征。 " rules={rules} overviewTitle="块 8：问题总览" overviewNote="用意：快速回顾这页覆盖的问题。 " themeStyle={browserPrinciplesTheme} />;
}
