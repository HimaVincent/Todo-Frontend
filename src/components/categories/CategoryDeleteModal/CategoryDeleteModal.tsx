import styles from "./CategoryDeleteModal.module.scss";

type CategoryDeleteMode = "keep_tasks" | "delete_all_tasks";

interface CategoryDeleteModalProps {
  categoryName: string;
  onClose: () => void;
  onConfirm: (mode: CategoryDeleteMode) => void;
}

export function CategoryDeleteModal({ categoryName, onClose, onConfirm }: CategoryDeleteModalProps) {
  return (
    <div className={styles["category-delete-modal__overlay"]}>
      <div className={styles["category-delete-modal"]}>
        <div className={styles["category-delete-modal__header"]}>
          <h2 className={styles["category-delete-modal__title"]}>Delete category</h2>
        </div>

        <p className={styles["category-delete-modal__text"]}>
          Choose how to delete <strong>"{categoryName}"</strong>.
        </p>

        <div className={styles["category-delete-modal__options"]}>
          <button
            className={`${styles["category-delete-modal__option"]} ${styles["category-delete-modal__option--danger"]}`}
            type="button"
            onClick={() => onConfirm("delete_all_tasks")}
          >
            Delete category and all tasks in it
          </button>

          <button className={styles["category-delete-modal__option"]} type="button" onClick={() => onConfirm("keep_tasks")}>
            Delete category and move tasks to All tasks
          </button>
        </div>

        <div className={styles["category-delete-modal__footer"]}>
          <button className={styles["category-delete-modal__cancel"]} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
