import { SectionCard } from '../../common/ui/SectionCard';
import styles from './DesignPatternsPage.module.css';

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightPlainSegment(text: string) {
  return text
    .replace(
      /\b(import|export|from|const|let|var|return|if|else|for|while|switch|case|break|continue|new|type|interface|extends|implements|async|await|function|class|try|catch|finally|throw|in|of)\b/g,
      '<span class="' + styles.tokenKeyword + '">$1</span>'
    )
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="' + styles.tokenBoolean + '">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="' + styles.tokenNumber + '">$1</span>')
    .replace(/\b([A-Za-z_$][\w$]*)(?=\s*\()/g, '<span class="' + styles.tokenFunction + '">$1</span>')
    .replace(/(&lt;\/?)([A-Za-z][\w.-]*)(?=[\s&gt;])/g, `$1<span class="${styles.tokenTag}">$2</span>`);
}

function highlightCode(code: string) {
  const escaped = escapeHtml(code);
  const matcher =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;

  let result = '';
  let lastIndex = 0;
  let match = matcher.exec(escaped);

  while (match) {
    const currentIndex = match.index;
    const plain = escaped.slice(lastIndex, currentIndex);
    result += highlightPlainSegment(plain);

    const token = match[0];
    const tokenClass =
      token.startsWith('//') || token.startsWith('/*') ? styles.tokenComment : styles.tokenString;

    result += `<span class="${tokenClass}">${token}</span>`;
    lastIndex = currentIndex + token.length;
    match = matcher.exec(escaped);
  }

  result += highlightPlainSegment(escaped.slice(lastIndex));

  return result;
}

function CodeBlock({ code, title }: { code: string; title: string }) {
  const lines = highlightCode(code).split('\n');

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{title}</span>
        <span>TSX / Pattern Sketch</span>
      </div>
      <pre className={styles.codePre}>
        <code>
          {lines.map((line, index) => (
            <span className={styles.codeLine} key={`${title}-${index + 1}`}>
              <span className={styles.lineNumber}>{index + 1}</span>
              <span
                className={styles.lineContent}
                dangerouslySetInnerHTML={{ __html: line.length > 0 ? line : '&nbsp;' }}
              />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

const overviewCards = [
  {
    title: '组件组合模式',
    detail: '解决组件如何复用、如何保留 API 一致性，典型包含 Compound Components、Controlled / Uncontrolled、Headless 组件。'
  },
  {
    title: '状态组织模式',
    detail: '解决状态归属、读写边界和副作用收敛，典型包含 Provider、Custom Hook、State Reducer、容器组件。'
  },
  {
    title: '集成适配模式',
    detail: '解决 UI 和第三方服务、协议、数据结构的解耦，典型包含 Adapter、Strategy、Facade、Presenter。'
  }
] as const;

const patternCards = [
  {
    name: 'Container / Presentational',
    family: 'State Organization',
    when: '当页面同时有数据请求、状态转换和 UI 展示时，用容器层拆出数据与行为，展示层只关心 props。',
    case: '订单后台页：`OrdersPageContainer` 负责请求、筛选条件、分页；`OrdersTable` 只负责渲染表格和空态。',
    snippet: `function OrdersPageContainer() {
  const [status, setStatus] = useState<OrderStatus>("pending")
  const [page, setPage] = useState(1)
  const ordersQuery = useOrdersQuery({ status, page })

  return (
    <OrdersTable
      rows={ordersQuery.data?.items ?? []}
      page={page}
      status={status}
      totalPages={ordersQuery.data?.totalPages ?? 1}
      loading={ordersQuery.isPending}
      emptyText="当前筛选条件下没有订单"
      onStatusChange={(nextStatus) => {
        setStatus(nextStatus)
        setPage(1)
      }}
      onPageChange={setPage}
    />
  )
}

function OrdersTable(props: OrdersTableProps) {
  if (props.loading) return <OrdersSkeleton />
  if (props.rows.length === 0) return <OrdersEmpty text={props.emptyText} />

  return (
    <>
      <OrderStatusTabs value={props.status} onValueChange={props.onStatusChange} />
      <table>{/* 这里只负责展示 */}</table>
      <Pagination page={props.page} totalPages={props.totalPages} onChange={props.onPageChange} />
    </>
  )
}`
  },
  {
    name: 'Compound Components',
    family: 'Composition',
    when: '当一个组件有多个强关联子区域，并且你想让调用方按语义自由组合时使用。',
    case: '自定义 Tabs、Modal、FormField 这类组件时，常用 `Tabs.List / Tabs.Trigger / Tabs.Content` 的 API 组织子结构。',
    snippet: `function ProductFilters({ children, value, onValueChange }: Props) {
  return (
    <FiltersContext.Provider value={{ value, onValueChange }}>
      <section className="grid gap-4">{children}</section>
    </FiltersContext.Provider>
  )
}

ProductFilters.Toolbar = function Toolbar() {
  const { value, onValueChange } = useFiltersContext()
  return (
    <div className="flex gap-2">
      <SearchInput value={value.keyword} onChange={(keyword) => onValueChange({ ...value, keyword })} />
      <CategorySelect value={value.category} onChange={(category) => onValueChange({ ...value, category })} />
    </div>
  )
}

ProductFilters.Results = function Results() {
  const { value } = useFiltersContext()
  return <ProductsGrid filters={value} />
}

// 调用方按语义自由组合
<ProductFilters value={filters} onValueChange={setFilters}>
  <ProductFilters.Toolbar />
  <ProductFilters.Results />
</ProductFilters>`
  },
  {
    name: 'Custom Hooks',
    family: 'State Organization',
    when: '当多处组件共享一段状态逻辑、请求逻辑或 DOM 行为逻辑时，优先抽 hook，而不是复制 effect。',
    case: '搜索页中 `useDebouncedKeyword`、`useInfiniteProducts`、`useKeyboardNavigation` 都属于典型抽法。',
    snippet: `function useProductSearch(initialKeyword = "") {
  const [keyword, setKeyword] = useState(initialKeyword)
  const deferredKeyword = useDeferredValue(keyword)

  const query = useQuery({
    queryKey: ["products", deferredKeyword],
    queryFn: () => fetchProducts({ keyword: deferredKeyword }),
    enabled: deferredKeyword.trim().length > 0
  })

  return {
    keyword,
    setKeyword,
    deferredKeyword,
    items: query.data?.items ?? [],
    loading: query.isPending
  }
}

function SearchPage() {
  const search = useProductSearch()

  return (
    <>
      <SearchBar value={search.keyword} onChange={search.setKeyword} />
      <ResultsList items={search.items} loading={search.loading} />
    </>
  )
}`
  },
  {
    name: 'Controlled / Uncontrolled',
    family: 'Composition',
    when: '当一个组件既要支持业务方完全接管状态，也要支持内部自管理时，用双模式 API。',
    case: '日期选择器、Drawer、Dialog、Tabs 都经常同时支持 `value` 和 `defaultValue` / `open` 和 `defaultOpen`。',
    snippet: `function SmartTabs({ value, defaultValue, onValueChange, items }: Props) {
  const [innerValue, setInnerValue] = useState(defaultValue ?? items[0]?.id)
  const currentValue = value ?? innerValue

  const commitValue = (nextValue: string) => {
    if (value === undefined) {
      setInnerValue(nextValue)
    }
    onValueChange?.(nextValue)
  }

  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            data-active={item.id === currentValue}
            onClick={() => commitValue(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{items.find((item) => item.id === currentValue)?.content}</div>
    </div>
  )
}`
  },
  {
    name: 'Provider + Context',
    family: 'State Organization',
    when: '当你需要在一个功能域内共享用户偏好、表单草稿、编辑器状态或协作上下文时使用。',
    case: '富文本编辑器 feature 中，`EditorProvider` 管 selection、history、tool state，页面内多个工具条组件共同消费。',
    snippet: `const EditorContext = createContext<EditorStore | null>(null)

export function EditorProviders({ children }: PropsWithChildren) {
  const [selection, setSelection] = useState<EditorSelection | null>(null)
  const [toolState, setToolState] = useState({ bold: false, italic: false })

  const value = {
    selection,
    toolState,
    setSelection,
    toggleBold: () => setToolState((prev) => ({ ...prev, bold: !prev.bold })),
    toggleItalic: () => setToolState((prev) => ({ ...prev, italic: !prev.italic }))
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

function ToolbarBoldButton() {
  const editor = useEditorStore()
  return <button onClick={editor.toggleBold}>Bold: {String(editor.toolState.bold)}</button>
}`
  },
  {
    name: 'State Reducer Pattern',
    family: 'State Organization',
    when: '当组件内部状态切换比较复杂，同时又想允许上层覆盖默认行为时使用。',
    case: '可编辑表格：内部默认支持新增、删除、撤销；上层可以通过 reducer 拦截某些 action，例如禁止删除已发布行。',
    snippet: `function EditableTable({ stateReducer = defaultReducer, ...props }: Props) {
  const [state, setState] = useState<TableState>({ rows: props.initialRows })

  const dispatch = (action: TableAction) => {
    const defaultNextState = internalTableReducer(state, action)
    const reducedState = stateReducer(state, action, defaultNextState)
    setState(reducedState)
  }

  return (
    <TableView
      rows={state.rows}
      onAddRow={() => dispatch({ type: "row/add" })}
      onDeleteRow={(rowId) => dispatch({ type: "row/delete", rowId })}
    />
  )
}

const stateReducer = (state, action, nextState) => {
  if (action.type === "row/delete") {
    const row = state.rows.find((item) => item.id === action.rowId)
    if (row?.status === "published") return state
  }
  return nextState
}`
  },
  {
    name: 'Adapter Pattern',
    family: 'Integration',
    when: '当后端返回结构、第三方 SDK 回调格式、或多数据源结果不一致时，先做适配层再进 UI。',
    case: '支付页同时接 Stripe 和内部钱包接口，先把响应适配成统一的 `PaymentMethodViewModel` 再渲染组件。',
    snippet: `function adaptPaymentMethod(input: StripeCard | WalletCard): PaymentMethodViewModel {
  if ("brand" in input) {
    return {
      id: input.id,
      type: "card",
      brand: input.brand,
      maskedNumber: "**** " + input.last4,
      expiresAt: input.exp_month + "/" + input.exp_year
    }
  }

  return {
    id: input.id,
    type: "wallet",
    brand: input.provider,
    maskedNumber: input.last4,
    expiresAt: "长期有效"
  }
}

function PaymentMethodList({ methods }: { methods: Array<StripeCard | WalletCard> }) {
  const viewModels = methods.map(adaptPaymentMethod)
  return <PaymentCards items={viewModels} />
}`
  },
  {
    name: 'Strategy Pattern',
    family: 'Integration',
    when: '同一流程存在多种实现策略，而且运行时要按条件切换时使用。',
    case: '图片上传页根据文件体积选择直传、分片上传或转存队列；UI 层只调用 `uploadStrategy.execute(file)`。',
    snippet: `interface UploadStrategy {
  execute(file: File): Promise<UploadResult>
}

const directUploadStrategy: UploadStrategy = {
  async execute(file) {
    return uploadFile(file)
  }
}

const multipartUploadStrategy: UploadStrategy = {
  async execute(file) {
    const chunks = splitFileIntoChunks(file)
    return uploadChunks(chunks)
  }
}

async function submitAsset(file: File) {
  const strategy =
    file.size > LARGE_LIMIT ? multipartUploadStrategy : directUploadStrategy

  const result = await strategy.execute(file)
  return presentUploadResult(result)
}`
  }
] as const;

const caseCards = [
  {
    title: '案例 1：电商商品筛选页',
    summary: '最常见的组合是 `Container + Custom Hook + Compound Components`。',
    stack: 'Container + Custom Hook + Compound Components',
    why: '商品页会同时遇到 URL 同步、筛选 chips、分页、排序和加载态。把这些逻辑都写进一个页面组件，很快就会失控。',
    bullets: [
      '`ProductsPageContainer` 请求商品、同步 URL 查询参数、处理分页',
      '`useProductFilters` 封装筛选项、重置逻辑和排序切换',
      '`Filters.Panel / Filters.Chips / Filters.Results` 用组合子组件分区渲染'
    ],
    snippet: `function ProductsPageContainer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useProductFilters(searchParams)
  const query = useProductsQuery({
    keyword: filters.keyword,
    category: filters.category,
    sort: filters.sort,
    page: filters.page
  })

  return (
    <ProductsLayout>
      <FiltersPanel
        value={filters.value}
        onKeywordChange={filters.setKeyword}
        onCategoryChange={filters.setCategory}
        onSortChange={filters.setSort}
        onReset={filters.reset}
      />

      <FiltersChips
        activeFilters={filters.activeChips}
        onRemoveChip={filters.removeChip}
      />

      <ProductsResults
        items={query.data?.items ?? []}
        loading={query.isPending}
        page={filters.page}
        totalPages={query.data?.totalPages ?? 1}
        onPageChange={(nextPage) => {
          filters.setPage(nextPage)
          setSearchParams(filters.toSearchParams(nextPage))
        }}
      />
    </ProductsLayout>
  )
}`
  },
  {
    title: '案例 2：后台权限管理页',
    summary: '典型使用 `Adapter + Strategy + Provider`。',
    stack: 'Adapter + Strategy + Provider',
    why: '权限树常常来自多个接口，节点结构、禁用规则和默认展开策略都不一致。直接把接口数据灌进树组件，后期会非常痛苦。',
    bullets: [
      '权限树数据先通过 adapter 归一化，避免后端结构直接污染树组件',
      '不同组织层级使用不同计算策略决定默认展开和禁用规则',
      '页面内多个面板共享当前选中角色与编辑草稿，用 provider 限定在 feature 内'
    ],
    snippet: `function PermissionPageContainer() {
  const roleQuery = useRolesQuery()
  const permissionQuery = usePermissionTreeQuery()
  const policy = usePermissionPolicy()

  const nodes = useMemo(
    () => adaptPermissionNodes(permissionQuery.data ?? []),
    [permissionQuery.data]
  )

  const treeState = useMemo(
    () => buildPermissionTreeState(nodes, policy),
    [nodes, policy]
  )

  return (
    <PermissionEditorProvider initialTree={treeState}>
      <PermissionHeader roles={roleQuery.data ?? []} />
      <PermissionTree
        nodes={treeState.nodes}
        disabledStrategy={policy.disabledStrategy}
        expandStrategy={policy.expandStrategy}
      />
      <PermissionDiffPanel />
    </PermissionEditorProvider>
  )
}`
  },
  {
    title: '案例 3：可复用对话框体系',
    summary: '常见组合是 `Controlled / Uncontrolled + State Reducer + Headless`。',
    stack: 'Controlled / Uncontrolled + State Reducer + Headless',
    why: '弹框在不同业务里会遇到草稿未保存、异步关闭、权限校验等差异。如果只有最死板的 open/close API，很快就不够用。',
    bullets: [
      '业务页可完全接管 `open`，也可仅传 `defaultOpen` 使用内部状态',
      '状态切换通过 reducer 拦截，允许上层在关闭前做 unsaved changes 校验',
      '底层只提供结构和行为，视觉外观由业务 feature 自己拼'
    ],
    snippet: `function SmartDialog(props: SmartDialogProps) {
  const [innerOpen, setInnerOpen] = useState(props.defaultOpen ?? false)
  const open = props.open ?? innerOpen

  const commitOpen = (nextOpen: boolean) => {
    const reduced = props.stateReducer?.(
      { open },
      { type: nextOpen ? "open" : "close" },
      { open: nextOpen }
    ) ?? { open: nextOpen }

    if (props.open === undefined) {
      setInnerOpen(reduced.open)
    }

    props.onOpenChange?.(reduced.open)
  }

  return props.children({
    open,
    close: () => commitOpen(false),
    triggerProps: { onClick: () => commitOpen(true) }
  })
}`
  },
  {
    title: '案例 4：多渠道通知中心',
    summary: '适合 `Facade + Adapter + Presenter`。',
    stack: 'Facade + Adapter + Presenter',
    why: '通知中心最常见的问题是数据源多、状态表达乱、文案格式分散。需要先聚合，再归一化，再面向 UI 转译。',
    bullets: [
      '邮件、站内信、Push、Webhook 四种渠道先由 facade 聚合',
      '每种渠道结果再适配成统一的通知记录视图模型',
      'Presenter 层把错误码、重试状态、发送时间转成适合 UI 的标签和文案'
    ],
    snippet: `async function loadNotificationCenter(userId: string) {
  const facadeResult = await notificationCenterFacade.fetchAll(userId)

  return facadeResult.items.map((item) => {
    const record = adaptNotificationRecord(item)

    return presentNotificationRecord(record, {
      locale: "zh-CN",
      now: Date.now()
    })
  })
}

function NotificationCenterPage() {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => loadNotificationCenter(currentUser.id)
  })

  return <NotificationFeed items={query.data ?? []} loading={query.isPending} />
}`
  }
] as const;

const antiCards = [
  {
    title: '把所有逻辑塞进页面组件',
    detail: '页面组件里既写请求、又写变换、又写事件、又写视图切换，最后很难复用也难测试。',
    fixes: ['先拆 Custom Hook 或 Container', '把纯展示部分提成无副作用组件']
  },
  {
    title: '直接把后端 DTO 传给 UI',
    detail: '接口字段名、状态枚举、时间格式一变，页面会大面积联动。',
    fixes: ['加 Adapter / Presenter 层', '在 feature 内统一产出 ViewModel']
  },
  {
    title: 'Context 无边界扩散',
    detail: '把本该属于某个页面的状态提升到全局，导致调试困难且破坏 feature 隔离。',
    fixes: ['Provider 只放在 feature 内', '跨 feature 共享前先判断是否真有必要']
  },
  {
    title: '模式套模式但没有实际收益',
    detail: '不是每个小组件都要上 Strategy、Facade、Reducer，模式是为了降复杂度，不是为了看起来高级。',
    fixes: ['先看是否存在明确变化点', '没有变化点时保持直接写法更好']
  }
] as const;

const checklist = [
  {
    title: '先看变化点，再决定模式',
    detail: '如果你的代码未来不会出现多策略切换、多状态接管、多数据源适配，那没必要强上对应模式。'
  },
  {
    title: '页面级模式优先服务可维护性',
    detail: '在 React 项目里，设计模式最常见的价值是降低页面复杂度、稳定 API，而不是追求 GoF 术语本身。'
  },
  {
    title: '优先把模式限制在 feature 内',
    detail: '这个实验场的目标是低耦合，所以像 Provider、Adapter、Presenter 都应优先收敛在目标 feature 内。'
  }
] as const;

export default function DesignPatternsPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Content Curation / Design Patterns</span>
        <h2>前端常用设计模式整理页</h2>
        <p className={styles.heroLead}>
          这页不是泛泛讲概念，而是把 React 项目里最常用、最容易真正落地的设计模式按“什么时候用、解决什么问题、真实页面怎么用”
          的方式整理出来。你可以把它当成一个开发前的选型参考页，而不是一份只讲名词的笔记。
        </p>
        <div className={styles.heroActions}>
          <button className={styles.heroButton} type="button">先看模式地图</button>
          <button className={styles.heroGhost} type="button">跳到实际案例</button>
        </div>
        <div className={styles.heroMeta}>
          <article className={styles.heroMetaCard}>
            <span>Patterns</span>
            <strong>8</strong>
            <p>覆盖组件组合、状态组织、集成适配三类最常见模式。</p>
          </article>
          <article className={styles.heroMetaCard}>
            <span>Use Cases</span>
            <strong>4</strong>
            <p>每个案例都尽量贴近商品页、后台页、弹框体系、通知中心等真实场景。</p>
          </article>
          <article className={styles.heroMetaCard}>
            <span>Principle</span>
            <strong>Low Coupling</strong>
            <p>所有模式都围绕“降低 feature 复杂度、稳定 API、便于调试”展开。</p>
          </article>
        </div>
      </header>

      <SectionCard
        note="用意：先建立一张模式地图，避免一上来就背术语。"
        title="块 1：模式地图（模式先按问题域分类）"
      >
        <div className={styles.matrix}>
          {overviewCards.map((item) => (
            <article className={styles.matrixCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：按卡片列出常用模式，每张卡都说明适用场景和一个真实案例。"
        title="块 2：常用模式清单（什么时候该用）"
      >
        <div className={styles.patternGrid}>
          {patternCards.map((pattern) => (
            <article className={styles.patternCard} key={pattern.name}>
              <span className={styles.label}>{pattern.family}</span>
              <div className={styles.patternMeta}>
                <strong>{pattern.name}</strong>
                <div className={styles.metaRow}>
                  <span>什么时候用</span>
                  <p>{pattern.when}</p>
                </div>
                <div className={styles.metaRow}>
                  <span>实际案例</span>
                  <p>{pattern.case}</p>
                </div>
              </div>
              <CodeBlock code={pattern.snippet} title="Example" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：把模式组合放回真实业务页面，每个案例都给出更完整的代码骨架。"
        title="块 3：实际使用案例（模式通常是组合出现的）"
      >
        <div className={styles.caseGrid}>
          {caseCards.map((item) => (
            <article className={styles.caseCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.summary}</p>
              <div className={styles.caseMeta}>
                <div className={styles.caseMetaRow}>
                  <span>模式组合</span>
                  <p>{item.stack}</p>
                </div>
                <div className={styles.caseMetaRow}>
                  <span>为什么要这样拆</span>
                  <p>{item.why}</p>
                </div>
              </div>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <CodeBlock code={item.snippet} title="Concrete Case" />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：指出设计模式在前端里最常见的误用方式，避免学了模式反而把代码写复杂。"
        title="块 4：常见误区（什么时候不要硬套模式）"
      >
        <div className={styles.antiGrid}>
          {antiCards.map((item) => (
            <article className={styles.antiCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <ul>
                {item.fixes.map((fix) => (
                  <li key={fix}>{fix}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        note="用意：给开发前选型一个快速检查表。"
        title="块 5：使用检查表（决定要不要上模式前先问自己）"
      >
        <div className={styles.checklist}>
          {checklist.map((item) => (
            <article className={styles.checklistItem} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
