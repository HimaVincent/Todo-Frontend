import { TaskCard } from "../TaskCard/TaskCard";
import { TaskFilterChips } from "../TaskFilterChips/TaskFilterChips";
import styles from "./TaskList.module.scss";
import { EmptyIcon } from "../../../assets/icons";

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
  filterType: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  filter: FilterVariant;
  onFilterChange: (filter: FilterVariant) => void;
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  categories: Category[];
  onDeleteTask: (taskId: number) => void;
  onSetTaskToToday: (taskId: number) => void;
  onDuplicateTask: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
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
  onToggleComplete,
}: TaskListProps) {
  const activeCategoryName = activeCategoryId === null ? null : (categories.find((category) => category.id === activeCategoryId)?.name ?? null);

  const activeTasks = tasks.filter((task) => !task.completed);

  const filterMatchedTasks = filter === "all" ? activeTasks : activeTasks.filter((task) => task.filterType === filter);

  const visibleTasks = activeCategoryId === null ? filterMatchedTasks : filterMatchedTasks.filter((task) => task.categoryId === activeCategoryId);

  const showAllTasksHeading = filter === "all" && activeCategoryName === null;
  const showFilterChip = filter !== "all";
  const showCategoryChip = activeCategoryName !== null;

  return (
    <div className={styles["task-list"]}>
      <div className={styles["task-list__header"]}>
        <h2 className={styles["task-list__title"]}>
          {showAllTasksHeading ? (
            "All tasks"
          ) : (
            <>
              {showFilterChip ? (
                <>
                  <TaskFilterChips activeFilter={filter} onClear={() => onFilterChange("all")} />
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
              onToggleComplete={onToggleComplete}
              completed={task.completed}
            />
          ))}
        </div>
      ) : (
        <div className={styles["task-list__empty"]}>
          <div className={styles["task-list__empty-icon"]}>
            <EmptyIcon />
          </div>
          <h3 className={styles["task-list__empty-title"]}>No tasks found</h3>
          <p className={styles["task-list__empty-text"]}>Try a different search or add a new task.</p>
        </div>
      )}
    </div>
  );
}
