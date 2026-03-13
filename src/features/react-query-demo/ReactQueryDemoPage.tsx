import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import {
  fetchProfile,
  fetchProjectDetail,
  fetchProjects,
  fetchTodos,
  toggleTodo,
  type ProjectItem,
  type TodoItem
} from './mockApi';
import styles from './ReactQueryDemoPage.module.css';

export default function ReactQueryDemoPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const profileQuery = useQuery({
    queryKey: ['rq', 'profile'],
    queryFn: fetchProfile,
    staleTime: 25_000
  });

  const projectsQuery = useQuery({
    queryKey: ['rq', 'projects', page],
    queryFn: () => fetchProjects(page),
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (!selectedProjectId && projectsQuery.data?.items.length) {
      setSelectedProjectId(projectsQuery.data.items[0].id);
    }
  }, [projectsQuery.data?.items, selectedProjectId]);

  const projectDetailQuery = useQuery({
    queryKey: ['rq', 'projectDetail', selectedProjectId],
    queryFn: () => fetchProjectDetail(selectedProjectId as number),
    enabled: selectedProjectId !== null
  });

  const todosQuery = useQuery({
    queryKey: ['rq', 'todos'],
    queryFn: fetchTodos
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['rq', 'todos'] });
      const previousTodos = queryClient.getQueryData<TodoItem[]>(['rq', 'todos']);

      queryClient.setQueryData<TodoItem[]>(['rq', 'todos'], (current) =>
        (current ?? []).map((item) =>
          item.id === todoId
            ? {
                ...item,
                done: !item.done
              }
            : item
        )
      );

      return { previousTodos };
    },
    onError: (_error, _todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['rq', 'todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rq', 'todos'] });
    }
  });

  const currentProjects = projectsQuery.data?.items ?? [];
  const pageInfo = projectsQuery.data;

  const scenarioHints = useMemo(
    () => [
      '基础查询：loading / error / staleTime / refetch',
      '分页：queryKey 带页码 + keepPreviousData 减少闪烁',
      '依赖查询：enabled 控制请求时机',
      '变更：useMutation + optimistic update + rollback'
    ],
    []
  );

  return (
    <div className={styles.wrapper}>
      <header>
        <h2 className={styles.title}>React Query playground</h2>
        <p className={styles.note}>Focus on server-state use cases instead of general client-state patterns.</p>
      </header>

      <SectionCard note="用意：基础 useQuery（请求状态、缓存与手动刷新）。" title="场景 1：用户资料查询（基础查询）">
        <div className={styles.row}>
          {profileQuery.isLoading ? <p>Loading profile...</p> : null}
          {profileQuery.isError ? <p className={styles.error}>Failed: {(profileQuery.error as Error).message}</p> : null}
          {profileQuery.data ? (
            <div className={styles.infoCard}>
              <p>
                <strong>{profileQuery.data.name}</strong> · {profileQuery.data.role}
              </p>
              <p>
                Team: <strong>{profileQuery.data.team}</strong>
              </p>
            </div>
          ) : null}
        </div>
        <button className={styles.buttonGhost} onClick={() => profileQuery.refetch()} type="button">
          手动刷新 profile
        </button>
      </SectionCard>

      <SectionCard note="用意：页码进入 queryKey，配合 keepPreviousData 平滑翻页。" title="场景 2：项目分页查询（分页缓存）">
        <div className={styles.actions}>
          <button className={styles.buttonGhost} disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)} type="button">
            Prev
          </button>
          <span className={styles.metaText}>
            Page {pageInfo?.page ?? page} / {pageInfo?.totalPages ?? '-'}
          </span>
          <button
            className={styles.buttonGhost}
            disabled={Boolean(pageInfo && page >= pageInfo.totalPages)}
            onClick={() => setPage((prev) => prev + 1)}
            type="button"
          >
            Next
          </button>
          {projectsQuery.isPlaceholderData ? <span className={styles.metaText}>Using placeholder cache...</span> : null}
        </div>

        <ul className={styles.projectList}>
          {currentProjects.map((project: ProjectItem) => (
            <li key={project.id}>
              <button className={styles.projectItem} onClick={() => setSelectedProjectId(project.id)} type="button">
                <strong>{project.name}</strong>
                <span>
                  {project.owner} · {project.status}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard note="用意：依赖查询（enabled）在选择项目后再请求详情。" title="场景 3：项目详情查询（依赖查询）">
        {!selectedProjectId ? <p>请选择一个项目触发详情查询。</p> : null}
        {projectDetailQuery.isPending ? <p>Loading detail...</p> : null}
        {projectDetailQuery.isError ? <p className={styles.error}>Failed: {(projectDetailQuery.error as Error).message}</p> : null}
        {projectDetailQuery.data ? (
          <div className={styles.infoCard}>
            <p>
              <strong>{projectDetailQuery.data.name}</strong> ({projectDetailQuery.data.status})
            </p>
            <p>{projectDetailQuery.data.description}</p>
            <p>Updated: {projectDetailQuery.data.updatedAt}</p>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard note="用意：useMutation + optimistic update + 失效重取。" title="场景 4：任务状态变更（乐观更新）">
        {todosQuery.isLoading ? <p>Loading todos...</p> : null}
        {todosQuery.isError ? <p className={styles.error}>Failed to load todos.</p> : null}

        <ul className={styles.todoList}>
          {(todosQuery.data ?? []).map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <span className={todo.done ? styles.todoDone : ''}>{todo.text}</span>
              <button
                className={styles.button}
                disabled={toggleMutation.isPending}
                onClick={() => toggleMutation.mutate(todo.id)}
                type="button"
              >
                toggle
              </button>
            </li>
          ))}
        </ul>

        <button className={styles.buttonGhost} onClick={() => queryClient.invalidateQueries({ queryKey: ['rq'] })} type="button">
          手动失效全部 React Query 缓存
        </button>
      </SectionCard>

      <SectionCard note="用意：总结 React Query 的典型落地点。" title="场景地图（你该在何时使用）">
        <ul className={styles.hintList}>
          {scenarioHints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
