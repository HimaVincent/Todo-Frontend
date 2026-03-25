import { useState } from "react";
import { CompletedTaskList } from "../../tasks/CompletedTaskList/CompletedTaskList";
import { TaskForm } from "../../tasks/TaskForm/TaskForm";
import { TaskList } from "../../tasks/TaskList/TaskList";
import { TaskToolbar } from "../../tasks/TaskToolbar/TaskToolbar";
import styles from "./MainPanel.module.scss";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

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

interface NewTaskInput {
  title: string;
  categoryId: number | null;
  dueAt: string | null;
  notes: string | null;
}

interface MainPanelProps {
  activeFilter: FilterVariant;
  onFilterChange: (filter: FilterVariant) => void;
  categories: { id: number; name: string }[];
  activeCategoryId: number | null;
  tasks: Task[];
  onAddTask: (task: NewTaskInput) => void;
  onCategoryChange: (id: number | null) => void;
  onDeleteTask: (taskId: number) => void;
  onSetTaskToToday: (taskId: number) => void;
  onDuplicateTask: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
}

export function MainPanel({
  activeFilter,
  onFilterChange,
  categories,
  activeCategoryId,
  tasks,
  onAddTask,
  onCategoryChange,
  onDeleteTask,
  onSetTaskToToday,
  onDuplicateTask,
  onToggleComplete,
}: MainPanelProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <section className={styles["main-panel"]}>
      <header className={styles["main-panel__header"]}>
        <h2 className={styles["main-panel__greeting"]}>Hey, Good Morning!</h2>
        <p className={styles["main-panel__subtitle"]}>It's Monday - 16th March 2026, there are 0 items due today.</p>
      </header>

      <div className={styles["main-panel__toolbar"]}>
        <TaskToolbar onAddTask={() => setIsTaskModalOpen(true)} />
      </div>

      <div className={styles["main-panel__content"]}>
        <TaskList
          tasks={tasks}
          filter={activeFilter}
          onFilterChange={onFilterChange}
          activeCategoryId={activeCategoryId}
          onCategoryChange={onCategoryChange}
          categories={categories}
          onDeleteTask={onDeleteTask}
          onSetTaskToToday={onSetTaskToToday}
          onDuplicateTask={onDuplicateTask}
          onToggleComplete={onToggleComplete}
        />
        <CompletedTaskList />
      </div>

      {isTaskModalOpen ? (
        <div className={styles["main-panel__modal"]} onClick={() => setIsTaskModalOpen(false)}>
          <div className={styles["main-panel__modal-content"]} onClick={(event) => event.stopPropagation()}>
            <TaskForm onClose={() => setIsTaskModalOpen(false)} onAddTask={onAddTask} categories={categories} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
