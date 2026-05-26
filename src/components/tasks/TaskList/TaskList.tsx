import { TaskCard } from "../TaskCard/TaskCard";
import { TaskFilterChips } from "../TaskFilterChips/TaskFilterChips";
import styles from "./TaskList.module.scss";
import { EmptyState } from "../../common/EmptyState/EmptyState";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

interface Category {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  categoryId: number | null;
  category: string;
  dueAt?: string | null;
  description?: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  filter: FilterVariant;
  onFilterChange: (filter: FilterVariant) => void;
  activeCategoryId: number | "uncategorised" | null;
  onCategoryChange: (id: number | "uncategorised" | null) => void;
  categories: Category[];
  onDeleteTask: (taskId: number) => void;
  onSetTaskToToday: (taskId: number) => void;
  onDuplicateTask: (taskId: number) => void;
  onEditTask: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
  hideEmptyState?: boolean;
}

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  activeCategoryId,
  onCategoryChange,
  categories,
  onDeleteTask,
  onSetTaskToToday,
  onDuplicateTask,
  onEditTask,
  onToggleComplete,
  hideEmptyState = false,
}: TaskListProps) {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Australia/Melbourne",
  });

  const getTaskDateValue = (dueAt?: string | null) => {
    if (!dueAt) {
      return null;
    }
    return dueAt.split("T")[0];
  };

  const doesTaskMatchFilter = (task: Task) => {
    const taskDate = getTaskDateValue(task.dueAt);
    if (filter === "all") {
      return true;
    }
    if (filter === "unscheduled") {
      return taskDate === null;
    }
    if (filter === "today") {
      return taskDate === today;
    }
    if (filter === "overdue") {
      return taskDate !== null && taskDate < today;
    }
    if (filter === "scheduled") {
      return taskDate !== null && taskDate > today;
    }
    return false;
  };

  const activeCategoryName =
    activeCategoryId === null
      ? null
      : activeCategoryId === "uncategorised"
        ? "Uncategorised"
        : (categories.find((category) => category.id === activeCategoryId)?.name ?? null);
  const activeTasks = filter === "completed" ? tasks : tasks.filter((task) => !task.completed);
  const filterMatchedTasks = activeTasks.filter(doesTaskMatchFilter);
  const visibleTasks =
    activeCategoryId === null
      ? filterMatchedTasks
      : activeCategoryId === "uncategorised"
        ? filterMatchedTasks.filter((task) => task.categoryId === null)
        : filterMatchedTasks.filter((task) => task.categoryId === activeCategoryId);
  const showAllTasksHeading = filter === "all" && activeCategoryName === null;
  const showFilterChip = filter !== "all" && filter !== "completed";
  const showCompletedChip = filter === "completed";
  const showCategoryChip = activeCategoryName !== null;

  return (
    <div className={styles["task-list"]}>
      <div className={styles["task-list__header"]}>
        <h2 className={styles["task-list__title"]}>
          {showAllTasksHeading ? (
            "All tasks"
          ) : (
            <>
              {showFilterChip || showCompletedChip ? (
                <>
                  {showCompletedChip ? (
                    <TaskFilterChips activeFilter="completed" onClear={() => onFilterChange("all")} />
                  ) : (
                    <TaskFilterChips activeFilter={filter} onClear={() => onFilterChange("all")} />
                  )}
                  <span className={styles["task-list__title-text"]}>tasks</span>
                </>
              ) : (
                <span className={styles["task-list__title-text"]}>Tasks</span>
              )}

              {showCategoryChip ? (
                <>
                  <span className={styles["task-list__title-text"]}>in</span>
                  <button
                    type="button"
                    className={`${styles["task-list__chip"]} ${styles["task-list__chip--category"]}`}
                    onClick={() => onCategoryChange(null)}
                  >
                    <span>{activeCategoryName}</span>
                    <span className={styles["task-list__chip-close"]}>×</span>
                  </button>
                  <span className={styles["task-list__title-text"]}>category</span>
                </>
              ) : null}
            </>
          )}
        </h2>
      </div>

      {visibleTasks.length > 0 ? (
        <div className={styles["task-list__items"]}>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              category={task.category}
              dueAt={task.dueAt}
              description={task.description}
              onDeleteTask={onDeleteTask}
              onSetTaskToToday={onSetTaskToToday}
              onDuplicateTask={onDuplicateTask}
              onEditTask={onEditTask}
              onToggleComplete={onToggleComplete}
              completed={task.completed}
            />
          ))}
        </div>
      ) : hideEmptyState ? null : (
        <EmptyState title="No tasks found" text="Try a different filter or add a new task." />
      )}
    </div>
  );
}
