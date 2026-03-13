import { useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import styles from './TailwindDemoPage.module.css';

const toneOptions = [
  { id: 'calm', label: 'Calm', palette: 'from-cyan-100 to-sky-100 text-sky-900' },
  { id: 'warm', label: 'Warm', palette: 'from-amber-100 to-orange-100 text-orange-900' },
  { id: 'mono', label: 'Mono', palette: 'from-slate-200 to-slate-100 text-slate-900' }
] as const;

export default function TailwindDemoPage() {
  const [activeTone, setActiveTone] = useState<(typeof toneOptions)[number]['id']>('calm');

  const selectedTone = toneOptions.find((item) => item.id === activeTone)!;

  return (
    <div className={styles.wrapper}>
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tailwind playground</h2>
        <p className="mt-2 text-slate-600">This page demonstrates utility-first rendering with feature-local CSS modules.</p>
      </header>

      <SectionCard
        note="用意：演示 arbitrary value、渐变、before/after 伪元素和复杂阴影。"
        title="块 1：视觉容器组合（复杂样式表达）"
      >
        <div className="mt-3 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_40px_-18px_rgba(2,132,199,0.45)] before:absolute before:-right-20 before:-top-16 before:h-40 before:w-40 before:rounded-full before:bg-cyan-200/40 before:blur-2xl after:absolute after:-bottom-16 after:left-16 after:h-36 after:w-36 after:rounded-full after:bg-violet-200/50 after:blur-2xl">
            <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pattern Token</p>
            <h3 className="relative mt-2 text-xl font-bold text-slate-900">Glass-like Hero Card</h3>
            <p className="relative mt-2 max-w-[42ch] text-sm leading-6 text-slate-600">
              Tailwind 支持在同一个 className 内组合伪元素、光晕、任意阴影值和局部布局约束。
            </p>
            <div className="relative mt-4 flex gap-2">
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs text-cyan-700">before/after</span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700">arbitrary shadow</span>
            </div>
          </article>
          <aside className="grid gap-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">Blend Layer</p>
              <p className="mt-1 text-sm text-emerald-900/80">渐变、透明度和 blur 组合可以快速构建装饰层。</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-700">Arbitrary Grid</p>
              <p className="mt-1 text-sm text-indigo-900/80">示例使用了 `lg:grid-cols-[1.2fr_0.8fr]` 的自定义列宽。</p>
            </div>
          </aside>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示 group/peer 思想和基于状态的 class 切换。" title="块 2：状态驱动样式（交互反馈）">
        <div className="mt-3 flex flex-wrap gap-3">
          {toneOptions.map((tone) => {
            const active = tone.id === activeTone;
            return (
              <button
                key={tone.id}
                className={`group rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                }`}
                onClick={() => setActiveTone(tone.id)}
                type="button"
              >
                {tone.label}
                <span
                  className={`ml-2 inline-block h-2.5 w-2.5 rounded-full bg-current ${
                    active ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <div className={`mt-4 rounded-2xl bg-gradient-to-r p-5 ${selectedTone.palette}`}>
          <p className="text-xs uppercase tracking-[0.12em] opacity-75">Active tone</p>
          <p className="mt-2 text-lg font-bold">{selectedTone.label} palette enabled</p>
          <p className="mt-1 text-sm opacity-80">同一结构，通过状态切换 class 组合得到不同视觉。</p>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示响应式断点、顺序变化和网格重排。" title="块 3：响应式组合（同一 DOM 多端布局）">
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="order-2 rounded-xl border border-slate-200 p-4 sm:order-1">
            <p className="text-sm font-semibold text-slate-900">Card 01</p>
            <p className="mt-1 text-sm text-slate-600">小屏优先排序可通过 order 改变阅读路径。</p>
          </div>
          <div className="order-1 rounded-xl border border-slate-200 p-4 sm:order-2 lg:col-span-2">
            <p className="text-sm font-semibold text-slate-900">Card 02 (wide)</p>
            <p className="mt-1 text-sm text-slate-600">在大屏横向扩展为双列，展示相同内容的不同排布策略。</p>
          </div>
          <div className="order-3 rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Card 03</p>
            <p className="mt-1 text-sm text-slate-600">用 `sm` / `lg` 即可拆分布局行为。</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示表单状态样式（focus/invalid/disabled）和可访问性提示。" title="块 4：表单交互（状态样式细节）">
        <form className="mt-3 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              className="peer rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 invalid:border-rose-400 invalid:text-rose-700"
              defaultValue=""
              placeholder="name@example.com"
              required
              type="email"
            />
            <span className="hidden text-xs text-rose-600 peer-invalid:block">请输入合法的 email。</span>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Readonly token</span>
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
              defaultValue="TW-LAB-2026"
              readOnly
              type="text"
            />
            <span className="text-xs text-slate-500">展示 disabled/readonly 的视觉差异和语义。</span>
          </label>
        </form>
      </SectionCard>

      <SectionCard note="用意：说明 feature 层样式隔离策略。" title="块 5：Scoped Styles（CSS Module）">
        <div className={styles.pillRow}>
          <span className={styles.pill}>tailwind</span>
          <span className={styles.pill}>css module</span>
          <span className={styles.pill}>isolated</span>
          <span className={styles.pill}>feature boundary</span>
          <span className={styles.pill}>no cross-coupling</span>
        </div>
      </SectionCard>
    </div>
  );
}
