import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar/Sidebar";
import { MainPanel } from "../../components/layout/MainPanel/MainPanel";
import { CategoryDeleteModal } from "../../components/categories/CategoryDeleteModal/CategoryDeleteModal";
import { TaskDeleteModal } from "../../components/tasks/TaskDeleteModal/TaskDeleteModal";
import { TaskForm } from "../../components/tasks/TaskForm/TaskForm";
import { getTasks, createTask, updateTask, updateTaskCompletion, deleteTask } from "../../services/taskService";
import { getCategories, createCategory } from "../../services/categoryService";
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
  completedAt?: string | null;
}

interface NewTaskInput {
  title: string;
  categoryId: number | null;
  dueAt: string | null;
  notes: string | null;
}

export function TodoPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterVariant>("all");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDuplicate, setTaskToDuplicate] = useState<Task | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedTasks, fetchedCategories] = await Promise.all([getTasks(), getCategories()]);
        setTasks(fetchedTasks);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load to-do data", error);
      }
    };
    loadData();
  }, []);

  const handleAddCategory = async (name: string): Promise<Category | null> => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;
    const alreadyExists = categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (alreadyExists) return null;
    try {
      const newCategory = await createCategory(trimmedName);
      const refreshedCategories = await getCategories();
      setCategories(refreshedCategories);
      return newCategory;
    } catch (error) {
      console.error("Failed to create category", error);
      return null;
    }
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

  const handleAddTask = async (newTask: NewTaskInput) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks((prevTasks) => [createdTask, ...prevTasks]);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleSetTaskToToday = async (taskId: number) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const updatedTask = await updateTask(taskId, {
        dueAt: today,
      });

      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (error) {
      console.error("Error setting task to today:", error);
    }
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

  const handleUpdateTask = async (updatedTaskData: any) => {
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

  const handleRequestDeleteTask = (taskId: number) => {
    const task = tasks.find((task) => task.id === taskId);

    if (!task) return;

    setTaskToDelete(task);
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));

      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCancelDeleteTask = () => {
    setTaskToDelete(null);
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

  const handleToggleTaskCompletion = async (taskId: number) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (!taskToUpdate) return;

    try {
      const updatedTask = await updateTaskCompletion(taskId, !taskToUpdate.completed);

      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
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
          onDeleteTask={handleRequestDeleteTask}
          onSetTaskToToday={handleSetTaskToToday}
          onDuplicateTask={handleDuplicateTask}
          onEditTask={handleEditTask}
          onToggleComplete={handleToggleTaskCompletion}
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
