import { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar/Sidebar";
import { MainPanel } from "../../components/layout/MainPanel/MainPanel";
import { CategoryDeleteModal } from "../../components/categories/CategoryDeleteModal/CategoryDeleteModal";
import { TaskDeleteModal } from "../../components/tasks/TaskDeleteModal/TaskDeleteModal";
import styles from "./TodoPage.module.scss";
import { createTask } from "../../services/taskService";

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
  completed: boolean;
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
      completed: false,
    },
    {
      id: 2,
      title: "Submit tax form",
      categoryId: 2,
      category: "Personal",
      dueAt: null,
      filterType: "overdue",
      completed: false,
    },
  ]);

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterVariant>("all");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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

    const currentCategory = categories.find((category) => category.id === id);

    if (!currentCategory) {
      return;
    }

    const isSameName = currentCategory.name.toLowerCase() === trimmedName.toLowerCase();

    if (isSameName) {
      return;
    }

    const alreadyExists = categories.some((category) => category.name.toLowerCase() === trimmedName.toLowerCase() && category.id !== id);

    if (alreadyExists) {
      return;
    }

    setCategories((prevCategories) => prevCategories.map((category) => (category.id === id ? { ...category, name: trimmedName } : category)));

    setTasks((prevTasks) => prevTasks.map((task) => (task.categoryId === id ? { ...task, category: trimmedName } : task)));
  };

  const handleAddTask = (newTask: NewTaskInput) => {
    const category = categories.find((c) => c.id === newTask.categoryId);

    const taskToAdd: Task = {
      id: Date.now(),
      title: newTask.title,
      categoryId: newTask.categoryId,
      category: category ? category.name : "Uncategorised",
      dueAt: newTask.dueAt,
      description: newTask.notes ?? undefined,
      filterType: "all",
      completed: false,
    };

    setTasks((prevTasks) => [taskToAdd, ...prevTasks]);
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

  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTaskToDelete(task);
  };

  const handleConfirmDeleteTask = () => {
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id));
    setTaskToDelete(null);
  };

  const handleCancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  const handleSetTaskToToday = (taskId: number) => {
    const today = new Date().toISOString().split("T")[0];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              dueAt: today,
            }
          : task,
      ),
    );
  };

  const handleDuplicateTask = (taskId: number) => {
    const taskToDuplicate = tasks.find((task) => task.id === taskId);

    if (!taskToDuplicate) {
      return;
    }

    const duplicatedTask: Task = {
      ...taskToDuplicate,
      id: Date.now(),
      title: taskToDuplicate.title,
    };

    setTasks((prevTasks) => [duplicatedTask, ...prevTasks]);
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
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
          onCategoryChange={setActiveCategoryId}
          onDeleteTask={handleDeleteTask}
          onSetTaskToToday={handleSetTaskToToday}
          onDuplicateTask={handleDuplicateTask}
          onToggleComplete={handleToggleComplete}
        />
      </div>

      {categoryToDelete ? (
        <CategoryDeleteModal categoryName={categoryToDelete.name} onClose={handleCancelDeleteCategory} onConfirm={handleConfirmDeleteCategory} />
      ) : null}
      {taskToDelete ? <TaskDeleteModal taskTitle={taskToDelete.title} onClose={handleCancelDeleteTask} onConfirm={handleConfirmDeleteTask} /> : null}
    </div>
  );
}
