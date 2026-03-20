import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '开发体验、构建方式、插件生态、生产打包和迁移成本。' },
  { label: 'Core', value: 'Dev vs Build', detail: '这类题最容易讲散，稳定答法是把开发时和构建时分开。' },
  { label: 'Scenes', value: '新项目 / 老项目', detail: '新项目更看速度，老项目更看兼容性和历史包袱。' },
] as const;

const definitions = [
  { title: 'Vite 开发时更像按需提供源码', detail: '浏览器直接吃 ESM，请求哪个模块就处理哪个模块，不急着先把整包都打完。' },
  { title: 'Webpack 更像先把依赖图打包好再交给浏览器', detail: '它非常擅长把各种资源统一编译成浏览器可运行的产物。' },
  { title: 'Vite 生产环境通常还是要打包', detail: '很多人会误解成 Vite 完全不打包，实际上生产阶段通常还是走 Rollup 能力。' },
  { title: 'Webpack 的核心优势是成熟生态和可定制度', detail: '很多复杂老系统、微前端、定制 loader 都有现成经验。' },
  { title: 'Vite 的核心优势是冷启动和热更新体验', detail: '项目越大，这个体感差异通常越明显。' },
  { title: '两者都不是非黑即白', detail: '选型要看项目阶段、团队经验和现有插件依赖。' },
] as const;

const relations = [
  { title: '开发阶段', detail: 'Vite 倾向按需编译，Webpack 更偏整体构建。', signal: 'Dev Server Model' },
  { title: '生产阶段', detail: '两者最终都要产出优化后的静态资源。', signal: 'Optimized Bundle' },
  { title: '插件生态', detail: 'Webpack 历史更长，Vite 对现代前端框架更轻快。', signal: 'Ecosystem' },
  { title: '迁移成本', detail: '老项目切换工具经常不只是改命令，而是要重看插件、别名、资源处理。', signal: 'Migration' },
] as const;

const relationCode = `开发期
-> Vite: 浏览器请求到哪个模块，就转换哪个模块
-> Webpack: 先根据依赖图构建 bundle

生产期
-> 两者都要做压缩、拆包、产物优化`;

const basics = [
  {
    title: '问题 1：一句话怎么区分 Vite 和 Webpack？',
    answer: '最稳的答法是：Vite 更强调现代 ESM 开发体验，Webpack 更强调成熟全面的打包体系。',
    explanation: '别只说“Vite 更快”。面试官通常想听你是否知道它们快在什么阶段、强在哪种场景。',
    code: `// Vite dev
import { createApp } from './main.ts';

// Webpack 也能处理这段代码，
// 但开发服务器背后的处理模型不同。`,
    codeTitle: 'Same Source, Different Tooling Model',
  },
  {
    title: '问题 2：为什么大家会觉得 Vite 开发更快？',
    answer: '因为它开发时不急着先把整个应用都打成 bundle，而是按需转换模块，热更新影响范围也更小。',
    explanation: '回答时把“冷启动快”和“热更新快”分开，会更完整。',
    code: `// 修改这个文件时
export function Button() {
  return <button>Save</button>;
}

// Vite 倾向只失效相关模块，而不是整包重算。`,
    codeTitle: 'Smaller Invalidation Scope',
  },
  {
    title: '问题 3：Webpack 慢是不是就意味着它落后了？',
    answer: '不是。Webpack 仍然非常强，尤其在复杂 loader 链、老项目兼容、深度定制构建流程时很稳。',
    explanation: '工程题的重点不是“谁先进”，而是“谁更适合当前约束”。',
    code: `module.exports = {
  module: {
    rules: [
      { test: /\\.md$/, use: ['html-loader', './custom-markdown-loader.js'] },
    ],
  },
};`,
    codeTitle: 'Custom Loader Chain',
  },
  {
    title: '问题 4：Vite 生产环境是不是完全不需要关心打包优化？',
    answer: '不是。生产环境照样要关心代码分割、chunk 策略、依赖体积、资源压缩和缓存命名。',
    explanation: '开发快不代表上线产物天然最优，工程优化始终存在。',
    code: `export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});`,
    codeTitle: 'Vite Build Optimization',
  },
] as const;

const practical = [
  {
    title: '问题 5：新项目选 Vite，一般怎么解释？',
    answer: '如果是现代框架项目、构建链不复杂、团队更想要更快反馈，Vite 往往是更省心的默认选择。',
    explanation: '这个回答兼顾了体验和边界，不会显得只是在追新。',
    code: `// 新项目常见诉求
// 1. 启动快
// 2. HMR 快
// 3. 配置少
// 4. 主流框架支持好`,
    codeTitle: 'Greenfield Project Checklist',
  },
  {
    title: '问题 6：老项目为什么常常继续留在 Webpack？',
    answer: '因为它背后往往有大量历史 loader、插件、自定义构建约定和组织协作成本，迁移不是零成本。',
    explanation: '老项目工程题最怕回答成“直接切过去就好了”。',
    code: `// 常见迁移阻力
// 自定义 loader
// require.context
// 特殊 alias
// 老旧插件
// CI 产物链路依赖`,
    codeTitle: 'Migration Cost Signals',
  },
  {
    title: '问题 7：什么时候你会更主动提 Webpack？',
    answer: '当项目构建体系高度定制、生态插件依赖重、或者团队对 Webpack 运维经验更成熟时。',
    explanation: '工程选型不是做榜单，是做风险控制。',
    code: `if (project.hasHeavyLegacyLoaders || team.isWebpackCentric) {
  choose('webpack');
} else {
  choose('vite');
}`,
    codeTitle: 'Tradeoff Framing',
  },
  {
    title: '问题 8：这一题最后怎么答得像实战？',
    answer: '按“开发体验、生产构建、生态兼容、迁移成本”四个维度收尾，而不是只重复快和慢。',
    explanation: '这样你的回答会从工具印象题升级成工程判断题。',
    code: `开发体验 -> 冷启动 / HMR
生产构建 -> 拆包 / 压缩 / 缓存
生态兼容 -> 插件 / loader / 资源处理
迁移成本 -> 历史包袱 / 团队经验`,
    codeTitle: 'Answer Structure',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先分开发时和生产时', detail: '大多数回答混乱，都是因为把这两个阶段揉在一起。' },
  { title: '第二步：再看项目是新项目还是老项目', detail: '这会直接影响你对迁移和兼容成本的判断。' },
  { title: '第三步：最后补插件和团队经验', detail: '工具选型从来不只是技术参数，还包括组织成本。' },
  { title: '第四步：收尾时补上线优化', detail: '别让回答停留在本地启动速度。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 Vite 理解成“完全不打包”', detail: '开发期和生产期的行为不同，生产环境通常还是要打包优化。', points: ['开发期按需处理', '生产期仍要产物优化', '别把 dev server 和 build 混掉'] },
  { title: '高频误区 2：把 Webpack 讲成“过时工具”', detail: '它在复杂工程体系里仍然很强，尤其是历史资产多的时候。', points: ['成熟生态', '深度定制', '老项目稳定性'] },
  { title: '高频误区 3：选型只看启动速度', detail: '插件兼容、迁移成本、团队熟悉度同样是工程约束。', points: ['体验', '兼容', '成本'] },
  { title: '高频误区 4：答题只会背概念，不会落场景', detail: '新项目和存量项目的结论很可能不同。', points: ['看项目阶段', '看包袱', '看团队'] },
] as const;

const rules = [
  { title: '先分开发时，再分生产时', detail: '这是回答 Vite / Webpack 最稳的主线。' },
  { title: '新项目更看体验，老项目更看兼容', detail: '这句通常能把选型题拉回工程现实。' },
  { title: '不要把快慢题答成站队题', detail: '工程判断比工具崇拜重要。' },
  { title: '结尾一定补产物优化', detail: '这样回答才像真做过上线。' },
] as const;

export default function ViteWebpackSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / Bundler"
      title="Vite 和 Webpack 区别"
      lead="这页的重点不是做工具站队，而是把两者放回真实工程里理解。开发时谁反馈更快、生产时谁更好控、老项目和新项目分别怎么选，这些才是面试里更有价值的部分。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把两者定位分清）"
      definitionsNote="用意：先明确它们分别强在什么阶段、什么问题。"
      definitions={definitions}
      relationsTitle="块 2：两条主线速览"
      relationsNote="用意：把开发期和生产期拆开看。"
      relations={relations}
      relationCodeTitle="Dev vs Build"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把两者的核心差异答稳。', label: 'Bundler Basics', questions: basics },
        { title: '块 4：工程选型问题', note: '用意：把选型放回新项目、老项目和迁移成本。', label: 'Engineering Tradeoff', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到工具选型题时按这条主线说，不容易散。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把最容易答偏的点提前拆开。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆稳定答法。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的角度。"
      themeStyle={engineeringTheme}
    />
  );
}
