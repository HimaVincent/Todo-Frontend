import { apiRequest } from "./api";

export interface CreateTaskRequest {
  title: string;
  categoryId: number | null;
  dueAt: string | null;
  notes: string | null;
}

export interface TaskResponse {
  id: number;
  title: string;
  notes?: string | null;
  dueAt: string | null;
  completed?: boolean;
  completedAt?: string | null;
  categoryId: number | null;
  categoryName?: string | null;
}

export interface Task {
  id: number;
  title: string;
  categoryId: number | null;
  category: string;
  dueAt: string | null;
  description?: string;
  completed: boolean;
  completedAt?: string | null;
}

function formatDueAtForBackend(dueAt: string | null) {
  if (!dueAt) {
    return null;
  }

  return `${dueAt}T00:00:00`;
}

function formatDueAtForFrontend(dueAt: string | null) {
  if (!dueAt) {
    return null;
  }

  return dueAt.split("T")[0];
}

function mapTaskResponseToTask(task: TaskResponse): Task {
  return {
    id: task.id,
    title: task.title,
    categoryId: task.categoryId,
    category: task.categoryName ?? "Uncategorised",
    dueAt: formatDueAtForFrontend(task.dueAt),
    description: task.notes ?? undefined,
    completed: task.completed ?? false,
    completedAt: task.completedAt ?? null,
  };
}

export async function getTasks(): Promise<Task[]> {
  const tasks = await apiRequest("/tasks");
  return tasks.map(mapTaskResponseToTask);
}

export async function createTask(task: CreateTaskRequest): Promise<Task> {
  const createdTask = await apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify({
      ...task,
      dueAt: formatDueAtForBackend(task.dueAt),
    }),
  });

  return mapTaskResponseToTask(createdTask);
}

export async function updateTask(taskId: number, task: Partial<CreateTaskRequest>): Promise<Task> {
  const updatedTask = await apiRequest(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...task,
      dueAt: formatDueAtForBackend(task.dueAt ?? null),
    }),
  });

  return mapTaskResponseToTask(updatedTask);
}

export async function updateTaskCompletion(taskId: number, completed: boolean): Promise<Task> {
  const updatedTask = await apiRequest(`/tasks/${taskId}/completion`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });

  return mapTaskResponseToTask(updatedTask);
}

export async function deleteTask(taskId: number): Promise<void> {
  await apiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}
