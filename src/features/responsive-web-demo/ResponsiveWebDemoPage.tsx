import styles from './ResponsiveWebDemoPage.module.css';

const challengeCards = [
  {
    title: '超长文案与混合语言',
    detail: '处理中英混排、超长 URL、无空格长词，保证不撑破布局并保持可读性。'
  },
  {
    title: '横向密集数据区',
    detail: '在小屏下使用容器滚动与固定关键列，避免全局横向滚动。'
  },
  {
    title: '媒体比例与裁剪策略',
    detail: '不同尺寸媒体统一比例，避免图片拉伸，同时不损失关键信息。'
  },
  {
    title: '触控可达与操作密度',
    detail: '保持按钮最小可触达尺寸，并兼顾桌面端信息密度。'
  }
];

const matrixRows = [
  {
    viewport: '≥ 1280px',
    layout: '3 列主内容 + 1 列粘性导航',
    strategy: '长段落限宽，卡片网格保持视觉节奏'
  },
  {
    viewport: '768px - 1279px',
    layout: '双列主内容 + 顶部工具条',
    strategy: '模块间距压缩，保留关键对比信息'
  },
  {
    viewport: '420px - 767px',
    layout: '单列流式 + 子区域横向滚动',
    strategy: '卡片 snap 滑动 + 局部 overflow 容器'
  },
  {
    viewport: '≤ 419px',
    layout: '单列极窄模式 + 紧凑排版',
    strategy: '压缩间距、按钮全宽、标题换行保护'
  }
];

const stressText =
  'https://adaptive-long-content.example.com/really-long-slug-without-natural-breakpoints-and-embedded-token-A1B2C3D4E5F6';

const deviceCases = [
  {
    width: '320px',
    issue: '按钮组经常换行错位',
    fix: '按钮改纵向堆叠，单按钮占满可点击区'
  },
  {
    width: '360px',
    issue: '卡片标题与副标题拥挤',
    fix: '标题 text-wrap:balance，副标题字体降一级'
  },
  {
    width: '390px',
    issue: '表格信息阅读断层',
    fix: '表格转为容器滚动，并保留列最小宽度'
  },
  {
    width: '430px',
    issue: '粘性侧栏占用主内容空间',
    fix: '自动取消 sticky，侧栏改顺序流'
  }
];

const antiPatterns = [
  {
    bad: '把整页设置为 overflow-x:auto',
    good: '只让高密度子模块可横向滚动'
  },
  {
    bad: '所有断点只改 scale 缩放',
    good: '按信息结构重排布局（列 -> 行）'
  },
  {
    bad: '小屏仍保留桌面同等间距',
    good: '间距与字号分级压缩，保留视觉节奏'
  },
  {
    bad: '点击目标小于 44px',
    good: '触控区域扩展到 44px+ 并留足间距'
  }
];

const shippingChecklist = [
  '320px / 360px / 390px 真机宽度核验',
  '页面不存在全局横向滚动条',
  '键盘焦点可见且顺序正确',
  '长链接、长单词可断行且不遮挡',
  'prefers-reduced-motion 已降级动画',
  '表单控件触达面积 >= 44px',
  '图片或媒体容器有明确比例策略'
];

export default function ResponsiveWebDemoPage() {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Responsive Lab / Field Manual</p>
        <h2 className={styles.heroTitle}>一个真正用于“适配排雷”的长网页示例</h2>
        <p className={styles.heroLead}>
          这个页面专门展示在真实项目中最常见的响应式难点：长内容、数据密度、媒体比例、触控目标、粘性布局、横向滚动隔离。
          布局策略在不同断点会明确变化，不是简单缩放。你可以直接把此页当作 QA 对照样本，在设计评审和开发联调阶段逐项检查。
        </p>

        <div className={styles.heroActions}>
          <button className={styles.primaryAction} type="button">查看布局策略</button>
          <button className={styles.secondaryAction} type="button">打开移动端检查清单</button>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeadingRow}>
          <h3>01. 难点地图</h3>
          <span>Challenge Surface</span>
        </div>
        <div className={styles.challengeGrid}>
          {challengeCards.map((item) => (
            <article className={styles.challengeCard} key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeadingRow}>
          <h3>02. 断点策略矩阵</h3>
          <span>Breakpoint Matrix</span>
        </div>
        <div className={styles.matrixWrap}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th>视口宽度</th>
                <th>布局结构</th>
                <th>主要策略</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.viewport}>
                  <td>{row.viewport}</td>
                  <td>{row.layout}</td>
                  <td>{row.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.sectionSplit}>
        <div className={styles.sectionMain}>
          <div className={styles.sectionHeadingRow}>
            <h3>03. 内容应力测试</h3>
            <span>Content Stress Test</span>
          </div>

          <article className={styles.stressCard}>
            <h4>超长无空格 URL 处理</h4>
            <p className={styles.urlText}>{stressText}</p>
            <p className={styles.muted}>
              采用 `overflow-wrap:anywhere` 与最大行宽控制，确保在超小屏下也不会触发全局横向滚动。
            </p>
          </article>

          <article className={styles.stressCard}>
            <h4>媒体比例一致性</h4>
            <div className={styles.mediaGrid}>
              <div className={styles.mediaTileA}><span>16:9 主视觉</span></div>
              <div className={styles.mediaTileB}><span>1:1 缩略内容</span></div>
              <div className={styles.mediaTileC}><span>4:5 竖向内容</span></div>
            </div>
          </article>

          <article className={styles.stressCard}>
            <h4>移动端横向滚动隔离</h4>
            <p className={styles.muted}>下面的卡片轨道仅在模块内横向滚动，不影响整页。</p>
            <div className={styles.track}>
              {['Viewport-safe', 'Snap Cards', 'Touch Target 44+', 'No Global Overflow', 'Readable Rhythm', 'Dense Data Safe'].map((chip) => (
                <div className={styles.trackCard} key={chip}>
                  <strong>{chip}</strong>
                  <p>在手机宽度下验证最容易出问题的交互区。</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className={styles.sectionRail}>
          <div className={styles.railCard}>
            <h4>响应式检查要点</h4>
            <ul>
              <li>触控控件最小 44px</li>
              <li>焦点状态在键盘导航下可见</li>
              <li>不出现全局横向滚动</li>
              <li>正文行长不超过可读阈值</li>
              <li>动画遵守 reduced-motion</li>
            </ul>
          </div>

          <div className={styles.railCard}>
            <h4>复杂表单演示</h4>
            <form className={styles.formGrid}>
              <label>
                Company
                <input autoComplete="organization" name="company" placeholder="Studio Meridian…" type="text" />
              </label>
              <label>
                Team Size
                <input autoComplete="off" inputMode="numeric" name="team_size" placeholder="8 - 24…" type="text" />
              </label>
              <label className={styles.formFull}>
                Project Scope
                <textarea name="project_scope" placeholder="Describe responsive pain points in your current web UI…" rows={4} />
              </label>
              <button className={styles.primaryAction} type="button">提交适配评估</button>
            </form>
          </div>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeadingRow}>
          <h3>04. 真机宽度案例墙</h3>
          <span>Device Width Cases</span>
        </div>
        <div className={styles.deviceGrid}>
          {deviceCases.map((item) => (
            <article className={styles.deviceCard} key={item.width}>
              <p className={styles.deviceWidth}>{item.width}</p>
              <p className={styles.deviceIssue}>风险：{item.issue}</p>
              <p className={styles.deviceFix}>方案：{item.fix}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeadingRow}>
          <h3>05. 常见反模式对照</h3>
          <span>Anti-patterns</span>
        </div>

        <div className={styles.compareWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>错误做法</th>
                <th>推荐做法</th>
              </tr>
            </thead>
            <tbody>
              {antiPatterns.map((item) => (
                <tr key={item.bad}>
                  <td>{item.bad}</td>
                  <td>{item.good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeadingRow}>
          <h3>06. 交付前检查清单</h3>
          <span>Shipping Checklist</span>
        </div>
        <ol className={styles.checklist}>
          {shippingChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <footer className={styles.footerNote}>
        <p>Built for cross-width reality: 280 / 320 / 360 / 390 / 768 / 1024 / 1440.</p>
      </footer>
    </article>
  );
}
