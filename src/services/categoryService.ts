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
