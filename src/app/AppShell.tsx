import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { defaultFeature, featureRegistry } from '../core/feature-registry';
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

export function AppShell() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h1 className={styles.brand}>React Feature Lab</h1>
        <p className={styles.subtitle}>Independent pages for libraries and patterns.</p>

        <nav className={styles.nav}>
          {featureRegistry.map((feature) => (
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
