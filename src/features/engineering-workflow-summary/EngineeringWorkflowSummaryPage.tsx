import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { engineeringTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '提交规范、自动检查、测试分层、发布流程和团队协作。' },
  { label: 'Core', value: 'Quality Gate', detail: '工程质量题最好围绕“风险在什么时候被挡住”来讲。' },
  { label: 'Scenes', value: 'PR / Release', detail: '本地开发、提交前、CI、发布前后是最常见的切入点。' },
] as const;

const definitions = [
  { title: 'CI 是持续集成', detail: '代码一提交或提 PR，就自动跑检查和验证，尽早暴露问题。' },
  { title: 'CD 常见有两种语义', detail: '有时指持续交付，有时指持续部署，区别在于上线最后一步是否自动化。' },
  { title: 'lint 主要负责统一代码质量底线', detail: '它不替代测试，但能尽早拦住低级错误和风格分歧。' },
  { title: '测试要分层看', detail: '单元测试、集成测试、端到端测试关注的问题不同。' },
  { title: '代码规范不仅是格式问题', detail: '命名、目录约定、提交规范、评审规则都属于工程协作规范。' },
  { title: '工程流程的目标是把问题前移', detail: '越早发现，修复成本通常越低。' },
] as const;

const relations = [
  { title: '本地开发', detail: '先靠类型检查、lint、单测尽早挡问题。', signal: 'Fast Feedback' },
  { title: '提交 / PR', detail: '通过自动化校验统一团队底线。', signal: 'Quality Gate' },
  { title: 'CI', detail: '在干净环境里复验依赖、构建和测试。', signal: 'Clean Pipeline' },
  { title: 'CD / 发布', detail: '把构建产物安全、可回滚地送到目标环境。', signal: 'Delivery' },
] as const;

const relationCode = `本地修改
-> pre-commit / lint / test
-> push / PR
-> CI 跑构建与测试
-> merge
-> deploy / release
-> monitor and rollback if needed`;

const basics = [
  {
    title: '问题 1：CI/CD 最稳的答法是什么？',
    answer: 'CI 负责持续验证代码质量，CD 负责让产物更稳定地走向可交付或可部署状态。',
    explanation: '别只背缩写，最好把目标说出来。',
    code: `push -> lint -> test -> build -> deploy`,
    codeTitle: 'Pipeline Overview',
  },
  {
    title: '问题 2：为什么光靠代码评审不够？',
    answer: '因为评审擅长发现设计和逻辑问题，但不适合代替所有机械检查，比如类型、格式、低级 API 误用。',
    explanation: '这题的关键是“人审”和“机审”分工。',
    code: `人工评审 -> 设计 / 边界 / 可读性
自动检查 -> lint / typecheck / test`,
    codeTitle: 'Human vs Automation',
  },
  {
    title: '问题 3：lint 的价值是什么？',
    answer: '统一代码质量底线、减少无意义风格争论、拦住一部分明显错误，让评审更聚焦真正重要的问题。',
    explanation: '回答时最好强调“把人从重复劳动里解放出来”。',
    code: `{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}`,
    codeTitle: 'Lint Scripts',
  },
  {
    title: '问题 4：测试为什么要分层？',
    answer: '因为不同测试成本和价值不同。单测快、集成测试更贴流程、E2E 最接近用户但更重。',
    explanation: '测试题最怕答成“全都写很多测试”。',
    code: `单元测试 -> 函数 / hook
集成测试 -> 组件协作 / 页面流程
E2E -> 用户路径`,
    codeTitle: 'Test Layers',
  },
] as const;

const practical = [
  {
    title: '问题 5：提交规范为什么也算工程化？',
    answer: '因为它会影响日志可读性、版本发布自动化、回溯定位效率和团队协作一致性。',
    explanation: '工程规范不是“形式主义”，它常常直接影响维护成本。',
    code: `feat: add engineering summary pages
fix: avoid duplicate request in cache demo`,
    codeTitle: 'Commit Convention',
  },
  {
    title: '问题 6：为什么 CI 一定要在干净环境里跑？',
    answer: '因为它的意义就是验证“换一台机器、从零开始”也能稳定构建和测试通过。',
    explanation: '这正是它能兜住“我本地没问题”的原因。',
    code: `steps:
  - install
  - lint
  - test
  - build`,
    codeTitle: 'Clean CI Steps',
  },
  {
    title: '问题 7：发布流程里除了 deploy 还应该关注什么？',
    answer: '版本标记、环境配置、灰度发布、监控告警和回滚策略都很重要。',
    explanation: '真正的 CD 不只是“能发上去”，而是“出问题能稳住”。',
    code: `build -> upload artifact -> deploy canary -> monitor -> full rollout`,
    codeTitle: 'Safe Delivery',
  },
  {
    title: '问题 8：工程质量体系最后怎么讲得像实战？',
    answer: '用“本地快速反馈、提交自动校验、CI 干净复验、发布可回滚”这四层收尾。',
    explanation: '这样能把分散的工具串成完整流程。',
    code: `本地 -> pre-check
PR -> review + checks
CI -> clean validation
发布 -> monitor + rollback`,
    codeTitle: 'Quality Workflow',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先确定问题应该在哪一层被挡住', detail: '是本地、PR、CI，还是发布后监控？' },
  { title: '第二步：区分人审和机审边界', detail: '别把自动化能做的全甩给评审。' },
  { title: '第三步：测试分层，不要一把梭', detail: '不同风险用不同测试手段兜。' },
  { title: '第四步：发布链路一定考虑回滚', detail: '没有回滚方案的上线流程不算稳。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 lint 当成测试替代品', detail: 'lint 只能抓一部分静态问题，业务行为还是要靠测试验证。', points: ['lint 不测逻辑', '测试不管格式', '两者互补'] },
  { title: '高频误区 2：CI 只跑 build 不跑质量检查', detail: '这样会把很多明显问题放进主干。', points: ['typecheck', 'lint', 'test', 'build'] },
  { title: '高频误区 3：测试只追求数量', detail: '测试要对准高风险链路，而不是盲目堆案例。', points: ['高风险优先', '核心链路优先', '反馈速度也要考虑'] },
  { title: '高频误区 4：发布流程没监控和回滚', detail: '这会让上线变成一次性赌博。', points: ['监控', '灰度', '回滚'] },
] as const;

const rules = [
  { title: '工程质量核心是问题前移', detail: '越早暴露，修复越便宜。' },
  { title: '人审看设计，机审看底线', detail: '两者分工清楚，效率更高。' },
  { title: '测试要分层', detail: '不同层级覆盖不同风险。' },
  { title: '发布必须可回滚', detail: '稳定上线不是把产物传上去就结束。' },
] as const;

export default function EngineeringWorkflowSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Engineering / Workflow"
      title="CI/CD、代码规范、lint、测试"
      lead="这类题真正考的不是你背了多少工具名字，而是你能不能把工程质量链路讲完整。问题该在哪一层被挡住，什么时候靠自动化，什么时候靠评审，什么时候要监控和回滚，这些才是重点。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把质量链路上的角色分清）"
      definitionsNote="用意：先明确 CI、CD、lint、测试各自在做什么。"
      definitions={definitions}
      relationsTitle="块 2：工程质量主线速览"
      relationsNote="用意：把本地、PR、CI、发布串成一条链。"
      relations={relations}
      relationCodeTitle="Workflow Pipeline"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 CI/CD、lint、测试分层答稳。', label: 'Quality Basics', questions: basics },
        { title: '块 4：工程实践问题', note: '用意：再把提交规范、发布和回滚落到真实流程。', label: 'Release Workflow', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到工程流程题时按风险挡板来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：提前拆掉最常见的流程误解。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆工程质量的稳态主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={engineeringTheme}
    />
  );
}
