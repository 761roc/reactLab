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

const categoryOrder: FeatureCategory[] = [
  "css",
  "react",
  "components",
  "content",
  "browser",
  "engineering",
  "scenario",
  "reactInterview",
  "reactMechanism",
  "vueInterview",
  "interviewHistory",
];

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
    title: "JS内容",
    note: "JavaScript 机制与面试题",
  },
  browser: {
    title: "浏览器专题",
    note: "网络、渲染、存储与安全",
  },
  engineering: {
    title: "工程化",
    note: "构建、质量、发布与优化",
  },
  scenario: {
    title: "场景题",
    note: "排查、优化、重构与系统设计",
  },
  reactInterview: {
    title: "React面试",
    note: "状态、Hooks、渲染与性能",
  },
  reactMechanism: {
    title: "面试-React机制",
    note: "更新、调和、Hooks 与渲染流程",
  },
  vueInterview: {
    title: "VUE",
    note: "基础概念、API 与高频面试题",
  },
  interviewHistory: {
    title: "面试史",
    note: "公司题目记录与详解",
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
        .map((category) => {
          const items = featureRegistry.filter(
            (feature) => feature.category === category,
          );
          const directItems = items.filter((feature) => !feature.navSection);
          const sectionMap = new Map<string, typeof items>();

          items
            .filter((feature) => feature.navSection)
            .forEach((feature) => {
              const section = feature.navSection as string;
              const existing = sectionMap.get(section);

              if (existing) {
                existing.push(feature);
                return;
              }

              sectionMap.set(section, [feature]);
            });

          return {
            category,
            ...categoryMeta[category],
            directItems,
            sections: Array.from(sectionMap.entries()).map(
              ([title, sectionItems]) => ({
                title,
                items: sectionItems,
              }),
            ),
            items,
          };
        })
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
    const updateViewportMode = (
      event: MediaQueryList | MediaQueryListEvent,
    ) => {
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
                    {group.directItems.map((feature) => (
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
                    {group.sections.map((section) => (
                      <div className={styles.navSubgroup} key={section.title}>
                        <div className={styles.navSubgroupHeader}>
                          <strong>{section.title}</strong>
                          <span>{section.items.length} 个主题</span>
                        </div>
                        <div className={styles.navSubgroupItems}>
                          {section.items.map((feature) => (
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
                      </div>
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
            aria-label={
              isCompactViewport
                ? "关闭侧边导航"
                : isSidebarExpanded
                  ? "收起侧边导航"
                  : "展开侧边导航"
            }
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
