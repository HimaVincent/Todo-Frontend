import { apiRequest } from "./api";

export interface Category {
  id: number;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  return apiRequest("/categories");
}

export async function createCategory(name: string): Promise<Category> {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory(categoryId: number, name: string): Promise<Category> {
  return apiRequest(`/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory(categoryId: number, mode: "keep_tasks" | "delete_all_tasks"): Promise<void> {
  await apiRequest(`/categories/${categoryId}?mode=${mode}`, {
    method: "DELETE",
  });
}
