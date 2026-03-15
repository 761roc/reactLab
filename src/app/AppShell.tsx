import { useEffect, useMemo, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { defaultFeature, featureRegistry } from '../core/feature-registry';
import type { FeatureCategory } from '../core/feature-types';
import { FeatureHost } from './FeatureHost';
import styles from './AppShell.module.css';

function HomeRedirect() {
  return <Navigate to={defaultFeature.routePath} replace />;
}

function NotFound() {
  return (
    <section className={styles.notFound}>
      <h2>Feature Not Found</h2>
      <p>Pick a module from the left navigation to continue.</p>
    </section>
  );
}

const categoryOrder: FeatureCategory[] = ['css', 'react', 'components'];

const categoryMeta: Record<FeatureCategory, { title: string; note: string }> = {
  css: {
    title: 'CSS 目录',
    note: '样式与 UI 库'
  },
  react: {
    title: 'React 目录',
    note: '状态管理与数据流'
  },
  components: {
    title: '组件示例组',
    note: '可视化组件与节点编排'
  }
};

export function AppShell() {
  const location = useLocation();
  const [expandedCategory, setExpandedCategory] = useState<FeatureCategory | null>(null);

  const groupedFeatures = useMemo(
    () =>
      categoryOrder
        .map((category) => ({
          category,
          ...categoryMeta[category],
          items: featureRegistry.filter((feature) => feature.category === category)
        }))
        .filter((group) => group.items.length > 0),
    []
  );

  const activeFeature = useMemo(
    () =>
      featureRegistry.find(
        (feature) =>
          location.pathname === feature.routePath ||
          location.pathname.startsWith(`${feature.routePath}/`)
      ),
    [location.pathname]
  );

  useEffect(() => {
    if (activeFeature) {
      setExpandedCategory(activeFeature.category);
    }
  }, [activeFeature]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h1 className={styles.brand}>React Feature Lab</h1>
        <p className={styles.subtitle}>Independent pages for libraries and patterns.</p>

        <nav className={styles.nav}>
          {groupedFeatures.map((group) => (
            <section className={styles.navGroup} key={group.category}>
              <button
                aria-expanded={expandedCategory === group.category}
                className={`${styles.navGroupToggle} ${expandedCategory === group.category ? styles.navGroupToggleOpen : ''}`}
                onClick={() =>
                  setExpandedCategory((prev) =>
                    prev === group.category ? null : group.category
                  )
                }
                type="button"
              >
                <div className={styles.navGroupHeader}>
                  <p>{group.title}</p>
                  <span>{group.note}</span>
                </div>
                <span className={styles.navGroupChevron}>▾</span>
              </button>

              {expandedCategory === group.category ? (
                <div className={styles.navGroupItems}>
                  {group.items.map((feature) => (
                    <NavLink
                      key={feature.id}
                      className={({ isActive }) =>
                        `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                      }
                      to={feature.routePath}
                    >
                      <strong>{feature.title}</strong>
                      <span>{feature.tags.join(' / ')}</span>
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>
        <Routes>
          <Route element={<HomeRedirect />} path="/" />
          <Route element={<FeatureHost />} path="/features/:featureId" />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </main>
    </div>
  );
}
