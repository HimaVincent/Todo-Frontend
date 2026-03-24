import { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar/Sidebar";
import { MainPanel } from "../../components/layout/MainPanel/MainPanel";
import { CategoryDeleteModal } from "../../components/categories/CategoryDeleteModal/CategoryDeleteModal";
import styles from "./TodoPage.module.scss";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";
type CategoryDeleteMode = "keep_tasks" | "delete_all_tasks";

interface Category {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  categoryId: number | null;
  category: string;
  dueAt: string | null;
  description?: string;
  filterType: string;
}

interface NewTaskInput {
  title: string;
  categoryId: number | null;
  dueAt: string | null;
  notes: string | null;
}

export function TodoPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Shopping" },
    { id: 2, name: "Personal" },
    { id: 3, name: "Study" },
    { id: 4, name: "Work" },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Buy Skye Shoes",
      categoryId: 1,
      category: "Shopping",
      dueAt: "2026-03-16",
      filterType: "today",
    },
    {
      id: 2,
      title: "Submit tax form",
      categoryId: 2,
      category: "Personal",
      dueAt: null,
      filterType: "overdue",
    },
  ]);

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterVariant>("all");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleAddCategory = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    const alreadyExists = categories.some((category) => category.name.toLowerCase() === trimmedName.toLowerCase());
    if (alreadyExists) {
      return;
    }

    const newCategory: Category = {
      id: Date.now(),
      name: trimmedName,
    };
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleRenameCategory = (id: number, newName: string) => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      return;
    }

    const alreadyExists = categories.some((category) => category.name.toLowerCase() === trimmedName.toLowerCase() && category.id !== id);

    if (alreadyExists) {
      return;
    }

    // update categories
    setCategories((prevCategories) => prevCategories.map((category) => (category.id === id ? { ...category, name: trimmedName } : category)));

    // sync tasks
    setTasks((prevTasks) => prevTasks.map((task) => (task.categoryId === id ? { ...task, category: trimmedName } : task)));
  };

  const handleAddTask = (newTask: NewTaskInput) => {
    const matchedCategory = categories.find((category) => category.id === newTask.categoryId);

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      categoryId: matchedCategory ? matchedCategory.id : null,
      category: matchedCategory ? matchedCategory.name : "Uncategorised",
      description: newTask.notes || undefined,
      dueAt: newTask.dueAt,
      filterType: "unscheduled",
    };

    setTasks((prevTasks) => [task, ...prevTasks]);
  };

  const handleDeleteCategoryClick = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleCancelDeleteCategory = () => {
    setCategoryToDelete(null);
  };

  const handleConfirmDeleteCategory = (mode: CategoryDeleteMode) => {
    if (!categoryToDelete) {
      return;
    }

    const deletedCategoryId = categoryToDelete.id;

    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== deletedCategoryId));

    if (mode === "keep_tasks") {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.categoryId === deletedCategoryId
            ? {
                ...task,
                categoryId: null,
                category: "Uncategorised",
              }
            : task,
        ),
      );
    }

    if (mode === "delete_all_tasks") {
      setTasks((prevTasks) => prevTasks.filter((task) => task.categoryId !== deletedCategoryId));
    }

    if (activeCategoryId === deletedCategoryId) {
      setActiveCategoryId(null);
    }

    setCategoryToDelete(null);
  };

  return (
    <div className={styles["todo-page"]}>
      <div className={styles["todo-page__container"]}>
        <Sidebar
          activeFilter={activeFilter}
          onChange={setActiveFilter}
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategoryClick}
          onRenameCategory={handleRenameCategory}
        />

        <MainPanel
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          categories={categories}
          activeCategoryId={activeCategoryId}
          tasks={tasks}
          onAddTask={handleAddTask}
        />
      </div>

      {categoryToDelete ? (
        <CategoryDeleteModal categoryName={categoryToDelete.name} onClose={handleCancelDeleteCategory} onConfirm={handleConfirmDeleteCategory} />
      ) : null}
    </div>
  );
}
