import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { scenarioTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scenario', value: 'Slow APIs', detail: '查询慢、重复请求多、并发打满、用户频繁切页和搜索都很常见。' },
  { label: 'Focus', value: 'Control Flow', detail: '核心不是“等接口变快”，而是控制请求的数量、时机、优先级和失败策略。' },
  { label: 'Tools', value: 'Cache / Retry / Queue', detail: '缓存、请求去重、取消、并发限制和降级是最常见的一组手段。' },
] as const;

const definitions = [
  { title: '接口慢和并发多往往一起出现', detail: '因为接口一慢，用户更容易重复触发，前端也更容易叠加未完成请求。' },
  { title: '不是所有请求都值得立刻发出去', detail: '搜索、联想、滚动加载、切页预取这些场景都要控制时机。' },
  { title: '请求治理既要前端做，也要后端配合', detail: '前端负责控制流和体验，后端负责限流、缓存、聚合和性能优化。' },
  { title: '重复请求通常能直接优化掉一大块噪音', detail: '缓存、去重和取消旧请求往往收益很高。' },
  { title: '并发控制是为了保护系统和用户体验', detail: '过高并发不一定更快，反而可能拖垮接口或让前端持续处于忙碌状态。' },
  { title: '失败策略也要设计', detail: '重试、熔断、兜底提示、部分可用和超时控制都很重要。' },
] as const;

const relations = [
  { title: '触发时机', detail: '防抖、节流、条件触发能减少无意义请求。', signal: 'Trigger Control' },
  { title: '请求生命周期', detail: '去重、取消、缓存和重试控制请求在途状态。', signal: 'Request Flow' },
  { title: '并发上限', detail: '队列和限流保护接口与前端主线程。', signal: 'Backpressure' },
  { title: '降级策略', detail: '即使接口慢，也要让页面尽量部分可用。', signal: 'Resilience' },
] as const;

const relationCode = `用户操作
-> 判断是否值得发请求
-> 去重 / 取消旧请求
-> 控并发
-> 缓存结果
-> 超时 / 重试 / 降级`;

const basics = [
  {
    title: '问题 1：接口慢、并发多，第一步怎么想？',
    answer: '先分清是“单个接口本身慢”，还是“同一时刻发了太多无效或重复请求”，这两类问题手段不同。',
    explanation: '这个切分非常重要，不然很容易一股脑把锅都甩给后端。',
    code: `// 搜索场景里，真正的问题可能不是接口慢，
// 而是用户输入 5 个字符就发了 5 次请求。`,
    codeTitle: 'Different Bottlenecks',
  },
  {
    title: '问题 2：搜索联想这类高频场景怎么控请求？',
    answer: '常见做法是防抖、只请求最后一次输入、取消旧请求，并对相同关键词结果做短时间缓存。',
    explanation: '这是一个很典型的组合题，单说防抖不够完整。',
    code: `const controllerRef = useRef<AbortController | null>(null);

async function search(keyword: string) {
  controllerRef.current?.abort();
  const controller = new AbortController();
  controllerRef.current = controller;

  const response = await fetch(\`/api/search?q=\${keyword}\`, {
    signal: controller.signal,
  });

  return response.json();
}`,
    codeTitle: 'Cancel Previous Request',
  },
  {
    title: '问题 3：重复请求怎么做去重？',
    answer: '可以用请求 key 做 in-flight map，相同 key 如果已经在请求中，就复用同一个 Promise，而不是再发一遍。',
    explanation: '这个手段在详情页、配置加载、字典数据里很常见。',
    code: `const inflight = new Map<string, Promise<unknown>>();

function requestOnce<T>(key: string, loader: () => Promise<T>) {
  if (inflight.has(key)) return inflight.get(key) as Promise<T>;

  const promise = loader().finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}`,
    codeTitle: 'In-flight Deduplication',
  },
  {
    title: '问题 4：并发很多时为什么要限流？',
    answer: '因为并发不是越大越好。请求太多可能打爆接口、拖慢浏览器、让失败和重试进一步叠加。',
    explanation: '限流的核心是稳定吞吐，而不是追求瞬时并发量。',
    code: `async function runWithLimit<T>(tasks: Array<() => Promise<T>>, limit: number) {
  const queue = [...tasks];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) await task();
    }
  });

  await Promise.all(workers);
}`,
    codeTitle: 'Concurrency Limit',
  },
] as const;

const practical = [
  {
    title: '问题 5：接口本身真的慢时，前端还能做什么？',
    answer: '可以做骨架屏、分段加载、结果缓存、预取、局部刷新和超时兜底，让用户感知更稳定，不必一直死等整页。',
    explanation: '前端不一定能让接口本身变快，但能大幅改善“等待体验”。',
    code: `const detailQuery = useQuery({
  queryKey: ['order', orderId],
  queryFn: fetchOrderDetail,
  staleTime: 30_000,
  placeholderData: previousData,
});`,
    codeTitle: 'Cache and Placeholder',
  },
  {
    title: '问题 6：重试策略怎么设计更合理？',
    answer: '不是所有错误都重试。网络波动、偶发 5xx 可以有限重试；4xx 参数错误、鉴权失败通常不该盲重试。',
    explanation: '这题的关键是“按错误类型设计策略”。',
    code: `function shouldRetry(error: ApiError) {
  if (error.status >= 500) return true;
  if (error.code === 'NETWORK_TIMEOUT') return true;
  return false;
}`,
    codeTitle: 'Selective Retry',
  },
  {
    title: '问题 7：如果是一个页面需要十几个接口，怎么优化？',
    answer: '先拆关键路径和非关键路径，关键内容优先；能聚合的接口尽量聚合，低优先级模块延后加载或进入视口再请求。',
    explanation: '场景题里把“请求优先级”讲出来会很加分。',
    code: `const summary = useQuery({ queryKey: ['summary'], queryFn: fetchSummary });
const trends = useQuery({
  queryKey: ['trends'],
  queryFn: fetchTrends,
  enabled: summary.isSuccess,
});`,
    codeTitle: 'Prioritize Critical Requests',
  },
  {
    title: '问题 8：面试里怎么总结这个题？',
    answer: '从“减少无效请求、治理在途请求、限制并发、按错误分重试、按优先级加载、和后端一起优化”六层来答。',
    explanation: '这样既体现前端可做的事，也不会显得把所有责任都往前端揽。',
    code: `触发控制 -> 去重/取消 -> 限流 -> 缓存 -> 重试/降级 -> 后端协作`,
    codeTitle: 'Answer Layers',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：区分是单接口慢还是请求过多', detail: '根因不同，方案也不同。' },
  { title: '第二步：清点重复请求和无效触发', detail: '搜索、切页、反复进入页面最常见。' },
  { title: '第三步：对在途请求做取消、去重和并发限制', detail: '控制住请求流量本身。' },
  { title: '第四步：补上缓存、降级和后端协作', detail: '把体验和系统稳定性一起兜住。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：接口慢就只说让后端优化', detail: '前端也能减少无效请求和改善等待体验。', points: ['防抖', '取消', '缓存', '优先级'] },
  { title: '高频误区 2：所有失败都盲目重试', detail: '这样很容易把问题越放越大。', points: ['按错误类型', '限制次数', '指数退避'] },
  { title: '高频误区 3：一个页面十几个接口全同时打', detail: '没有优先级意识时，关键路径和非关键路径都会被拖慢。', points: ['关键路径优先', '延后非关键', '聚合接口'] },
  { title: '高频误区 4：不处理旧请求结果覆盖新请求', detail: '这会造成搜索结果闪烁或数据倒灌。', points: ['取消旧请求', '只接受最新响应', '维护 request id'] },
] as const;

const rules = [
  { title: '先控触发，再控在途，再控重试', detail: '这是最稳的请求治理顺序。' },
  { title: '相同请求优先去重', detail: '很多场景不需要重新发一遍。' },
  { title: '关键路径优先加载', detail: '先保证用户能开始用，而不是一次把所有数据都拉齐。' },
  { title: '前后端一起优化', detail: '前端控流，后端提速和聚合，效果最好。' },
] as const;

export default function ApiConcurrencyScenarioPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Scenario / API"
      title="接口慢、并发多怎么处理"
      lead="这类题真正考的是请求治理能力。你要能区分接口本身慢，还是前端把请求发得太乱太多；还要知道什么时候该去重、取消、限流、重试、降级，以及什么时候需要后端一起改接口策略。"
      heroCards={heroCards}
      definitionsTitle="块 1：场景定义（先把慢和多这两个问题分开）"
      definitionsNote="用意：先明确请求治理到底在管什么。"
      definitions={definitions}
      relationsTitle="块 2：请求治理主线速览"
      relationsNote="用意：把触发、在途、限流和降级串起来。"
      relations={relations}
      relationCodeTitle="Request Control Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础治理问题', note: '用意：先把去重、取消和限流讲稳。', label: 'Flow Control', questions: basics },
        { title: '块 4：实战优化问题', note: '用意：再把重试、优先级和后端协作补全。', label: 'Resilience', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：面试和真实治理都能按这条线展开。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把接口治理题答得太单薄。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆请求治理的主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={scenarioTheme}
    />
  );
}
