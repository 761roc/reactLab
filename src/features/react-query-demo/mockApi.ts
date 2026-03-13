export interface Profile {
  id: number;
  name: string;
  role: string;
  team: string;
}

export interface ProjectItem {
  id: number;
  name: string;
  owner: string;
  status: 'active' | 'review' | 'paused';
}

export interface ProjectPage {
  items: ProjectItem[];
  page: number;
  totalPages: number;
}

export interface ProjectDetail extends ProjectItem {
  description: string;
  updatedAt: string;
}

export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

const projects: ProjectItem[] = Array.from({ length: 14 }, (_, index) => {
  const id = index + 1;
  const statuses: Array<ProjectItem['status']> = ['active', 'review', 'paused'];
  return {
    id,
    name: `Query Project ${id}`,
    owner: id % 2 === 0 ? 'Frontend Team' : 'Platform Team',
    status: statuses[id % statuses.length]
  };
});

let todos: TodoItem[] = [
  { id: 1, text: '接入基础 useQuery', done: true },
  { id: 2, text: '演示分页缓存行为', done: false },
  { id: 3, text: '演示 optimistic update', done: false }
];

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchProfile(): Promise<Profile> {
  await wait(380);
  return {
    id: 1001,
    name: 'Annie Chen',
    role: 'Frontend Engineer',
    team: 'Growth Platform'
  };
}

export async function fetchProjects(page: number, pageSize = 4): Promise<ProjectPage> {
  await wait(500);
  const totalPages = Math.ceil(projects.length / pageSize);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = projects.slice(start, start + pageSize);

  return {
    items,
    page: safePage,
    totalPages
  };
}

export async function fetchProjectDetail(projectId: number): Promise<ProjectDetail> {
  await wait(430);
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  return {
    ...project,
    description: `Project ${projectId} focuses on query cache and data orchestration practices.`,
    updatedAt: new Date(Date.now() - projectId * 3600_000).toLocaleString()
  };
}

export async function fetchTodos(): Promise<TodoItem[]> {
  await wait(340);
  return todos.map((item) => ({ ...item }));
}

export async function toggleTodo(todoId: number): Promise<TodoItem> {
  await wait(280);
  const target = todos.find((item) => item.id === todoId);
  if (!target) {
    throw new Error('Todo not found');
  }

  target.done = !target.done;
  return { ...target };
}
