import type { FeatureGuide } from './feature-guide-types';

export const featureGuides: Partial<Record<string, FeatureGuide>> = {
  'tailwind-demo': {
    heading: 'Tailwind Demo 使用概览',
    description: '这个页面重点演示 Tailwind 在复杂视觉层、状态切换和响应式断点中的组合能力。',
    blocks: [
      {
        title: '适用场景',
        summary: '当你需要快速构建复杂 UI 且希望样式逻辑靠近组件时，Tailwind 的 utility 组合效率很高。',
        bullets: ['适合快速迭代视觉方案', '适合做状态切换样式', '适合模块级样式实验']
      },
      {
        title: '典型写法',
        summary: '通过断点、状态和任意值组合一个较复杂的容器样式。',
        code: {
          language: 'tsx',
          title: 'Responsive + State + Arbitrary Values',
          snippet: `function HeroCard() {
  return (
    <article className="relative rounded-2xl border border-slate-200 p-5
      shadow-[0_10px_40px_-18px_rgba(2,132,199,0.45)]
      lg:grid lg:grid-cols-[1.2fr_0.8fr]">
      <h3 className="text-xl font-bold">Tailwind Composition</h3>
      <p className="mt-2 text-slate-600">Utility classes stay near component logic.</p>
    </article>
  );
}`
        }
      }
    ]
  },
  'responsive-web-demo': {
    heading: 'Responsive Web Demo 使用概览',
    description: '这是一个场景化长网页，覆盖极窄屏、密集数据、粘性布局、局部横向滚动等真实适配难点。',
    blocks: [
      {
        title: '适配策略总览',
        summary: '核心原则是“结构重排优先于缩放”，并且把横向滚动限制在局部容器。',
        bullets: ['320/360/390 宽度专项检查', '小屏按钮保持 44px+', '局部 overflow，不做全局横滚']
      },
      {
        title: '关键 CSS 模式',
        summary: '使用多断点兜底，确保极窄屏时文本、按钮和表格仍可用。',
        code: {
          language: 'css',
          title: 'Small-width Fallback',
          snippet: `.matrixWrap { overflow-x: auto; }
@media (max-width: 420px) {
  .heroActions { flex-direction: column; }
  .primaryAction, .secondaryAction { width: 100%; min-height: 44px; }
}
@media (max-width: 340px) {
  .heroTitle { font-size: 22px; }
  .track { grid-auto-columns: minmax(160px, 88vw); }
}`
        }
      }
    ]
  },
  'shadcn-demo': {
    heading: 'shadcn/ui Demo 使用概览',
    description: '这个页面重点不在单个组件孤立展示，而在于用 shadcn/ui 的拼装思路构建一个两屏以上的复杂工作台页面。',
    blocks: [
      {
        title: 'Step 1 · 先用 Card / Badge / Button 建首屏骨架',
        summary: 'shadcn/ui 常见页面会先搭表面层、标题层级和主次动作，再把数据卡片和状态标签填进去。',
        code: {
          language: 'tsx',
          title: 'Hero Composition',
          snippet: `<Card>
  <CardHeader>
    <Badge>Workspace Status</Badge>
    <CardTitle>Registry preview orchestration</CardTitle>
    <CardDescription>把组件串成真实页面，而不是孤立样式。</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button>Promote Preview</Button>
    <Button variant="secondary">Sync Tokens</Button>
  </CardFooter>
</Card>`
        }
      },
      {
        title: 'Step 2 · 用 Tabs 在单页里切多个信息视图',
        summary: 'Tabs 适合在不离开当前页面上下文的前提下，切换 overview、pipeline、activity 之类的内容面板。',
        bullets: ['不需要新路由即可切内容区', '保持顶部统计和操作栏可见', '适合长页中的中段内容切换']
      },
      {
        title: 'Step 3 · 配置面板中组合 Input / Textarea / Switch / Checkbox',
        summary: 'shadcn/ui 很适合拼密集但清晰的表单面板，关键是 label、hint、间距和边框语义统一。',
        code: {
          language: 'tsx',
          title: 'Control Panel Pattern',
          snippet: `<label className="grid gap-2">
  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Project title</span>
  <Input value={projectName} onChange={...} />
</label>
<Select value={stackPreset} onValueChange={setStackPreset}>
  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
</Select>
<Switch checked={isLiveMode} onCheckedChange={setIsLiveMode} />
<Checkbox checked={publishDocs} onCheckedChange={setPublishDocs} />`
        }
      },
      {
        title: 'Step 4 · 在第二屏安排表格和行级操作',
        summary: '为了证明组件库能支撑真实后台场景，必须把 table、badge、progress 和 row actions 放进同一个密集区。',
        bullets: ['表格要保持列层级清晰', '状态用 badge，进度用 progress', '行操作只保留最常用的 1-2 个']
      }
    ]
  },
  'react-query-demo': {
    heading: 'React Query Demo 使用概览',
    description: 'React Query 主要管理服务端状态。建议按“Provider 注入 -> query 定义 -> mutation 失效 -> UI 状态反馈”顺序落地。',
    blocks: [
      {
        title: 'Step 1 · 声明 QueryClientProvider 包裹层',
        summary: '在应用或 feature 入口初始化 QueryClient，统一管理重试、缓存时间和请求行为。',
        code: {
          language: 'tsx',
          title: 'Provider Setup',
          snippet: `const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } }
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDemoPage />
  </QueryClientProvider>
);`
        }
      },
      {
        title: 'Step 2 · 用稳定 queryKey 定义查询',
        summary: 'queryKey 必须可预测且可组合，分页、筛选条件都应进入 key，才能正确命中缓存。',
        code: {
          language: 'tsx',
          title: 'Query Definition',
          snippet: `const projects = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData,
  select: (res) => res.items
});`
        }
      },
      {
        title: 'Step 3 · 写操作后集中失效缓存',
        summary: 'mutation 成功后统一 invalidateQueries，不要在多个组件手写同步逻辑。',
        code: {
          language: 'tsx',
          title: 'Mutation + Invalidate',
          snippet: `const update = useMutation({
  mutationFn: updateProject,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    queryClient.invalidateQueries({ queryKey: ['project-detail'] });
  }
});`
        }
      },
      {
        title: 'Step 4 · 处理 loading/error/empty 三态',
        summary: '页面层统一三态渲染，保证交互反馈稳定。',
        bullets: ['loading: 用 isPending 显示 skeleton', 'error: 用 isError + refetch 重试', 'empty: data.length===0 给空态提示']
      },
      {
        title: 'Step 5 · 使用边界',
        summary: 'React Query 管的是远程数据，不建议把复杂表单中间态或动画状态塞进去。',
        bullets: ['服务端列表/详情是最佳场景', '本地草稿态优先 useState/useReducer', '跨页缓存策略由 queryKey + staleTime 控制']
      }
    ]
  },
  'react-context-demo': {
    heading: 'React Context Demo 使用概览',
    description: 'Context + useReducer 适合中小型共享状态。推荐按“Provider -> reducer -> actions -> hooks -> 可选持久化”分层。',
    blocks: [
      {
        title: 'Step 1 · 声明 Provider 包裹组件',
        summary: '先在功能入口挂上 Provider，明确状态作用域只覆盖当前 feature。',
        code: {
          language: 'tsx',
          title: 'Provider Mount',
          snippet: `export function ReactContextDemoProviders({ children }: PropsWithChildren) {
  return <StoreProvider>{children}</StoreProvider>;
}`
        }
      },
      {
        title: 'Step 2 · 定义 state 与 reducer',
        summary: '把共享状态和变更动作集中在 reducer，保证更新路径一致可调试。',
        code: {
          language: 'ts',
          title: 'Reducer Structure',
          snippet: `type Action =
  | { type: 'counter/increment' }
  | { type: 'preferences/setTheme'; payload: ThemeMode };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, counter: state.counter + 1 };
    default:
      return state;
  }
}`
        }
      },
      {
        title: 'Step 3 · 在 Provider 内封装 actions',
        summary: '组件只调用语义化方法，不直接 dispatch 裸 action，减少调用方重复代码。',
        code: {
          language: 'tsx',
          title: 'Action Wrapper',
          snippet: `const actions = useMemo(
  () => ({
    increment: () => dispatch({ type: 'counter/increment' }),
    setTheme: (theme: ThemeMode) =>
      dispatch({ type: 'preferences/setTheme', payload: theme })
  }),
  []
);`
        }
      },
      {
        title: 'Step 4 · 组件中联合读取多个状态块',
        summary: '通过自定义 hook 暴露 state + actions，单组件可同时消费 counter、preferences、todos。',
        code: {
          language: 'tsx',
          title: 'Consume Store',
          snippet: `const { state, actions } = useDemoStore();
const { counter, preferences, todos } = state;

return (
  <>
    <p>count: {counter.value}</p>
    <button onClick={actions.increment}>+1</button>
  </>
);`
        }
      },
      {
        title: 'Step 5 · 需要持久化时再局部接入',
        summary: 'Context 本身不带持久化，可在 Provider 中按白名单字段同步 localStorage。',
        bullets: ['初始化时读取本地数据恢复默认 state', 'effect 中只写回需要持久化的 key', '避免每次输入都写盘，必要时做节流']
      }
    ]
  },
  'redux-demo': {
    heading: 'Redux Demo 使用概览',
    description: 'Redux Toolkit 强项是结构化状态管理与可预测更新。建议按“Provider -> slice -> store -> selector -> 持久化”推进。',
    blocks: [
      {
        title: 'Step 1 · 声明 Provider 与 PersistGate',
        summary: '入口层先挂 Redux Provider；启用持久化时再用 PersistGate 包裹。',
        code: {
          language: 'tsx',
          title: 'Provider + PersistGate',
          snippet: `root.render(
  <Provider store={store}>
    <PersistGate loading={<p>Restoring state...</p>} persistor={persistor}>
      <ReduxDemoPage />
    </PersistGate>
  </Provider>
);`
        }
      },
      {
        title: 'Step 2 · 按领域拆分多个 slice',
        summary: '把 counter、preferences、todos 分别建 slice，再在 rootReducer 合并。',
        code: {
          language: 'ts',
          title: 'Slice Composition',
          snippet: `const rootReducer = combineReducers({
  counter: counterReducer,
  preferences: preferencesReducer,
  todos: todoReducer
});`
        }
      },
      {
        title: 'Step 3 · 配置持久化黑白名单',
        summary: '在页面里切换 persist 模式，演示只持久化局部状态或排除指定状态。',
        code: {
          language: 'ts',
          title: 'Persist Config',
          snippet: `const persistConfig = {
  key: 'redux-demo-whitelist',
  storage,
  whitelist: ['counter'] // 或改为 blacklist: ['preferences']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);`
        }
      },
      {
        title: 'Step 4 · 组件中联合使用多个 slice',
        summary: '同一组件里同时读取多个 selector，并 dispatch 不同 slice action。',
        code: {
          language: 'tsx',
          title: 'Read + Dispatch',
          snippet: `const count = useAppSelector((s) => s.counter.value);
const theme = useAppSelector((s) => s.preferences.theme);
const todoCount = useAppSelector((s) => s.todos.items.length);

dispatch(counterActions.increment());
dispatch(preferencesActions.setTheme('dark'));`
        }
      },
      {
        title: 'Step 5 · 调试建议',
        summary: '优先保证 action 命名规范和 selector 稳定，再考虑性能优化。',
        bullets: ['action type 使用领域前缀', '复杂 selector 用 reselect 缓存', '将临时 UI 状态留在组件内']
      }
    ]
  },
  'mobx-demo': {
    heading: 'MobX Demo 使用概览',
    description: 'MobX 通过 observable + action + computed 形成响应式闭环。推荐“Store 类建模 -> RootStore 注入 -> observer 消费”。',
    blocks: [
      {
        title: 'Step 1 · 声明 Demo Provider',
        summary: '在 feature 层注入 store 实例，避免影响其他功能页。',
        code: {
          language: 'tsx',
          title: 'Provider Entry',
          snippet: `export function MobxDemoProviders({ children }: PropsWithChildren) {
  const storeRef = useRef(createMobxDemoStore());
  return (
    <MobxDemoStoreContext.Provider value={storeRef.current}>
      {children}
    </MobxDemoStoreContext.Provider>
  );
}`
        }
      },
      {
        title: 'Step 2 · 定义 Store 类与 action',
        summary: '用 makeAutoObservable 建模状态与行为，建议 autoBind 防止 this 丢失。',
        code: {
          language: 'ts',
          title: 'Store Class',
          snippet: `class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  increment() {
    this.value += 1;
  }
}`
        }
      },
      {
        title: 'Step 3 · 聚合多域状态并提供持久化',
        summary: '在同一 store 中维护 counter、preferences、todos，并通过 reaction/autorun 按需落盘。',
        code: {
          language: 'ts',
          title: 'Persist Reaction',
          snippet: `reaction(
  () => ({ counter: this.counter, theme: this.preferences.theme }),
  (snapshot) => {
    localStorage.setItem('mobx-demo', JSON.stringify(snapshot));
  }
);`
        }
      },
      {
        title: 'Step 4 · observer 组件联合读取多个域',
        summary: '使用 observer 包裹组件后，读取到的 observable 字段变化会自动触发重渲染。',
        code: {
          language: 'tsx',
          title: 'Observer Usage',
          snippet: `export const SummaryPanel = observer(() => {
  const store = useMobxDemoStore();
  return (
    <p>
      count: {store.counter} | theme: {store.preferences.theme}
    </p>
  );
});`
        }
      },
      {
        title: 'Step 5 · 常见排查点',
        summary: '若 UI 不更新，先检查 observer 包裹、action 调用路径和 this 绑定。',
        bullets: ['组件必须在 render 中读取 observable 字段', '事件回调优先调用 store action', '异步更新建议 runInAction 包裹']
      }
    ]
  },
  'zustand-demo': {
    heading: 'Zustand Demo 使用概览',
    description: 'Zustand 适合轻量全局状态。推荐“createStore -> middleware(可选持久化) -> selector 消费”的最小路径。',
    blocks: [
      {
        title: 'Step 1 · 定义 store 基础状态和动作',
        summary: '先明确状态切片与 action，减少后续组件层重复逻辑。',
        code: {
          language: 'ts',
          title: 'Store Factory',
          snippet: `type DemoState = {
  count: number;
  increment: () => void;
};

const useDemoStore = create<DemoState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));`
        }
      },
      {
        title: 'Step 2 · 接入 persist 并控制持久化范围',
        summary: '通过 partialize 只持久化指定字段，可演示白名单效果。',
        code: {
          language: 'ts',
          title: 'Persist Middleware',
          snippet: `const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({ ...initialState, increment: () => set({ count: get().count + 1 }) }),
    {
      name: 'zustand-demo',
      partialize: (state) => ({ count: state.count, preferences: state.preferences })
    }
  )
);`
        }
      },
      {
        title: 'Step 3 · Provider 作用域隔离（可选）',
        summary: '若你要做实验场隔离，建议每个 feature 建独立 store 实例并通过 context 注入。',
        code: {
          language: 'tsx',
          title: 'Scoped Provider',
          snippet: `const StoreContext = createContext<StoreApi<DemoState> | null>(null);

export function ZustandDemoProviders({ children }: PropsWithChildren) {
  const storeRef = useRef(createDemoStore());
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
}`
        }
      },
      {
        title: 'Step 4 · 组件中联合订阅多个切片',
        summary: '一个组件可组合多个 selector，按需订阅，减少无关重渲染。',
        code: {
          language: 'tsx',
          title: 'Selector Composition',
          snippet: `const count = useDemoStore((s) => s.count);
const theme = useDemoStore((s) => s.preferences.theme);
const todoCount = useDemoStore((s) => s.todos.length);

const increment = useDemoStore((s) => s.increment);`
        }
      },
      {
        title: 'Step 5 · 性能与维护建议',
        summary: '保持 selector 颗粒度小、action 纯粹，避免 store 变成“巨型对象”。',
        bullets: ['高频读取字段用独立 selector', '跨域逻辑提炼为 action', '持久化字段尽量少且稳定']
      }
    ]
  },
  'recoil-demo': {
    heading: 'Recoil Demo 使用概览',
    description: 'Recoil 通过 atom/selector 做细粒度状态组合。推荐“RecoilRoot -> atom -> selector -> hooks -> 可选持久化”。',
    blocks: [
      {
        title: 'Step 1 · 在入口声明 RecoilRoot',
        summary: 'Recoil 依赖根容器，未包裹会导致所有 atom/selector hook 报错。',
        code: {
          language: 'tsx',
          title: 'Root Provider',
          snippet: `root.render(
  <RecoilRoot>
    <RecoilDemoPage />
  </RecoilRoot>
);`
        }
      },
      {
        title: 'Step 2 · 拆分 atom（源状态）',
        summary: '按领域拆 atom：counter、preferences、todos，保持读写边界清晰。',
        code: {
          language: 'ts',
          title: 'Atoms',
          snippet: `export const countAtom = atom({ key: 'count', default: 0 });
export const themeAtom = atom<ThemeMode>({ key: 'theme', default: 'light' });
export const todoAtom = atom<Todo[]>({ key: 'todo-list', default: [] });`
        }
      },
      {
        title: 'Step 3 · 用 selector 组合派生状态',
        summary: 'selector 负责派生逻辑，组件只读结果，避免重复计算。',
        code: {
          language: 'ts',
          title: 'Selector',
          snippet: `export const summarySelector = selector({
  key: 'summary',
  get: ({ get }) => {
    const count = get(countAtom);
    const todos = get(todoAtom);
    return { count, todoCount: todos.length };
  }
});`
        }
      },
      {
        title: 'Step 4 · 在同一组件联合读写多个 atom',
        summary: '组合 useRecoilState/useRecoilValue，同时操作多个状态域。',
        code: {
          language: 'tsx',
          title: 'Read + Write',
          snippet: `const [count, setCount] = useRecoilState(countAtom);
const [theme, setTheme] = useRecoilState(themeAtom);
const summary = useRecoilValue(summarySelector);

setCount((v) => v + 1);
setTheme('dark');`
        }
      },
      {
        title: 'Step 5 · 持久化可通过 atom effect',
        summary: 'Recoil 默认无持久化，可在 atom effect 中手动同步 localStorage。',
        bullets: ['onSet 时写入本地', '初始化时读取并 setSelf', '注意 key 版本兼容策略']
      }
    ]
  },
  'jotai-demo': {
    heading: 'Jotai Demo 使用概览',
    description: 'Jotai 用 atom 作为最小状态单元。推荐“基础 atom -> 派生 atom -> 写入 atom -> 组件组合消费”。',
    blocks: [
      {
        title: 'Step 1 · 声明 Provider（可选但推荐）',
        summary: '实验场里建议加 Provider，这样每个 feature 都有独立 atom scope。',
        code: {
          language: 'tsx',
          title: 'Provider Scope',
          snippet: `root.render(
  <Provider>
    <JotaiDemoPage />
  </Provider>
);`
        }
      },
      {
        title: 'Step 2 · 定义基础 atom 状态',
        summary: '把最原始的状态拆小，便于后续组合。',
        code: {
          language: 'ts',
          title: 'Primitive Atoms',
          snippet: `export const countAtom = atom(0);
export const themeAtom = atom<ThemeMode>('light');
export const todoAtom = atom<Todo[]>([]);`
        }
      },
      {
        title: 'Step 3 · 定义派生 atom 与写入 atom',
        summary: '派生 atom 管计算，写入 atom 管事务更新，组件逻辑会更干净。',
        code: {
          language: 'ts',
          title: 'Derived + Writable',
          snippet: `export const doneCountAtom = atom((get) =>
  get(todoAtom).filter((item) => item.done).length
);

export const incrementAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1);
});`
        }
      },
      {
        title: 'Step 4 · 在一个组件中组合多个 atom',
        summary: '组件可同时读取 count/theme/todos，并触发写入 atom 完成复杂更新。',
        code: {
          language: 'tsx',
          title: 'Combine Atoms',
          snippet: `const [count] = useAtom(countAtom);
const [theme, setTheme] = useAtom(themeAtom);
const doneCount = useAtomValue(doneCountAtom);
const [, increment] = useAtom(incrementAtom);

increment();
setTheme('dark');`
        }
      },
      {
        title: 'Step 5 · 持久化优先用 atomWithStorage',
        summary: 'Jotai 官方工具链提供 atomWithStorage，适合快速演示本地持久化。',
        code: {
          language: 'ts',
          title: 'atomWithStorage',
          snippet: `import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage<ThemeMode>('jotai-theme', 'light');`
        }
      }
    ]
  },
  'valtio-demo': {
    heading: 'Valtio Demo 使用概览',
    description: 'Valtio 用 proxy 提供“直接改对象”的开发体验。推荐“proxy state -> action -> snapshot -> 持久化订阅”流程。',
    blocks: [
      {
        title: 'Step 1 · 创建 proxy 状态对象',
        summary: '先定义状态结构与默认值，proxy 会自动追踪变更。',
        code: {
          language: 'ts',
          title: 'Proxy State',
          snippet: `export const state = proxy({
  count: 0,
  preferences: { theme: 'light' as ThemeMode },
  todos: [] as Todo[]
});`
        }
      },
      {
        title: 'Step 2 · 把修改逻辑收敛到 action',
        summary: '推荐定义语义化 action，避免在组件里到处直接改 state 字段。',
        code: {
          language: 'ts',
          title: 'Actions',
          snippet: `export const actions = {
  increment() {
    state.count += 1;
  },
  setTheme(theme: ThemeMode) {
    state.preferences.theme = theme;
  }
};`
        }
      },
      {
        title: 'Step 3 · 组件使用 useSnapshot 读取多个状态块',
        summary: '读取 snapshot 即可触发精准渲染，组件代码与普通对象读取接近。',
        code: {
          language: 'tsx',
          title: 'Snapshot Read',
          snippet: `const snap = useSnapshot(state);

return (
  <p>
    count: {snap.count} | theme: {snap.preferences.theme}
  </p>
);`
        }
      },
      {
        title: 'Step 4 · 通过 subscribe 做持久化同步',
        summary: 'Valtio 默认不内置持久化，可通过 subscribe 监听变化写入本地。',
        code: {
          language: 'ts',
          title: 'Subscribe Persist',
          snippet: `subscribe(state, () => {
  localStorage.setItem(
    'valtio-demo',
    JSON.stringify({ count: state.count, preferences: state.preferences })
  );
});`
        }
      },
      {
        title: 'Step 5 · 实验场中的边界建议',
        summary: '把 Valtio 仅用于该 feature 的本地交互状态，避免跨功能共享同一个全局 proxy。',
        bullets: ['每个 demo 页维护独立 state 实例', '将远程请求状态交给 React Query 更合适', '高频大对象更新注意拆分结构']
      }
    ]
  },
  'reactflow-demo': {
    heading: 'React Flow Demo 使用概览',
    description: '节点编排器建议按“初始化节点图 -> 渲染画布 -> 交互修改 -> 导出结构”实现，和 ComfyUI 的工作流心智一致。',
    blocks: [
      {
        title: 'Step 1 · 定义 nodes / edges 初始图',
        summary: '把节点和连线作为显式状态数据，后续拖拽、连线、新增节点都围绕这两份数据进行。',
        code: {
          language: 'ts',
          title: 'Graph State',
          snippet: `const initialNodes: Node[] = [...];
const initialEdges: Edge[] = [...];

const [nodes, setNodes] = useState(initialNodes);
const [edges, setEdges] = useState(initialEdges);`
        }
      },
      {
        title: 'Step 2 · 渲染节点画布并区分节点类型',
        summary: '在真实 React Flow 项目中，先用 `<ReactFlow />` 承载 nodes/edges，再按 node type 映射自定义节点组件。',
        code: {
          language: 'tsx',
          title: 'React Flow Basic Canvas',
          snippet: `import ReactFlow, { Background, Controls } from '@xyflow/react';

<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
  <Background gap={20} size={1} />
  <Controls />
</ReactFlow>;`
        }
      },
      {
        title: 'Step 3 · 接入拖拽和连线模式',
        summary: '拖拽更新节点坐标，连线模式下选取 source/target 追加 edge，形成完整工作流交互闭环。',
        code: {
          language: 'tsx',
          title: 'Drag + Connect',
          snippet: `function onConnect(connection: Connection) {
  setEdges((prev) =>
    addEdge({ ...connection, id: \`edge-\${edgeIdRef.current++}\`, animated: true }, prev)
  );
}`
        }
      },
      {
        title: 'Step 4 · 用模板快速扩展节点图',
        summary: '提供节点模板面板，让使用者快速追加 Control/Output 节点，并自动连接到当前节点。',
        bullets: ['新增节点时自动设置初始坐标', '可选自动连边减少重复操作', '保留重置和自动排版按钮']
      },
      {
        title: 'Step 5 · 输出调试信息与结构摘要',
        summary: '在 Inspector 里显示当前节点信息和图指标，便于学习调试复杂工作流。',
        bullets: ['节点数 / 边数 / 类型分布统计', '选中节点元数据展示', '可扩展为 JSON 导出/导入']
      }
    ]
  }
};
