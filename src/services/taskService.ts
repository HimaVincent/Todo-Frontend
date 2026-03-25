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
  categoryId: number | null;
  categoryName?: string | null;
}

function formatDueAtForBackend(dueAt: string | null) {
  if (!dueAt) {
    return null;
  }

  return `${dueAt}T00:00:00`;
}

export async function createTask(task: CreateTaskRequest): Promise<TaskResponse> {
  return apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify({
      ...task,
      dueAt: formatDueAtForBackend(task.dueAt),
    }),
  });
}
