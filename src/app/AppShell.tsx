import { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { defaultFeature, featureRegistry } from "../core/feature-registry";
import type { FeatureCategory } from "../core/feature-types";
import { FeatureHost } from "./FeatureHost";
import styles from "./AppShell.module.css";

const compactViewportQuery = "(max-width: 920px)";

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

const categoryOrder: FeatureCategory[] = ["css", "react", "components", "content"];

const categoryMeta: Record<FeatureCategory, { title: string; note: string }> = {
  css: {
    title: "CSS 目录",
    note: "样式与 UI 库",
  },
  react: {
    title: "React 目录",
    note: "状态管理与数据流",
  },
  components: {
    title: "组件示例组",
    note: "可视化组件与节点编排",
  },
  content: {
    title: "内容整理",
    note: "知识梳理与模式归档",
  },
};

export function AppShell() {
  const location = useLocation();
  const [expandedCategory, setExpandedCategory] =
    useState<FeatureCategory | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(compactViewportQuery).matches;
  });
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] =
    useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const groupedFeatures = useMemo(
    () =>
      categoryOrder
        .map((category) => ({
          category,
          ...categoryMeta[category],
          items: featureRegistry.filter(
            (feature) => feature.category === category,
          ),
        }))
        .filter((group) => group.items.length > 0),
    [],
  );

  const activeFeature = useMemo(
    () =>
      featureRegistry.find(
        (feature) =>
          location.pathname === feature.routePath ||
          location.pathname.startsWith(`${feature.routePath}/`),
      ),
    [location.pathname],
  );
  const isSidebarExpanded = isCompactViewport
    ? isMobileSidebarOpen
    : isDesktopSidebarExpanded;

  useEffect(() => {
    if (activeFeature) {
      setExpandedCategory(activeFeature.category);
    }
  }, [activeFeature]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(compactViewportQuery);
    const updateViewportMode = (event: MediaQueryList | MediaQueryListEvent) => {
      const matches = "matches" in event ? event.matches : mediaQuery.matches;

      setIsCompactViewport(matches);
      setIsMobileSidebarOpen(false);
    };

    updateViewportMode(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewportMode);

      return () => mediaQuery.removeEventListener("change", updateViewportMode);
    }

    mediaQuery.addListener(updateViewportMode);

    return () => mediaQuery.removeListener(updateViewportMode);
  }, []);

  useEffect(() => {
    if (isCompactViewport) {
      setIsMobileSidebarOpen(false);
    }
  }, [isCompactViewport, location.pathname]);

  useEffect(() => {
    if (!isSidebarExpanded || typeof window === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isCompactViewport) {
          setIsMobileSidebarOpen(false);
          return;
        }

        setIsDesktopSidebarExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompactViewport, isSidebarExpanded]);

  const toggleSidebar = () => {
    if (isCompactViewport) {
      setIsMobileSidebarOpen((prev) => !prev);
      return;
    }

    setIsDesktopSidebarExpanded((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div
      className={`${styles.layout} ${!isCompactViewport && !isSidebarExpanded ? styles.layoutSidebarCollapsed : ""} ${isCompactViewport ? styles.layoutCompact : ""}`}
    >
      {isCompactViewport && isSidebarExpanded ? (
        <button
          aria-label="关闭导航面板"
          className={styles.sidebarBackdrop}
          onClick={closeMobileSidebar}
          type="button"
        />
      ) : null}

      <aside
        className={`${styles.sidebar} ${isSidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed} ${isCompactViewport ? styles.sidebarCompact : ""}`}
        id="app-shell-sidebar"
      >
        <div className={styles.sidebarPanel}>
          <h1 className={styles.brand}>React 功能试验区</h1>
          <p className={styles.subtitle}>
            Independent pages for libraries and patterns.
          </p>

          <nav className={styles.nav}>
            {groupedFeatures.map((group) => (
              <section className={styles.navGroup} key={group.category}>
                <button
                  aria-expanded={expandedCategory === group.category}
                  className={`${styles.navGroupToggle} ${expandedCategory === group.category ? styles.navGroupToggleOpen : ""}`}
                  onClick={() =>
                    setExpandedCategory((prev) =>
                      prev === group.category ? null : group.category,
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
                          `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                        }
                        onClick={() => {
                          if (isCompactViewport) {
                            closeMobileSidebar();
                          }
                        }}
                        to={feature.routePath}
                      >
                        <strong>{feature.title}</strong>
                        <span>{feature.tags.join(" / ")}</span>
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <button
            aria-controls="app-shell-sidebar"
            aria-expanded={isSidebarExpanded}
            aria-label={isCompactViewport ? "关闭侧边导航" : isSidebarExpanded ? "收起侧边导航" : "展开侧边导航"}
            className={styles.sidebarHandle}
            onClick={toggleSidebar}
            type="button"
          >
            <span className={styles.sidebarHandleIcon}>
              {isCompactViewport ? "×" : isSidebarExpanded ? "‹" : "›"}
            </span>
            <span className={styles.sidebarHandleText}>
              {isCompactViewport
                ? "关闭菜单"
                : isSidebarExpanded
                  ? "收起导航"
                  : "展开导航"}
            </span>
          </button>
        </div>
      </aside>

      <main
        className={`${styles.content} ${isCompactViewport ? styles.contentCompact : ""}`}
      >
        {isCompactViewport ? (
          <div className={styles.mobileTopbar}>
            <button
              aria-controls="app-shell-sidebar"
              aria-expanded={isSidebarExpanded}
              aria-label={isSidebarExpanded ? "关闭侧边导航" : "打开侧边导航"}
              className={styles.mobileMenuButton}
              onClick={toggleSidebar}
              type="button"
            >
              <span className={styles.mobileMenuIcon}>☰</span>
              <span>菜单</span>
            </button>
            <div className={styles.mobileTopbarMeta}>
              <strong>{activeFeature?.title ?? "React 功能试验区"}</strong>
              <span>{activeFeature?.description ?? "Feature navigation"}</span>
            </div>
          </div>
        ) : null}

        <Routes>
          <Route element={<HomeRedirect />} path="/" />
          <Route element={<FeatureHost />} path="/features/:featureId" />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </main>
    </div>
  );
}
