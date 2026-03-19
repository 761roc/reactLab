import { useMemo, useState } from 'react';
import { BellRing, Bot, CheckCircle2, ChevronRight, Clock3, LayoutPanelTop, MoreHorizontal, PanelRightOpen, ShieldCheck, Sparkles, WandSparkles, Workflow } from 'lucide-react';
import { SectionCard } from '../../common/ui/SectionCard';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import styles from './ShadcnDemoPage.module.css';

const deploymentStats = [
  { label: 'registry blocks', value: '28', note: '按钮、输入、卡片、标签、表格、反馈条全部走官方 shadcn 组件。' },
  { label: 'preview branches', value: '12', note: '通过 variant 与 token 体系保持视觉统一，不再手写原语。' },
  { label: 'handoff confidence', value: '94%', note: '页面已经从“组件画廊”升级成真实工作台级组合示例。' }
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
    description: '检查 radius、surface 与 muted token 对长页结构的影响。',
    badge: 'Stable',
    progress: 64
  },
  {
    title: 'Command Queue',
    description: '把 dialog、sheet、table、alert 串到一个工作台叙事里。',
    badge: 'Busy',
    progress: 73
  },
  {
    title: 'Review Coverage',
    description: '覆盖 hero、filters、compose、table、command center 五层结构。',
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
    note: '演示 chart 区块的前后信息架构与 CTA 入口。',
    progress: 72
  },
  {
    name: 'Ops control surface',
    owner: 'Operations',
    status: 'Draft',
    velocity: '7 sections',
    note: '偏向 alert、审批流、日志区和侧边命令栏。',
    progress: 48
  }
] as const;

const teamMembers = ['AL', 'MQ', 'JT', 'PX'] as const;

const atlasItems = [
  { title: 'Button', text: '主次按钮、ghost、icon 按钮与 destructive action 都来自官方生成组件。' },
  { title: 'Card', text: '主页面所有信息层都复用 Card / CardAction / CardFooter 结构。' },
  { title: 'Tabs', text: '同一页内切换 overview、pipeline、activity，不额外开路由。' },
  { title: 'Dialog / Sheet', text: '模态确认和右侧命令栏都用官方 overlay 组件承载。' },
  { title: 'Select / Input / Textarea', text: '配置面板使用 shadcn 表单体系，而不是原生 select 和手写输入。' },
  { title: 'Table / Dropdown Menu', text: '二屏表格区使用官方 table 与行级操作菜单组合。' }
] as const;

const activityFeed = [
  '09:12 AM · Token sync finished',
  '09:46 AM · Review request sent',
  '10:21 AM · Audit opened'
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

  const completionScore = useMemo(() => {
    const switches = [isLiveMode, enableDigest, publishDocs, notifyReviewers, pinCommandBar];
    return 56 + switches.filter(Boolean).length * 8;
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
          <Badge variant="outline">shadcn/ui</Badge>
          <Badge variant="secondary">Radix Nova</Badge>
          <Badge>2+ screens</Badge>
        </div>
        <h2>shadcn/ui 复杂页面演示工作台</h2>
        <p>
          这次页面已经切到官方生成组件：按钮、卡片、表格、切换器、checkbox、select、tabs、dialog、sheet、dropdown menu
          都来自 `src/components/ui`。重点是展示这些组件如何组成一个真实工作台，而不是单独列出样式。
        </p>
        <div className={styles.headerActions}>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <PanelRightOpen />
                Open Command Center
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[min(92vw,420px)] sm:max-w-[420px]">
              <SheetHeader>
                <SheetTitle>{projectName}</SheetTitle>
                <SheetDescription>{summary}</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4 text-sm">
                <Alert>
                  <Workflow className="size-4" />
                  <AlertTitle>Command rail is feature-scoped</AlertTitle>
                  <AlertDescription>
                    这里展示的命令栏只属于 `shadcn-demo`，没有把任何 provider 或全局状态提升到壳层。
                  </AlertDescription>
                </Alert>
                <div className="grid gap-2 rounded-xl border border-border bg-muted/40 p-3">
                  <strong>Enabled controls</strong>
                  <span className={styles.legend}>
                    {isLiveMode ? 'live metrics' : 'static metrics'} / {enableDigest ? 'digest on' : 'digest off'} /{' '}
                    {pinCommandBar ? 'pinned command bar' : 'floating command bar'}
                  </span>
                </div>
                <div className="grid gap-2 rounded-xl border border-border bg-muted/40 p-3">
                  <strong>Release checklist</strong>
                  <span className={styles.legend}>
                    docs: {publishDocs ? 'publish' : 'hold'} / reviewers: {notifyReviewers ? 'notify' : 'manual'}
                  </span>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close Panel</Button>
                </SheetClose>
                <Button>
                  <WandSparkles />
                  Run Command Pack
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Sparkles />
                Launch Review Dialog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{projectName}</DialogTitle>
                <DialogDescription>{summary}</DialogDescription>
              </DialogHeader>
              <div className={styles.detailGrid}>
                <div className={styles.stickyNote}>
                  <strong className={styles.subtleTitle}>Preset</strong>
                  <p>{stackPreset}</p>
                </div>
                <div className={styles.stickyNote}>
                  <strong className={styles.subtleTitle}>Coverage</strong>
                  <p>{completionScore}% readiness with dialog, sheet, tabs, select and table in one page.</p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Confirm Review Run</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                Quick Actions
                <ChevronRight />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Workspace Toggles</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={isLiveMode} onCheckedChange={(checked) => setIsLiveMode(checked === true)}>
                Live metrics
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={enableDigest} onCheckedChange={(checked) => setEnableDigest(checked === true)}>
                Digest summary
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={pinCommandBar} onCheckedChange={(checked) => setPinCommandBar(checked === true)}>
                Pin command bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Duplicate workspace
                <DropdownMenuShortcut>Cmd+D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Sync registry notes
                <DropdownMenuShortcut>Cmd+K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={styles.chipRow}>
          <Badge variant="secondary">dashboard</Badge>
          <Badge variant="outline">official ui</Badge>
          <Badge variant="secondary">feature-scoped</Badge>
          <Badge variant="outline">tailwind tokens</Badge>
        </div>
      </header>

      <SectionCard
        note="用意：演示 hero、badge、avatar-group、alert、dropdown、progress 和 card action 如何共同构成首屏。"
        title="块 1：页面骨架（Hero / KPI / Action Stack）"
      >
        <div className={styles.heroLayout}>
          <div className={styles.heroStack}>
            <Card className="border border-border/80 bg-white/90">
              <CardHeader>
                <CardTitle className="mt-1 text-3xl tracking-[-0.05em]">Registry preview orchestration</CardTitle>
                <CardDescription className="max-w-[60ch]">
                  用官方 shadcn 组件拼一个“正在上线中的设计系统工作台”，让视觉密度、命令动作和数据反馈落到真实页面语境里。
                </CardDescription>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon-sm" variant="outline">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open Preview</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate Layout</DropdownMenuItem>
                      <DropdownMenuItem>Inspect Tokens</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
              <CardContent className={styles.signalList}>
                <div className={styles.rowBetween}>
                  <div className={styles.heroBadgeRow}>
                    <Badge>Workspace Status</Badge>
                    <Badge variant="outline">Nova preset</Badge>
                    <Badge variant="secondary">{activeView}</Badge>
                  </div>
                  <AvatarGroup>
                    {teamMembers.map((member) => (
                      <Avatar key={member} size="lg">
                        <AvatarFallback>{member}</AvatarFallback>
                      </Avatar>
                    ))}
                    <AvatarGroupCount>+2</AvatarGroupCount>
                  </AvatarGroup>
                </div>

                <Alert className="border-sky-200 bg-sky-50/70">
                  <Sparkles className="size-4 text-sky-600" />
                  <AlertTitle>Official shadcn components are now in use</AlertTitle>
                  <AlertDescription>
                    这个 demo 已经切换到 `src/components/ui/*`，不再依赖手写 primitives。
                  </AlertDescription>
                  <AlertAction>
                    <Button size="sm" variant="outline">
                      Inspect
                    </Button>
                  </AlertAction>
                </Alert>

                <div className={styles.signalGrid}>
                  {signalCards.map((card) => (
                    <Card className="border border-border/80 bg-white/90" key={card.title} size="sm">
                      <CardHeader>
                        <div className={styles.rowBetween}>
                          <CardTitle>{card.title}</CardTitle>
                          <Badge variant={card.badge === 'Stable' ? 'default' : 'secondary'}>{card.badge}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="grid gap-3">
                        <p className={styles.legend}>{card.description}</p>
                        <Progress value={card.progress} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
            <Card className="border border-border/80 bg-white/90">
              <CardHeader>
                <div className={styles.metricHeader}>
                  <div>
                    <CardTitle>Release readiness score</CardTitle>
                    <CardDescription>根据当前启用的自动化与发布范围动态计算。</CardDescription>
                  </div>
                  <Badge>{completionScore}%</Badge>
                </div>
              </CardHeader>
              <CardContent className={styles.signalList}>
                <Progress value={completionScore} />
                <div className={styles.heroBadgeRow}>
                  <Badge variant="outline">typed layout</Badge>
                  <Badge variant="secondary">dense data</Badge>
                  <Badge variant="outline">review required</Badge>
                </div>
                <Separator />
                <div className={styles.teamList}>
                  <div className={styles.teamItem}>
                    <strong>Why this feels like shadcn/ui</strong>
                    <p>低饱和 surface、清晰的 ring/border、卡片式切层和一致的 token 都来自官方生成组件风格。</p>
                  </div>
                  <div className={styles.teamItem}>
                    <strong>Why this matters in the lab</strong>
                    <p>你现在能在一个 feature 页面里同时观察组件粒度和页面排版，而不是对着单个 demo 卡片学习。</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-white/90">
              <CardHeader>
                <CardTitle>Signal strip</CardTitle>
                <CardDescription>Alert、Skeleton 和 CTA 按钮放在同一块，模拟真实后台二级信息区。</CardDescription>
              </CardHeader>
              <CardContent className={styles.miniGrid}>
                <Alert>
                  <BellRing className="size-4" />
                  <AlertTitle>Notification rail active</AlertTitle>
                  <AlertDescription>当前页面正在演示密集状态提醒，不只展示按钮或标签本身。</AlertDescription>
                </Alert>
                <div className="grid gap-2 rounded-xl border border-border bg-muted/40 p-3">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <div className={styles.rowStart}>
                  <Button size="lg">Publish Registry</Button>
                  <Button size="lg" variant="secondary">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：演示 tabs 作为页面内分视图容器，保持上下文不丢，同时串联 card、alert、skeleton。"
        title="块 2：视图切换（Tabs / Alert / Activity Feed）"
      >
        <Tabs className="mt-2" onValueChange={setActiveView} value={activeView}>
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className={styles.signalGrid}>
              <Card className="border border-border/80 bg-white/90">
                <CardHeader>
                  <CardTitle>Current surface</CardTitle>
                  <CardDescription>当前页是长页 dashboard，而不是单纯的组件目录。</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <LayoutPanelTop className="size-4" />
                    <AlertTitle>Long-form page composition</AlertTitle>
                    <AlertDescription>首屏是 hero 和 KPI，第二屏是表格和行级操作，底部是规则区和组件索引。</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              <Card className="border border-border/80 bg-white/90">
                <CardHeader>
                  <CardTitle>Variant discipline</CardTitle>
                  <CardDescription>主次按钮、状态 badge、dialog、sheet 与表单输入共用同一 token 语言。</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className={styles.rowStart}>
                    <Badge>button</Badge>
                    <Badge variant="secondary">card</Badge>
                    <Badge variant="outline">dialog</Badge>
                    <Badge variant="outline">sheet</Badge>
                  </div>
                  <Progress value={84} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pipeline">
            <div className={styles.pipelineList}>
              {releaseRows.map((row) => (
                <Card className="border border-border/80 bg-white/90" key={row.name}>
                  <CardHeader>
                    <div className={styles.rowBetween}>
                      <div>
                        <CardTitle>{row.name}</CardTitle>
                        <CardDescription>{row.note}</CardDescription>
                      </div>
                      <Badge variant={row.status === 'Ready' ? 'default' : 'secondary'}>{row.status}</Badge>
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
              {activityFeed.map((item) => (
                <div className={styles.detailPanel} key={item}>
                  <strong>{item}</strong>
                  <p>所有更新都围绕同一套官方组件进行组合，避免同一 feature 内存在两套 UI 原语。</p>
                </div>
              ))}
              <div className="grid gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                <div className={styles.rowBetween}>
                  <strong className={styles.subtleTitle}>Queued preview shards</strong>
                  <span className={styles.legend}>skeleton state</span>
                </div>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SectionCard>

      <SectionCard
        note="用意：演示官方 input、textarea、select、switch、checkbox 在一个真实配置面板中的排布。"
        title="块 3：配置面板（Form / Select / Switch / Checkbox）"
      >
        <div className={styles.composeGrid}>
          <Card className="border border-border/80 bg-white/90">
            <CardHeader>
              <CardTitle>Compose release brief</CardTitle>
              <CardDescription>模拟 shadcn/ui 页面里常见的右侧配置面板写法。</CardDescription>
            </CardHeader>
            <CardContent className={styles.filterStack}>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500" htmlFor="project-title">
                  Project title
                </label>
                <Input id="project-title" onChange={(event) => setProjectName(event.target.value)} value={projectName} />
                <span className={styles.legend}>控制 hero 和主数据区的标题命名。</span>
              </div>

              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Stack preset</span>
                <Select onValueChange={setStackPreset} value={stackPreset}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Workspace flavor</SelectLabel>
                      <SelectItem value="saas">SaaS workspace</SelectItem>
                      <SelectItem value="marketing">Marketing board</SelectItem>
                      <SelectItem value="ops">Operations console</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Current note</SelectLabel>
                      <SelectItem value={stackPreset}>{activePresetMeta}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <span className={styles.legend}>{activePresetMeta}</span>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500" htmlFor="project-summary">
                  Summary
                </label>
                <Textarea id="project-summary" onChange={(event) => setSummary(event.target.value)} value={summary} />
              </div>
            </CardContent>
          </Card>

          <div className={styles.filterStack}>
            <Card className="border border-border/80 bg-white/90">
              <CardHeader>
                <CardTitle>Feature flags</CardTitle>
                <CardDescription>用 switch 表达开关型行为，把页面级能力开关放在一个面板里。</CardDescription>
              </CardHeader>
              <CardContent className={styles.filterStack}>
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

            <Card className="border border-border/80 bg-white/90">
              <CardHeader>
                <CardTitle>Release checklist</CardTitle>
                <CardDescription>Checkbox 更适合多项确认和可追溯的发布前核查。</CardDescription>
              </CardHeader>
              <CardContent className={styles.filterStack}>
                <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3">
                  <Checkbox checked={publishDocs} onCheckedChange={(checked) => setPublishDocs(checked === true)} />
                  <span className="grid gap-1">
                    <span className="text-sm font-medium text-slate-900">Publish docs</span>
                    <span className={styles.legend}>把组件说明、视觉约束和代码片段同步到 docs 页面。</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3">
                  <Checkbox checked={notifyReviewers} onCheckedChange={(checked) => setNotifyReviewers(checked === true)} />
                  <span className="grid gap-1">
                    <span className="text-sm font-medium text-slate-900">Notify reviewers</span>
                    <span className={styles.legend}>向 reviewer 推送新对话框和数据表区域的变更说明。</span>
                  </span>
                </label>
                <Alert>
                  <ShieldCheck className="size-4" />
                  <AlertTitle>Form stack is fully migrated</AlertTitle>
                  <AlertDescription>这里已经没有原生 select 或手写 checkbox/switch 实现。</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：演示官方 table、progress、badge、dropdown menu 在信息密集区的组合方式，这是整个长页的第二屏核心。"
        title="块 4：数据密集区（Table / Status / Row Actions）"
      >
        <div className={styles.tableWrap}>
          <Table className={styles.table}>
            <TableCaption>Dense backend-style row operations built with shadcn table primitives.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Surface</TableHead>
                <TableHead className="whitespace-normal">Notes</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releaseRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>
                    <div className="grid gap-1">
                      <strong className="text-slate-900">{row.name}</strong>
                      <span className={styles.legend}>{row.velocity}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Ready' ? 'default' : 'secondary'}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[280px] whitespace-normal">{row.note}</TableCell>
                  <TableCell>
                    <div className="min-w-[150px]">
                      <Progress value={row.progress} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="outline">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Inspect</DropdownMenuItem>
                        <DropdownMenuItem>Queue handoff</DropdownMenuItem>
                        <DropdownMenuItem>Open logs</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：说明这个 demo 里哪些区域最适合继续扩展，保留真实工作台而不是退回组件墙。"
        title="块 5：规则展开区（Notes / Structure / Extension Path）"
      >
        <div className={styles.detailsList}>
          <div className={styles.detailPanel}>
            <strong>为什么这个页面更适合做 shadcn/ui 学习？</strong>
            <p>重点已经从“某个按钮长什么样”转成“组件如何以统一 token 拼出可交付页面”。这才是 shadcn/ui 更有价值的学习路径。</p>
          </div>
          <div className={styles.detailPanel}>
            <strong>如果继续扩展，优先加什么？</strong>
            <p>可以继续加 calendar、popover、tooltip、chart、command 等官方组件，但仍要维持 feature 隔离和注册表接入方式。</p>
          </div>
          <div className={styles.detailPanel}>
            <strong>这页最值得观察的组合</strong>
            <p>首屏 hero 的 card + alert + avatar-group，配置区的 form stack，以及第二屏 table + dropdown 行级操作。</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把官方生成组件再做一次索引，方便后续继续往这个 feature 里塞更多展示块。"
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
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2">
            <Bot className="size-4 text-muted-foreground" />
            <span className="text-sm text-slate-700">sheet / dialog / dropdown ready</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span className="text-sm text-slate-700">official ui installed</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2">
            <Clock3 className="size-4 text-slate-500" />
            <span className="text-sm text-slate-700">long-page composition</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
