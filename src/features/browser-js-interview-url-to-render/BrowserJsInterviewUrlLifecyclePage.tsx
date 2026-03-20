import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '主线', value: '输入 URL -> 网络请求 -> 响应解析 -> 渲染流水线' },
  { label: '关键层', value: 'DNS、TCP/HTTPS、HTTP、HTML 解析、CSSOM、Render Tree' },
  { label: '高频追问', value: '重定向、缓存、预解析、DOMContentLoaded 与 load' },
  { label: '答题重点', value: '按时间顺序讲，不要碎片化罗列' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 这道题最稳的答法，是按时间顺序把浏览器工作流串起来',
    paragraphs: [
      '浏览器输入 URL 到页面展示，中间过程很长，但并不是所有细节都要一口气抖出来。最好的回答方式，是按时间顺序讲：先确定 URL 和缓存策略，再做 DNS、TCP/HTTPS、HTTP 请求，拿到响应后解析 HTML、构建 DOM 和 CSSOM，最后生成渲染树并布局绘制。',
      '只要主线稳，面试官继续追问时你再往下展开缓存、重定向、脚本阻塞、回流重绘等细节即可。',
      '因此这道题真正考的是结构化表达能力，而不只是知识点多少。',
    ],
  },
  {
    title: '2. 输入 URL 后，浏览器会先做地址解析、缓存判断和连接准备',
    paragraphs: [
      '浏览器首先会解析 URL，确认协议、域名、端口和路径。随后会看本地是否有可用缓存，如果命中强缓存或协商缓存可能直接复用，减少后续网络请求。',
      '如果需要真正发请求，就要做 DNS 解析，把域名转成 IP；再建立 TCP 连接，如果是 HTTPS 还要做 TLS 握手。',
      '所以网络阶段不只是“发一个请求”，而是地址解析、缓存判断和连接建立三步配合。',
    ],
  },
  {
    title: '3. 拿到 HTML 后，浏览器进入解析阶段，开始同时推进 DOM、CSSOM 和资源发现',
    paragraphs: [
      'HTML 响应回来后，浏览器会边下载边解析，逐步构建 DOM 树。与此同时，它还会在解析过程中发现外链 CSS、JS、图片、字体等资源，再去请求这些依赖。',
      'CSS 会被解析成 CSSOM，DOM 和 CSSOM 之后一起参与渲染树生成。这个阶段很重要，因为并不是“先把 HTML 全解析完再做别的”，而是边解析边发现边请求。',
      '面试里如果你能讲出“边解析边发现资源”，会比流水账更像理解机制。',
    ],
  },
  {
    title: '4. JavaScript 可能阻塞解析，CSS 可能影响首屏可见内容生成',
    paragraphs: [
      '如果 HTML 解析过程中遇到普通 script，浏览器通常需要暂停解析，先下载并执行脚本，因为脚本可能改写 DOM。这也是为什么脚本位置和 `defer`/`async` 很重要。',
      'CSS 虽然不阻塞 DOM 树构建本身，但会影响渲染树生成和首屏绘制，因为浏览器通常需要知道样式后才能正确渲染页面。',
      '所以这道题如果只讲网络，不讲脚本和样式对解析渲染的影响，就还不够完整。',
    ],
  },
  {
    title: '5. DOM 和 CSSOM 就绪后，浏览器会生成 Render Tree，然后布局和绘制',
    paragraphs: [
      '浏览器把可见节点和它们的样式组合成 Render Tree，之后进入 Layout 计算每个节点的位置和尺寸，再进入 Paint 绘制像素内容。',
      '如果后续又有 DOM 变化或样式变化，可能会触发重新布局或重绘。也就是说，页面首次展示只是浏览器渲染流水线的第一次完整运行。',
      '这一步如果讲清，面试官通常就会觉得你不仅懂网络，还知道渲染层发生了什么。',
    ],
  },
  {
    title: '6. 面试里怎样把这题答稳',
    paragraphs: [
      '先按时间顺序讲：URL 解析、缓存判断、DNS、连接建立、HTTP 请求、HTML 解析、资源发现、DOM/CSSOM 构建、渲染树、布局绘制；再补 JS/CSS 对流程的影响；最后根据追问展开缓存、重定向、defer/async、DOMContentLoaded 等细节。',
      '一句话收尾可以这样说：浏览器从 URL 到页面展示，本质上是一条“网络获取 + 解析构建 + 渲染输出”的流水线。',
    ],
  },
];

export default function BrowserJsInterviewUrlLifecyclePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="Browser / Async / JS Interview"
      company="面试-浏览器 / 异步 / JS 基础类"
      issue="Issue 01"
      title="浏览器输入 URL 到页面展示，中间发生了什么"
      strapline="真正好的回答，不是把名词堆满，而是把网络、解析和渲染串成一条时间线。"
      abstract="这道题本质上是浏览器工作流总览题。高分回答要有主线、有阶段、有关键阻塞点，而不是零散罗列 DNS、HTTP、渲染几个词。"
      leadTitle="从网络到渲染，按时间顺序把浏览器工作流讲完整"
      lead="如果你能把地址解析、缓存、连接建立、HTML 解析、资源发现、渲染树、布局绘制这条链路讲顺，这道题就已经很完整了。后续追问再展开脚本阻塞、缓存、DOMContentLoaded 等细节即可。"
      answerOutline={[
        '先讲 URL 解析和缓存判断',
        '再讲 DNS、TCP/HTTPS 和 HTTP 请求',
        '然后讲 HTML 解析、资源发现、DOM/CSSOM 构建',
        '最后讲渲染树、布局、绘制和脚本/样式影响',
      ]}
      quickAnswer="一句话答法：浏览器输入 URL 到页面展示，通常会经历 URL 解析、缓存判断、DNS 解析、TCP/HTTPS 连接建立、HTTP 请求响应、HTML 解析、资源发现与加载、DOM 和 CSSOM 构建、Render Tree 生成、布局和绘制几个阶段。真正让页面显示出来的，是网络获取、解析构建和渲染输出这三段流水线的协同完成。"
      pullQuote="这道题最值钱的，不是记住多少名词，而是能把整个过程讲成一条稳定时间线。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '按时间顺序讲是最稳的，不要碎片化跳来跳去。',
        '脚本阻塞解析、CSS 影响渲染树这两个点很值得顺手补。',
        '先给主线，再根据追问展开细节，节奏最好。',
      ]}
      mistakes={[
        '只罗列 DNS、HTTP、渲染几个词，没有完整链路。',
        '忽略缓存、脚本阻塞和资源发现机制。',
        '把解析和渲染阶段混成一团。',
      ]}
      singleColumn
    />
  );
}
