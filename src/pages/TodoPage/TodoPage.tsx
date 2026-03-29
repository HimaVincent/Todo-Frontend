import { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar/Sidebar";
import { MainPanel } from "../../components/layout/MainPanel/MainPanel";
import { CategoryDeleteModal } from "../../components/categories/CategoryDeleteModal/CategoryDeleteModal";
import { TaskDeleteModal } from "../../components/tasks/TaskDeleteModal/TaskDeleteModal";
import { TaskForm } from "../../components/tasks/TaskForm/TaskForm";
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

      completed: false,
    },
    {
      id: 2,
      title: "Submit tax form",
      categoryId: 2,
      category: "Personal",
      dueAt: null,

      completed: false,
    },
    {
      id: 3,
      title: "Prepare project demo",
      categoryId: 2,
      category: "Work",
      dueAt: "2026-03-20",

      completed: false,
    },
    {
      id: 4,
      title: "Grocery shopping for dinner",
      categoryId: 1,
      category: "Shopping",
      dueAt: "2026-03-16",

      completed: false,
    },
    {
      id: 5,
      title: "Morning workout",
      categoryId: 3,
      category: "Health",
      dueAt: null,

      completed: false,
    },
    {
      id: 6,
      title: "Call bank regarding account issue",
      categoryId: 2,
      category: "Personal",
      dueAt: "2026-03-14",

      completed: false,
    },
    {
      id: 7,
      title: "Watch React tutorial",
      categoryId: 4,
      category: "Learning",
      dueAt: "2026-03-18",

      completed: false,
    },
  ]);

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterVariant>("all");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDuplicate, setTaskToDuplicate] = useState<Task | null>(null);

  const handleAddCategory = (name: string): Category | null => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const alreadyExists = categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase());

    if (alreadyExists) return null;

    const newCategory: Category = {
      id: Date.now(),
      name: trimmedName,
    };

    setCategories((prev) => [...prev, newCategory]);

    return newCategory;
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

  const handleOpenAddTask = () => setIsAddTaskOpen(true);
  const handleCloseAddTask = () => setIsAddTaskOpen(false);

  const handleAddTask = (newTask: NewTaskInput) => {
    const category = categories.find((c) => c.id === newTask.categoryId);

    const taskToAdd: Task = {
      id: Date.now(),
      title: newTask.title,
      categoryId: newTask.categoryId,
      category: category ? category.name : "Uncategorised",
      dueAt: newTask.dueAt,
      description: newTask.notes ?? undefined,
      completed: false,
    };

    setTasks((prevTasks) => [taskToAdd, ...prevTasks]);
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
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTaskToDuplicate(task);
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTaskToEdit(task);
  };

  const handleUpdateTask = (updatedTaskData: any) => {
    if (!taskToEdit) return;

    const category = categories.find((c) => c.id === updatedTaskData.categoryId);

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskToEdit.id
          ? {
              ...task,
              title: updatedTaskData.title,
              categoryId: updatedTaskData.categoryId,
              category: category ? category.name : "Uncategorised",
              dueAt: updatedTaskData.dueAt,
              description: updatedTaskData.notes ?? undefined,
            }
          : task,
      ),
    );

    setTaskToEdit(null);
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

  const handleToggleComplete = (taskId: number) => {
    setTasks((prevTasks) => {
      const taskToToggle = prevTasks.find((task) => task.id === taskId);

      if (!taskToToggle) return prevTasks;

      const updatedTask = {
        ...taskToToggle,
        completed: !taskToToggle.completed,
      };

      // remove old task
      const remainingTasks = prevTasks.filter((task) => task.id !== taskId);

      // if completing → move to end
      if (!taskToToggle.completed) {
        return [...remainingTasks, updatedTask];
      }

      // if restoring → keep position simple (top or same)
      return [updatedTask, ...remainingTasks];
    });
  };

  const handleCloseTaskForm = () => {
    if (taskToEdit) {
      setTaskToEdit(null);
      return;
    }

    if (taskToDuplicate) {
      setTaskToDuplicate(null);
      return;
    }

    handleCloseAddTask();
  };

  const taskFormInitialData = taskToEdit ?? taskToDuplicate;
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
          onOpenAddTask={handleOpenAddTask}
          onCategoryChange={setActiveCategoryId}
          onDeleteTask={handleDeleteTask}
          onSetTaskToToday={handleSetTaskToToday}
          onDuplicateTask={handleDuplicateTask}
          onEditTask={handleEditTask}
          onToggleComplete={handleToggleComplete}
        />
      </div>

      {isAddTaskOpen || !!taskToEdit || !!taskToDuplicate ? (
        <div className={styles["todo-page__modal"]} onClick={handleCloseTaskForm}>
          <div className={styles["todo-page__modal-content"]} onClick={(e) => e.stopPropagation()}>
            <TaskForm
              onClose={handleCloseTaskForm}
              onAddTask={taskToEdit ? handleUpdateTask : handleAddTask}
              onAddCategory={handleAddCategory}
              categories={categories}
              mode={taskToEdit ? "edit" : taskToDuplicate ? "duplicate" : "add"}
              initialData={
                taskFormInitialData
                  ? {
                      title: taskFormInitialData.title,
                      categoryId: taskFormInitialData.categoryId,
                      dueAt: taskFormInitialData.dueAt,
                      notes: taskFormInitialData.description ?? null,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      ) : null}

      {categoryToDelete ? (
        <CategoryDeleteModal categoryName={categoryToDelete.name} onClose={handleCancelDeleteCategory} onConfirm={handleConfirmDeleteCategory} />
      ) : null}
      {taskToDelete ? <TaskDeleteModal taskTitle={taskToDelete.title} onClose={handleCancelDeleteTask} onConfirm={handleConfirmDeleteTask} /> : null}
    </div>
  );
}
