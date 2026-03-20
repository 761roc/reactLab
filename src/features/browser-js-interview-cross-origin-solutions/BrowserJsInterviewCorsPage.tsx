import {
  InterviewEditorialPage,
  type EditorialComparisonTable,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心问题', value: '浏览器同源策略限制页面主动访问不同源资源' },
  { label: '常见方案', value: 'CORS、反向代理、JSONP、postMessage、服务端转发' },
  { label: '关键边界', value: '不同方案解决的问题层面并不相同' },
  { label: '答题重点', value: '要区分浏览器限制、服务端策略和跨窗口通信' },
];

const comparisonTable: EditorialComparisonTable = {
  title: '常见跨域方案边界',
  intro: '不要把所有方案混成一类，有些解决请求访问，有些解决窗口通信，有些只是开发代理。',
  headers: ['方案', '解决什么', '边界/限制'],
  rows: [
    ['CORS', '浏览器允许跨源请求', '需要服务端配合设置响应头'],
    ['反向代理', '同源转发请求', '常用于开发或网关层，不是浏览器能力变化'],
    ['JSONP', '利用 script 标签跨域拉数据', '只支持 GET，且有安全与能力局限'],
    ['postMessage', '跨窗口/iframe 安全通信', '不用于普通 HTTP 接口请求'],
    ['服务端转发', '由后端去请求目标资源', '链路更重，权限与安全要额外处理'],
  ],
};

const sections: EditorialSection[] = [
  {
    title: '1. 先讲根因：跨域问题本质上来自浏览器的同源策略',
    paragraphs: [
      '很多人会把“跨域”说成前后端地址不一样，但真正的根因是浏览器同源策略。浏览器为了安全，不允许页面脚本随意访问不同协议、域名或端口的资源和数据。',
      '所以这道题最稳的第一句话，是先说：跨域不是服务端天然做错了什么，而是浏览器默认不让前端随便跨源读数据。',
      '只有这个根因先讲清，后面各种解法才不会变成无头清单。',
    ],
  },
  {
    title: '2. CORS 是最标准的解决方案，本质是服务端明确授权浏览器放行',
    paragraphs: [
      'CORS 的核心不是“前端设置了什么”，而是服务端通过响应头告诉浏览器：这个源的请求是被允许的。浏览器看到这些头后，才会放开对响应结果的访问。',
      '因此 CORS 是标准、正统、最常见的跨域接口访问方案，前提是目标服务端可控或愿意配合。',
      '面试里如果你能强调“CORS 的决定权在服务端响应头”，这会非常稳。',
    ],
  },
  {
    title: '3. 反向代理和网关转发，常用于把跨域问题转成同源问题',
    paragraphs: [
      '开发阶段常见的 Vite / Webpack dev server 代理，本质上不是浏览器突然支持跨域了，而是请求先打到同源开发服务器，再由它去转发目标地址。',
      '线上也类似，可以通过网关或 BFF 做统一转发，让前端看到的仍是同源地址。',
      '所以代理方案解决的是“请求入口同源化”，它属于架构层解决方式，而不是浏览器规则改变。',
    ],
  },
  {
    title: '4. JSONP 和 postMessage 常被一起提，但它们解决的问题不是一个层面',
    paragraphs: [
      'JSONP 利用的是 script 标签可跨域加载这一特性，本质上是让对方返回一段函数调用代码，从而拿到数据。它只能做 GET，而且有明显历史局限，现在更多是历史知识点。',
      '`postMessage` 则完全不是在解决普通接口请求跨域，它解决的是窗口、iframe、弹窗之间如何安全传消息。比如主页面和嵌入的 iframe 不同源，但仍需要通信，这时 `postMessage` 很合适。',
      '所以回答时一定要分清：JSONP 是特殊跨域取数手段，postMessage 是跨窗口通信方案。',
    ],
  },
  {
    title: '5. 服务端转发适合目标源不可直接开放时的后端兜底方案',
    paragraphs: [
      '如果目标第三方服务不支持 CORS，前端又必须拿到结果，常见做法就是由自己后端去请求第三方，再把结果返回给前端。因为服务端之间本来不受浏览器同源策略限制。',
      '但这会引入新的责任，比如凭证保管、限流、安全审计和链路成本。',
      '所以它是很常见的工程兜底方案，但不是没有代价的“万能代理”。',
    ],
  },
  {
    title: '6. 面试里怎样把跨域题答稳',
    paragraphs: [
      '先讲根因是浏览器同源策略；再把方案按层拆：CORS 解决浏览器跨源请求授权，代理/网关解决入口同源化，JSONP 是历史 GET 方案，postMessage 是跨窗口通信，服务端转发是后端兜底；最后补各自边界。',
      '一句话收尾可以这样说：跨域没有万能方案，关键是先搞清你要解决的是浏览器请求限制、窗口通信，还是架构层流量转发。',
    ],
  },
];

export default function BrowserJsInterviewCorsPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="Browser / Async / JS Interview"
      company="面试-浏览器 / 异步 / JS 基础类"
      issue="Issue 06"
      title="跨域问题常见有哪些解法，各自边界是什么"
      strapline="别把所有方案混成一类，先分清你在解决浏览器限制、窗口通信，还是网关转发。"
      abstract="这道题高分回答的关键，不是报方案名，而是先回到同源策略这个根因，再说明每种方案到底在解决哪个层面的问题。"
      leadTitle="从同源策略讲到 CORS、代理、postMessage，各讲各的边界"
      lead="如果不先讲根因，跨域题很容易变成名词堆砌。更完整的回答应该说明：有些方案在解浏览器访问限制，有些在解跨窗口通信，有些则是架构层的入口治理。"
      answerOutline={[
        '先讲跨域根因是浏览器同源策略',
        '再讲 CORS 和代理的两条主流路径',
        '然后区分 JSONP、postMessage、服务端转发的边界',
        '最后总结没有万能方案，关键看问题层面',
      ]}
      quickAnswer="一句话答法：跨域问题的根因是浏览器同源策略。最标准的接口访问方案是 CORS，由服务端通过响应头授权浏览器放行；代理和网关则是把跨域问题转成同源入口问题；JSONP 是历史上的特殊 GET 取数方案；postMessage 解决的是不同窗口或 iframe 间通信；服务端转发则适合第三方服务不支持 CORS 时的后端兜底。"
      pullQuote="跨域题答得好不好，关键看你会不会先把“问题层面”分清。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '一定先讲同源策略，这是根因。',
        '区分“接口跨域”和“窗口通信”是高频加分点。',
        '被问方案时，最好同时说适用边界和代价。',
      ]}
      mistakes={[
        '把所有方案都说成在解决同一个问题。',
        '把 CORS 讲成前端本地配置能力。',
        '把 postMessage 误说成普通接口跨域方案。',
      ]}
      comparisonTable={comparisonTable}
      singleColumn
    />
  );
}
