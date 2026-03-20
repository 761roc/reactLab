import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '强缓存', value: '命中后直接用本地缓存，不发请求' },
  { label: '协商缓存', value: '发请求确认资源是否变更，再决定是否复用' },
  { label: '核心目标', value: '减少重复传输，同时保证一致性' },
  { label: '答题重点', value: '先讲流程，再讲头字段' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 浏览器缓存题最好先讲“请求来了之后浏览器怎么决策”',
    paragraphs: [
      '很多人回答缓存题时会立刻背 `Cache-Control`、`ETag`、`Last-Modified`，但真正更容易让面试官听明白的方式，是先讲流程。也就是：浏览器拿到一个资源请求后，会先看本地缓存是否还能直接用；如果不能直接用，再去向服务端协商确认资源有没有变化。',
      '这个流程一旦讲清，强缓存和协商缓存的区别就非常自然了。',
      '所以这道题先讲“浏览器决策过程”，比先讲字段更稳。',
    ],
  },
  {
    title: '2. 强缓存：命中时直接用本地资源，连请求都不发',
    paragraphs: [
      '强缓存的特点很明确：如果缓存还没过期，浏览器就直接使用本地副本，不去服务器确认。常见控制字段是 `Cache-Control: max-age` 和过去的 `Expires`。',
      '它的优点是最快，因为连网络往返都没有；缺点是如果资源确实变了，但缓存还没过期，用户会继续拿到旧版本。',
      '所以强缓存解决的是“快”，但它的更新依赖缓存时间策略和资源版本管理。',
    ],
  },
  {
    title: '3. 协商缓存：浏览器带着标识去问服务器，确认资源是否更新',
    paragraphs: [
      '如果强缓存过期或当前策略要求再确认，浏览器就会发起请求，但会带上资源标识，例如 `If-None-Match` 或 `If-Modified-Since`。服务端收到后判断资源有没有变化，如果没变就返回 `304 Not Modified`，让浏览器继续使用本地缓存。',
      '因此协商缓存的特点是：有网络请求，但不一定重新传资源实体。',
      '它解决的是“在速度和一致性之间做更细的平衡”。',
    ],
  },
  {
    title: '4. 常见字段关系要会讲，但最好放在流程后面说',
    paragraphs: [
      '`Cache-Control` 通常主导强缓存策略；`Expires` 是较早的绝对时间方案；`ETag` 和 `If-None-Match` 主要用在协商缓存的内容标识；`Last-Modified` 和 `If-Modified-Since` 则基于修改时间。',
      '其中 `ETag` 通常比 `Last-Modified` 更精细，因为仅靠时间戳可能存在精度和内容变了但时间表现不明显的问题。',
      '回答时不要只背头字段，最好把它们放回浏览器决策链路里。',
    ],
  },
  {
    title: '5. 面试里怎样把这题答稳',
    paragraphs: [
      '先讲浏览器收到请求后的缓存决策流程；再讲强缓存和协商缓存的区别；然后补各自常见字段；最后总结它们共同服务的目标是减少重复传输并尽量保证资源一致性。',
      '一句话收尾可以这样说：强缓存是“先不问直接用”，协商缓存是“先问一下再决定要不要继续用”。',
    ],
  },
];

export default function BrowserJsInterviewCachePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="Browser / Async / JS Interview"
      company="面试-浏览器 / 异步 / JS 基础类"
      issue="Issue 05"
      title="浏览器缓存、协商缓存、强缓存分别怎么工作"
      strapline="先把浏览器缓存决策流程讲清，再谈头字段，答案会顺很多。"
      abstract="这道题高分回答的关键，不是背字段清单，而是解释浏览器在请求资源时，到底是如何决定直接用缓存、去协商，还是重新下载。"
      leadTitle="从“浏览器先怎么判断”讲清强缓存和协商缓存"
      lead="缓存题最稳的主线就是：先看本地能不能直接用，如果不能直接用，再去和服务器确认是否变化。只要把这条流程讲清，后面的 Cache-Control、ETag、304 就会自然很多。"
      answerOutline={[
        '先讲浏览器缓存决策流程',
        '再讲强缓存和协商缓存的区别',
        '然后讲常见响应头和请求头',
        '最后总结它们分别在速度和一致性上的作用',
      ]}
      quickAnswer="一句话答法：浏览器缓存的核心流程是：先看本地缓存是否仍可直接使用，如果命中强缓存就直接用本地资源、不发请求；如果不能直接用，就发起协商请求，通过 ETag 或 Last-Modified 等标识询问服务端资源是否变化，如果未变化则返回 304，继续复用本地缓存。强缓存更偏速度，协商缓存更偏一致性控制。"
      pullQuote="强缓存是“直接用”，协商缓存是“问一下再决定用不用”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲流程，再讲字段，会比背 Cache-Control 更稳。',
        '304 不是没有请求，而是请求后不返回实体资源。',
        '顺手讲 ETag 和 Last-Modified 的差异，会更完整。',
      ]}
      mistakes={[
        '只背头字段，不解释浏览器决策顺序。',
        '把强缓存和协商缓存都说成“不请求服务器”。',
        '说不清 304 和强缓存命中的区别。',
      ]}
      singleColumn
    />
  );
}
