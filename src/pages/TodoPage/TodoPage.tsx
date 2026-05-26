import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar/Sidebar";
import { MainPanel } from "../../components/layout/MainPanel/MainPanel";
import { CategoryDeleteModal } from "../../components/categories/CategoryDeleteModal/CategoryDeleteModal";
import { TaskDeleteModal } from "../../components/tasks/TaskDeleteModal/TaskDeleteModal";
import { TaskForm } from "../../components/tasks/TaskForm/TaskForm";
import { getTasks, createTask, updateTask, updateTaskCompletion, deleteTask } from "../../services/taskService";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Filter state
  const [activeCategoryId, setActiveCategoryId] = useState<number | "uncategorised" | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterVariant>("all");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  // Category modal state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Task modal state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDuplicate, setTaskToDuplicate] = useState<Task | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [fetchedTasks, fetchedCategories] = await Promise.all([getTasks(), getCategories()]);

        setTasks(fetchedTasks);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load to-do data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ===== Category Handlers =====================================================================================================

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

  const handleEditCategory = async (id: number, newName: string) => {
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
    try {
      const updatedCategory = await updateCategory(id, trimmedName);

      setCategories((prevCategories) => prevCategories.map((category) => (category.id === id ? updatedCategory : category)));

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.categoryId === id
            ? {
                ...task,
                category: updatedCategory.name,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error("Failed to update category", error);
    }
  };

  const handleDeleteCategoryClick = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleCancelDeleteCategory = () => {
    setCategoryToDelete(null);
  };

  const handleConfirmDeleteCategory = async (mode: CategoryDeleteMode) => {
    if (!categoryToDelete) {
      return;
    }
    try {
      await deleteCategory(categoryToDelete.id, mode);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryToDelete.id));
      if (mode === "keep_tasks") {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.categoryId === categoryToDelete.id
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
        setTasks((prevTasks) => prevTasks.filter((task) => task.categoryId !== categoryToDelete.id));
      }
      if (activeCategoryId === categoryToDelete.id) {
        setActiveCategoryId(null);
      }
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  // ===== Task Form Handlers =========================================================================================================

  const handleOpenAddTask = () => setIsAddTaskOpen(true);
  const handleCloseAddTask = () => setIsAddTaskOpen(false);

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

  const handleAddTask = async (newTask: NewTaskInput) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks((prevTasks) => [createdTask, ...prevTasks]);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleUpdateTask = async (updatedTaskData: NewTaskInput) => {
    if (!taskToEdit) return;

    try {
      const updatedTask = await updateTask(taskToEdit.id, updatedTaskData);

      setTasks((prevTasks) => [updatedTask, ...prevTasks.filter((task) => task.id !== taskToEdit.id)]);

      setTaskToEdit(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setTaskToEdit(task);
  };

  const handleDuplicateTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setTaskToDuplicate(task);
  };

  // ===== Task Action Handlers =====================================================================================================

  const handleSetTaskToToday = async (taskId: number) => {
    try {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Australia/Melbourne",
      });

      const updatedTask = await updateTask(taskId, {
        dueAt: today,
      });

      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (error) {
      console.error("Error setting task to today:", error);
    }
  };

  const handleToggleTaskCompletion = async (taskId: number) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (!taskToUpdate) return;

    try {
      const updatedTask = await updateTaskCompletion(taskId, !taskToUpdate.completed);

      setTasks((prevTasks) => {
        const remainingTasks = prevTasks.filter((task) => task.id !== taskId);

        if (!updatedTask.completed) {
          return [updatedTask, ...remainingTasks];
        }

        return [...remainingTasks, updatedTask];
      });
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  // ===== Task Delete Handlers =========================================================================================================

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

  // ===== Derived Data ==============================================================================================================

  const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()));

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Australia/Melbourne",
  });

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const getTaskDate = (dueAt: string | null) => (dueAt ? dueAt.split("T")[0] : null);

  const filterCounts = {
    today: activeTasks.filter((task) => getTaskDate(task.dueAt) === today).length,
    overdue: activeTasks.filter((task) => {
      const taskDate = getTaskDate(task.dueAt);
      return taskDate !== null && taskDate < today;
    }).length,
    scheduled: activeTasks.filter((task) => {
      const taskDate = getTaskDate(task.dueAt);
      return taskDate !== null && taskDate > today;
    }).length,
    unscheduled: activeTasks.filter((task) => task.dueAt === null).length,
    all: activeTasks.length,
    completed: completedTasks.length,
  };

  const allTasksCount = filterCounts.all;
  const uncategorisedTasksCount = activeTasks.filter((task) => task.categoryId === null).length;
  const getCategoryTaskCount = (categoryId: number) => activeTasks.filter((task) => task.categoryId === categoryId).length;
  const taskFormInitialData = taskToEdit ?? taskToDuplicate;

  const handleFilterChange = (filter: FilterVariant) => {
    setActiveFilter(filter);
  };

  if (isLoading) {
    return (
      <div className={styles["todo-page__loading"]}>
        <div className={styles["todo-page__spinner"]}></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className={styles["todo-page"]}>
      <div className={styles["todo-page__container"]}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeFilter={activeFilter}
          onChange={handleFilterChange}
          categories={filteredCategories}
          categorySearchTerm={categorySearchTerm}
          onCategorySearchChange={setCategorySearchTerm}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategoryClick}
          onRenameCategory={handleEditCategory}
          allTasksCount={allTasksCount}
          uncategorisedTasksCount={uncategorisedTasksCount}
          getCategoryTaskCount={getCategoryTaskCount}
          filterCounts={filterCounts}
        />

        <MainPanel
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
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
              onSubmitTask={taskToEdit ? handleUpdateTask : handleAddTask}
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
