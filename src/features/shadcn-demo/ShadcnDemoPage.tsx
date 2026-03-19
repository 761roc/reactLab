import { useMemo, useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  Input,
  Progress,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea
} from './ui/primitives';
import styles from './ShadcnDemoPage.module.css';

const deploymentStats = [
  { label: 'registry blocks', value: '28', note: '按钮、输入、卡片、标签、表格、反馈条全部可复用。' },
  { label: 'preview branches', value: '12', note: '通过一致的 variant 规则维护视觉统一。' },
  { label: 'handoff confidence', value: '94%', note: '页面节奏接近真实 SaaS dashboard，而不是单个组件堆砌。' }
] as const;

const signalCards = [
  {
    title: 'Launch Readiness',
    description: '对齐 marketing、docs、ops 三条泳道的最终验收状态。',
    badge: 'Review',
    progress: 82
  },
  {
    title: 'Design Token Diff',
    description: '检查 border radius、surface 和 muted token 的变化影响。',
    badge: 'Stable',
    progress: 64
  },
  {
    title: 'Command Queue',
    description: '把 dialog、alert、table、empty state 按一页串联起来。',
    badge: 'Busy',
    progress: 73
  },
  {
    title: 'Review Coverage',
    description: '覆盖 hero、filters、kanban、activity、compose 五个层次。',
    badge: 'Tracked',
    progress: 91
  }
] as const;

const releaseRows = [
  {
    name: 'Starter dashboard pack',
    owner: 'UI System',
    status: 'Ready',
    velocity: '12 sections',
    note: '含统计卡、命令条、hero banner、dense table。',
    progress: 94
  },
  {
    name: 'Marketing analytics board',
    owner: 'Growth',
    status: 'In QA',
    velocity: '9 sections',
    note: '演示 chart 区块的前后信息架构和表单入口。',
    progress: 72
  },
  {
    name: 'Ops control surface',
    owner: 'Operations',
    status: 'Draft',
    velocity: '7 sections',
    note: '偏向 alert、approval flow 和 log list。',
    progress: 48
  }
] as const;

const teamMembers = [
  { initials: 'AL', colorClassName: 'bg-sky-700' },
  { initials: 'MQ', colorClassName: 'bg-amber-600' },
  { initials: 'JT', colorClassName: 'bg-emerald-700' },
  { initials: 'PX', colorClassName: 'bg-fuchsia-700' }
] as const;

const atlasItems = [
  { title: 'Button', text: '用 variant + size 处理主次操作、工具按钮与危险操作。' },
  { title: 'Badge', text: '把状态、来源、风险等级压缩成低成本可扫描标签。' },
  { title: 'Card', text: '所有内容块都遵循 header/content/footer 的拼装方式。' },
  { title: 'Tabs', text: '在同一数据空间里切换不同视图，不需要路由跳转。' },
  { title: 'Input / Textarea', text: '用于配置面板、命名流程与生成描述信息。' },
  { title: 'Checkbox / Switch', text: '展示 feature flag、发布勾选与自动化开关。' }
] as const;

export default function ShadcnDemoPage() {
  const [activeView, setActiveView] = useState('overview');
  const [stackPreset, setStackPreset] = useState('saas');
  const [projectName, setProjectName] = useState('Shadcn Launch Deck');
  const [summary, setSummary] = useState(
    'Build a dense showcase page that feels like a real product workspace: metrics, command tools, review states, forms and a long data region.'
  );
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [enableDigest, setEnableDigest] = useState(true);
  const [publishDocs, setPublishDocs] = useState(true);
  const [notifyReviewers, setNotifyReviewers] = useState(false);
  const [pinCommandBar, setPinCommandBar] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const completionScore = useMemo(() => {
    const switches = [isLiveMode, enableDigest, publishDocs, notifyReviewers, pinCommandBar];
    const enabledCount = switches.filter(Boolean).length;
    return 56 + enabledCount * 8;
  }, [enableDigest, isLiveMode, notifyReviewers, pinCommandBar, publishDocs]);

  const activePresetMeta = useMemo(() => {
    switch (stackPreset) {
      case 'marketing':
        return '更强调 hero、CTA、social proof 和 section rhythm。';
      case 'ops':
        return '更强调状态密度、审批流、表格和日志区。';
      default:
        return '默认 SaaS 视角，平衡信息密度与可扫描性。';
    }
  }, [stackPreset]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div className={styles.eyebrowRow}>
          <Badge variant="accent">shadcn/ui</Badge>
          <Badge variant="outline">Registry-style composition</Badge>
          <Badge variant="success">2+ screens</Badge>
        </div>
        <h2>shadcn/ui 复杂页面演示工作台</h2>
        <p>
          这个 feature 不只是罗列单个按钮，而是按 shadcn/ui 常见的拼装方式，把按钮、标签、卡片、输入框、表格、切换器、
          tabs、dialog 和反馈条组合成一个真实的多屏工作台页面。目标是让你能逐块观察组件如何在长页中协同，而不是只看孤立样式。
        </p>
        <div className={styles.headerActions}>
          <Button variant="outline">Open Registry Notes</Button>
          <Button variant="secondary">Duplicate Workspace</Button>
          <Button onClick={() => setShowDialog(true)}>Launch Review Dialog</Button>
        </div>
        <div className={styles.chipRow}>
          <Badge>dashboard</Badge>
          <Badge variant="warning">dense data</Badge>
          <Badge variant="accent">feature-scoped ui</Badge>
          <Badge variant="outline">tailwind-based</Badge>
        </div>
      </header>

      <SectionCard
        note="用意：演示 shadcn/ui 常见的 hero、统计卡、avatar、badge、button、progress 在一个首屏里的协同关系。"
        title="块 1：页面骨架（Hero / KPI / 行动栏）"
      >
        <div className={styles.heroLayout}>
          <div className={styles.heroStack}>
            <Card>
              <CardHeader>
                <div className={styles.rowBetween}>
                  <div>
                    <Badge variant="accent">Workspace Status</Badge>
                    <CardTitle className="mt-3 text-3xl tracking-[-0.05em]">Registry preview orchestration</CardTitle>
                    <CardDescription className="mt-3 max-w-[60ch]">
                      用 shadcn 风格组件搭一个“正在上线中的设计系统工作台”，让视觉密度、命令动作和数据反馈都落到真实页面语境里。
                    </CardDescription>
                  </div>
                  <div className={styles.avatarRow}>
                    {teamMembers.map((member) => (
                      <Avatar
                        className="h-11 w-11"
                        colorClassName={member.colorClassName}
                        initials={member.initials}
                        key={member.initials}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className={styles.signalGrid}>
                {signalCards.map((card) => (
                  <div className={styles.signalItem} key={card.title}>
                    <div className={styles.rowBetween}>
                      <strong>{card.title}</strong>
                      <Badge variant={card.badge === 'Stable' ? 'success' : card.badge === 'Busy' ? 'warning' : 'outline'}>
                        {card.badge}
                      </Badge>
                    </div>
                    <p>{card.description}</p>
                    <Progress className="mt-3" value={card.progress} />
                  </div>
                ))}
              </CardContent>
              <CardFooter className={styles.rowStart}>
                <Button>Promote Preview</Button>
                <Button variant="secondary">Sync Tokens</Button>
                <Button variant="ghost">Open Audit Trail</Button>
              </CardFooter>
            </Card>

            <div className={styles.statsGrid}>
              {deploymentStats.map((stat) => (
                <article className={styles.statCard} key={stat.label}>
                  <span className={styles.subtleTitle}>{stat.label}</span>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statNote}>{stat.note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.metricStack}>
            <Card className={styles.metricCard}>
              <CardHeader>
                <div className={styles.metricHeader}>
                  <div>
                    <CardTitle>Release readiness score</CardTitle>
                    <CardDescription>根据当前启用的自动化和发布范围动态计算。</CardDescription>
                  </div>
                  <Badge variant="success">{completionScore}%</Badge>
                </div>
              </CardHeader>
              <CardContent className={styles.signalList}>
                <Progress value={completionScore} />
                <div className={styles.heroBadgeRow}>
                  <Badge variant="outline">stable surface</Badge>
                  <Badge variant="accent">typed layout</Badge>
                  <Badge variant="warning">review required</Badge>
                </div>
                <Separator />
                <div className={styles.teamList}>
                  <div className={styles.teamItem}>
                    <strong>Why this feels like shadcn/ui</strong>
                    <p>低饱和 surface、明确的边框体系、卡片式布局和 typography hierarchy 都遵循常见 shadcn 语感。</p>
                  </div>
                  <div className={styles.teamItem}>
                    <strong>Why this is useful for the lab</strong>
                    <p>你可以在一个 feature 页面里同时观察组件粒度与页面级排版，而不用切来切去。</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Primary action strip</CardTitle>
                <CardDescription>主按钮、次按钮、outline 和 ghost 全部放在一处对比。</CardDescription>
              </CardHeader>
              <CardContent className={styles.miniGrid}>
                <div className={styles.rowStart}>
                  <Button size="lg">Publish Registry</Button>
                  <Button size="lg" variant="secondary">
                    Save Draft
                  </Button>
                </div>
                <div className={styles.rowStart}>
                  <Button variant="outline">Preview Docs</Button>
                  <Button variant="ghost">Mute Alerts</Button>
                  <Button variant="destructive">Rollback</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：演示 tabs 作为页面内分视图容器，保持数据上下文不丢，同时展示卡片、列表、badge、button 的组合。"
        title="块 2：视图切换（Tabs / Card / Inline Status）"
      >
        <Tabs className="mt-2" defaultValue="overview" onValueChange={setActiveView} value={activeView}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className={styles.signalGrid}>
              <div className={styles.pipelineItem}>
                <div className={styles.rowBetween}>
                  <strong>Current surface</strong>
                  <span className={styles.inlineStatus}>
                    <span className={styles.dot} />
                    stable
                  </span>
                </div>
                <p>当前页采用长页 dashboard 结构，重点演示“组件注册感”而不是营销站风格。</p>
              </div>
              <div className={styles.pipelineItem}>
                <strong>Variant discipline</strong>
                <p>主次按钮、状态 badge、切换器和表单输入全部共用一套边框与圆角节奏。</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline">
            <div className={styles.pipelineList}>
              {releaseRows.map((row) => (
                <Card key={row.name}>
                  <CardHeader>
                    <div className={styles.rowBetween}>
                      <div>
                        <CardTitle>{row.name}</CardTitle>
                        <CardDescription>{row.note}</CardDescription>
                      </div>
                      <Badge variant={row.status === 'Ready' ? 'success' : row.status === 'In QA' ? 'warning' : 'outline'}>
                        {row.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className={styles.signalList}>
                    <div className={styles.rowBetween}>
                      <span className={styles.mutedText}>Owner: {row.owner}</span>
                      <span className={styles.mutedText}>{row.velocity}</span>
                    </div>
                    <Progress value={row.progress} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className={styles.detailsList}>
              <div className={styles.detailPanel}>
                <strong>09:12 AM · Token sync finished</strong>
                <p>所有表面层 `radius` 和 `muted` 变量已经应用到 hero、panel、dialog。</p>
              </div>
              <div className={styles.detailPanel}>
                <strong>09:46 AM · Review request sent</strong>
                <p>邀请 4 位 reviewer 审查对话框层级、按钮优先级与表格密度。</p>
              </div>
              <div className={styles.detailPanel}>
                <strong>10:21 AM · Audit opened</strong>
                <p>对比 `marketing` 和 `ops` 两种预设下的内容架构差异，避免一个 layout 吃所有场景。</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SectionCard>

      <SectionCard
        note="用意：演示 input、textarea、switch、checkbox、select 风格控件在一个真实配置面板中的排布，不是单独样式展览。"
        title="块 3：配置面板（Form / Switch / Checkbox / Select）"
      >
        <div className={styles.composeGrid}>
          <Card>
            <CardHeader>
              <CardTitle>Compose release brief</CardTitle>
              <CardDescription>模拟 shadcn/ui 页面里常见的右侧配置面板写法。</CardDescription>
            </CardHeader>
            <CardContent className={styles.filterStack}>
              <Field hint="控制 hero 和主数据区的标题命名。" label="Project title">
                <Input onChange={(event) => setProjectName(event.target.value)} value={projectName} />
              </Field>
              <Field hint="不同预设会改变页面的语言重心与信息密度。" label="Stack preset">
                <select className={styles.select} onChange={(event) => setStackPreset(event.target.value)} value={stackPreset}>
                  <option value="saas">SaaS workspace</option>
                  <option value="marketing">Marketing board</option>
                  <option value="ops">Operations console</option>
                </select>
              </Field>
              <Field hint={activePresetMeta} label="Summary">
                <Textarea onChange={(event) => setSummary(event.target.value)} value={summary} />
              </Field>
            </CardContent>
          </Card>

          <div className={styles.filterStack}>
            <Card>
              <CardHeader>
                <CardTitle>Feature flags</CardTitle>
                <CardDescription>用 switch 表达开关型行为，用 checkbox 表达发布勾选项。</CardDescription>
              </CardHeader>
              <CardContent className={styles.toggleList}>
                <div className={styles.controlRow}>
                  <div>
                    <strong className={styles.subtleTitle}>Live metrics</strong>
                    <p className={styles.legend}>保持顶部状态卡持续刷新。</p>
                  </div>
                  <Switch checked={isLiveMode} onCheckedChange={setIsLiveMode} />
                </div>
                <div className={styles.controlRow}>
                  <div>
                    <strong className={styles.subtleTitle}>Digest summary</strong>
                    <p className={styles.legend}>自动生成结构化更新摘要。</p>
                  </div>
                  <Switch checked={enableDigest} onCheckedChange={setEnableDigest} />
                </div>
                <div className={styles.controlRow}>
                  <div>
                    <strong className={styles.subtleTitle}>Pin command bar</strong>
                    <p className={styles.legend}>在二屏表格区仍保留顶部命令入口。</p>
                  </div>
                  <Switch checked={pinCommandBar} onCheckedChange={setPinCommandBar} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Release checklist</CardTitle>
                <CardDescription>Checkbox 更适合多项确认和可追溯的发布前核查。</CardDescription>
              </CardHeader>
              <CardContent className={styles.filterStack}>
                <Checkbox
                  checked={publishDocs}
                  description="把组件说明、视觉约束和代码片段同步到 docs 页面。"
                  label="Publish docs"
                  onCheckedChange={setPublishDocs}
                />
                <Checkbox
                  checked={notifyReviewers}
                  description="向 reviewer 推送新对话框和数据表区域的变更说明。"
                  label="Notify reviewers"
                  onCheckedChange={setNotifyReviewers}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：演示 table、progress、badge、button 在信息密集区域的组合方式，这里是整个长页的第二屏核心。"
        title="块 4：数据密集区（Table / Status / Row Actions）"
      >
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Package</th>
                <th>Owner</th>
                <th>Surface</th>
                <th>Notes</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {releaseRows.map((row) => (
                <tr key={row.name}>
                  <td>
                    <strong>{row.name}</strong>
                    <div className={styles.legend}>{row.velocity}</div>
                  </td>
                  <td>{row.owner}</td>
                  <td>
                    <Badge variant={row.status === 'Ready' ? 'success' : row.status === 'In QA' ? 'warning' : 'outline'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td>{row.note}</td>
                  <td>
                    <div className="min-w-[160px]">
                      <Progress value={row.progress} />
                    </div>
                  </td>
                  <td>
                    <div className={styles.rowStart}>
                      <Button size="sm">Inspect</Button>
                      <Button size="sm" variant="outline">
                        Queue
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：演示 accordion 风格的说明块，适合承载规则、设计思路和组件装配建议。"
        title="块 5：规则展开区（Accordion-like Details）"
      >
        <div className={styles.detailsList}>
          <details className={styles.detailsItem} open>
            <summary>为什么这个页面比“组件画廊”更适合做 shadcn/ui 学习？</summary>
            <p>
              shadcn/ui 的价值不只在单个按钮样式，而在于组件之间如何通过一致的 spacing、border、surface 和 typography 被拼装成页面。
              这个长页把 hero、表单、tab、table、dialog 放在一条叙事里，更接近真实落地。
            </p>
          </details>
          <details className={styles.detailsItem}>
            <summary>如果后续真的接官方 shadcn CLI，应该怎么扩展？</summary>
            <ul>
              <li>保持当前 feature 边界，把公共 `ui` 目录逐步抽成正式 registry 组件。</li>
              <li>优先替换 tabs、dialog、checkbox、switch 这些交互控件，再逐步引入命令面板和 toast。</li>
              <li>继续维持“新增模块 + 注册一条”的接入方式，不把 provider 提升到全局。</li>
            </ul>
          </details>
          <details className={styles.detailsItem}>
            <summary>这个页面里最值得观察的组件组合有哪些？</summary>
            <ul>
              <li>首屏 hero 区的 card + badge + avatar + progress 联合排版。</li>
              <li>配置面板里 input + select + textarea + switch + checkbox 的密度平衡。</li>
              <li>二屏 table 区和 row actions 如何在保持紧凑的同时不丢层级。</li>
            </ul>
          </details>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把主要组件再做一次平铺索引，方便快速定位按钮、标签、输入等局部实现。"
        title="块 6：组件索引（Component Atlas）"
      >
        <div className={styles.componentAtlas}>
          {atlasItems.map((item) => (
            <article className={styles.atlasItem} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className={styles.atlasDemo}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline">Neutral</Badge>
        </div>
      </SectionCard>

      {showDialog ? (
        <div className={styles.dialogBackdrop} role="presentation">
          <Card className={styles.dialogCard}>
            <div aria-modal="true" className={styles.dialogHeader} role="dialog">
              <Badge variant="accent">Launch dialog</Badge>
              <h3>{projectName}</h3>
              <p>{summary}</p>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.stickyNote}>
                <strong className={styles.subtleTitle}>Current preset</strong>
                <p>{stackPreset}</p>
              </div>
              <div className={styles.stickyNote}>
                <strong className={styles.subtleTitle}>Enabled signals</strong>
                <p>
                  {isLiveMode ? 'live metrics' : 'static metrics'} / {enableDigest ? 'digest on' : 'digest off'} /{' '}
                  {pinCommandBar ? 'pinned bar' : 'floating bar'}
                </p>
              </div>
            </div>
            <div className={styles.dialogActions}>
              <Button onClick={() => setShowDialog(false)} variant="outline">
                Close
              </Button>
              <Button onClick={() => setShowDialog(false)}>Confirm Review Run</Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
