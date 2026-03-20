import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '依赖安装、锁文件、workspace、磁盘占用和团队协作。' },
  { label: 'Core', value: 'Install + Lock', detail: '包管理题最稳的主线是“怎么装”和“怎么保证大家装出来一样”。' },
  { label: 'Scenes', value: 'Monorepo / CI', detail: '多人协作、缓存和 workspace 场景最容易拉开差异。' },
] as const;

const definitions = [
  { title: 'npm、yarn、pnpm 都在解决依赖安装和版本锁定问题', detail: '差异主要在安装策略、缓存方式、workspace 能力和历史生态。' },
  { title: '锁文件是团队协作关键', detail: '它保证大家安装出来的依赖树尽量一致。' },
  { title: 'pnpm 的重要特点是高效复用包内容', detail: '它通过内容寻址存储和链接方式，减少磁盘重复占用。' },
  { title: 'yarn 历史版本差异很大', detail: '很多题里说 yarn，最好顺手区分 classic 和 berry。' },
  { title: 'workspace 适合多包仓库统一管理', detail: '多个应用和包共享依赖、脚本和版本协调时特别常见。' },
  { title: '包管理不是只有安装速度', detail: '可重复安装、团队一致性和 CI 稳定性同样重要。' },
] as const;

const relations = [
  { title: '安装', detail: '把 `package.json` 里的依赖解析并落到本地。', signal: 'Resolve + Fetch' },
  { title: '锁定', detail: '用 lockfile 固化解析结果。', signal: 'Deterministic' },
  { title: '链接', detail: '不同工具对 node_modules 布局和链接策略不同。', signal: 'Link Strategy' },
  { title: '协作', detail: '多人和 CI 是否稳定，和锁文件、缓存策略高度相关。', signal: 'Team Stability' },
] as const;

const relationCode = `package.json
-> resolve versions
-> fetch packages
-> write lockfile
-> link node_modules/workspace
-> CI and teammates install consistently`;

const basics = [
  {
    title: '问题 1：npm、yarn、pnpm 一句话怎么区分？',
    answer: '都能装依赖，但 pnpm 更强调磁盘复用和 workspace 体验，yarn / npm 更常见于历史项目和默认生态。',
    explanation: '回答时不必极端站队，重点说出它们关注点不同。',
    code: `npm install
yarn install
pnpm install`,
    codeTitle: 'Package Install Commands',
  },
  {
    title: '问题 2：为什么 lockfile 很重要？',
    answer: '因为光有版本范围还不够，锁文件能把解析结果固定下来，减少“我这边能跑、你那边不行”的概率。',
    explanation: '团队协作题里，这个点必须讲。',
    code: `package.json -> "^1.2.0"
lockfile -> "1.2.7"`,
    codeTitle: 'Version Range vs Locked Version',
  },
  {
    title: '问题 3：pnpm 为什么常被说更省空间？',
    answer: '因为它把包内容放到全局内容仓库里复用，再通过链接方式映射到项目，不必每个项目都拷一份完整副本。',
    explanation: '关键词是“内容复用”和“链接”，不是单纯下载更快。',
    code: `store/
  react@18...
project-a/node_modules -> link
project-b/node_modules -> link`,
    codeTitle: 'pnpm Store Idea',
  },
  {
    title: '问题 4：为什么有的项目坚持只用一种包管理器？',
    answer: '因为混用容易导致锁文件冲突、依赖树差异和 CI 行为不一致。',
    explanation: '工程题里最好直接提“不要混用”。',
    code: `package-lock.json
yarn.lock
pnpm-lock.yaml`,
    codeTitle: 'Multiple Lockfiles Problem',
  },
] as const;

const practical = [
  {
    title: '问题 5：monorepo 为什么经常搭配 pnpm 或 yarn workspace？',
    answer: '因为多包仓库更需要统一安装、共享依赖和跨包脚本，workspace 能明显降低管理成本。',
    explanation: '这题的关键是“多包协作”，不是单个项目安装速度。',
    code: `packages/
  ui
  app-web
  app-admin`,
    codeTitle: 'Workspace Structure',
  },
  {
    title: '问题 6：CI 里为什么要强调 `frozen-lockfile` 之类的模式？',
    answer: '因为 CI 应该复现已确认过的依赖树，而不是在流水线里临时解析出一套新结果。',
    explanation: '这样可以降低环境漂移和偶发失败。',
    code: `pnpm install --frozen-lockfile
yarn install --frozen-lockfile
npm ci`,
    codeTitle: 'Deterministic CI Install',
  },
  {
    title: '问题 7：npm、yarn、pnpm 该怎么选？',
    answer: '小型单包项目默认 npm 也没问题；如果是 monorepo 或者更看磁盘效率和严格依赖边界，pnpm 往往更有吸引力。',
    explanation: '选型题要把项目规模和组织方式带进来。',
    code: `if (repo.isMonorepo) choose('pnpm');
else choose('npm or yarn based on team');`,
    codeTitle: 'Selection Framing',
  },
  {
    title: '问题 8：这类题最后怎么答得更完整？',
    answer: '用“安装策略、锁文件一致性、workspace 支持、CI 稳定性”四个维度收尾。',
    explanation: '这样就不会把包管理题答成命令背诵题。',
    code: `安装
锁定
链接
协作
CI`,
    codeTitle: 'Answer Dimensions',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先看是否混用了多个包管理器', detail: '锁文件并存往往就是问题源头。' },
  { title: '第二步：再看 lockfile 是否被正确提交', detail: '很多环境不一致都从这里开始。' },
  { title: '第三步：Monorepo 再看 workspace 和链接策略', detail: '跨包依赖问题经常出在这里。' },
  { title: '第四步：CI 用冻结安装模式校验', detail: '这样才能尽量复现本地确认过的依赖树。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把包管理器差异只理解成命令不同', detail: '真正重要的是依赖树、锁文件和协作稳定性。', points: ['安装', '锁定', '链接', '协作'] },
  { title: '高频误区 2：项目里混用多个包管理器', detail: '这会把依赖解析和锁文件行为变得不可预测。', points: ['只保留一种', '统一命令', '统一 CI'] },
  { title: '高频误区 3：忽略 CI 的确定性安装', detail: '本地能装出来，不代表流水线不会漂。', points: ['frozen install', '锁文件校验', '环境一致'] },
  { title: '高频误区 4：只看安装快不快', detail: '多人协作时，稳定比一时快更重要。', points: ['一致性', '可复现', '团队效率'] },
] as const;

const rules = [
  { title: '包管理题先讲 lockfile', detail: '这是团队协作里最核心的一层。' },
  { title: 'Monorepo 再讲 workspace', detail: '这样回答更贴真实工程。' },
  { title: 'pnpm 的亮点是复用和边界更清晰', detail: '这比只说“更快”更准确。' },
  { title: 'CI 要求可重复安装', detail: '尽量避免在流水线里临时解析新依赖树。' },
] as const;

export default function PackageManagerSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / Package Manager"
      title="包管理：npm、yarn、pnpm"
      lead="包管理题表面上像在比较命令，实际上更关乎团队协作。大家能不能装出同一棵依赖树、CI 会不会漂、monorepo 管起来麻不麻烦，这些才是核心。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把包管理器在做什么说清）"
      definitionsNote="用意：先明确安装、锁定和链接这几层职责。"
      definitions={definitions}
      relationsTitle="块 2：包管理主线速览"
      relationsNote="用意：把依赖从声明到落地的流程捋清。"
      relations={relations}
      relationCodeTitle="Dependency Lifecycle"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 lockfile、pnpm 和混用风险答稳。', label: 'Package Basics', questions: basics },
        { title: '块 4：工程实践问题', note: '用意：再把 workspace、CI 和选型放到实际协作里。', label: 'Team Workflow', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到依赖安装问题时按协作链路排查。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把依赖管理里最常见的误解提前拆开。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆包管理题的主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={engineeringTheme}
    />
  );
}
