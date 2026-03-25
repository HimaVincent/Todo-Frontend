import { useState } from "react";
import styles from "./TaskForm.module.scss";

interface TaskFormProps {
  onClose: () => void;
  onAddTask: (task: any) => void;
  categories: { id: number; name: string }[];
  mode?: "add" | "duplicate";
  initialData?: {
    title: string;
    categoryId: number | null;
    dueAt?: string | null;
    notes?: string | null;
  };
}

export function TaskForm({ onClose, onAddTask, categories, mode = "add", initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?.toString() ?? "");
  const [dueDate, setDueDate] = useState(initialData?.dueAt ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTask = {
      title: title.trim(),
      categoryId: categoryId ? Number(categoryId) : null,
      dueAt: dueDate || null,
      notes: notes.trim() || null,
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <form className={styles["task-form"]} onSubmit={handleSubmit}>
      <div className={styles["task-form__header"]}>
        <h3 className={styles["task-form__title"]}>{mode === "duplicate" ? "Duplicate task" : "Add Task"}</h3>
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          className={styles["task-form__input"]}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-category">
          Category
        </label>
        <select id="task-category" className={styles["task-form__select"]} value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">No category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-due-date">
          Due date
        </label>

        <input
          id="task-due-date"
          className={`${styles["task-form__input"]} ${styles["task-form__input--date"]}`}
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <div className={styles["task-form__field"]}>
        <label className={styles["task-form__label"]} htmlFor="task-notes">
          Notes
        </label>
        <textarea
          id="task-notes"
          className={styles["task-form__textarea"]}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add details"
          rows={4}
        />
      </div>

      <div className={styles["task-form__actions"]}>
        <button className={styles["task-form__button"] + " " + styles["task-form__button--secondary"]} type="button" onClick={onClose}>
          Cancel
        </button>

        <button className={styles["task-form__button"] + " " + styles["task-form__button--primary"]} type="submit">
          {mode === "duplicate" ? "Create duplicate" : "Save task"}
        </button>
      </div>
    </form>
  );
}
